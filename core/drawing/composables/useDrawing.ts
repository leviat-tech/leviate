import { inject, Reactive, reactive, Ref, ref } from 'vue';
import { almost_equal } from '../utils';
import {remove} from 'lodash-es';

import { Point, Sketch, ToolItem } from '../types';
import { DEFAULT_TOOLS, RELATIONS } from "../constants";

import pointer from '../assets/pointer.svg';
import new_polygon from '../assets/new_polygon.svg';
import add_vertex from '../assets/add_vertex.svg';
import delete_vertex from '../assets/delete_vertex.svg';
import round_off from '../assets/round_off.svg';
import mirror_geometry from '../assets/mirror_geometry.svg';

const toolIcons = {
  pointer,
  new_polygon,
  add_vertex,
  delete_vertex,
  round_off,
  mirror_geometry,
};

interface ViewportConfig {
  fontSizePx: number;
  unitScaleFactor: number;
  dimFormatter?: (value: number) => string;
  proximityDistance?: number;
  precision?: number;
  showGrid: boolean;
  vertexRadius: number;
}

type UserViewportConfig = Partial<ViewportConfig> | undefined;

interface ViewportState {
  currentTool: string;
  isPointerActive: boolean;
  isDragging: boolean;
  isChildMenuOpen: boolean;
  gridPrecision: number;
  pxToSvg: number;
  pxPerGridUnit: number;
  currentPoint: Point;
  selectedFeatureId: string | null;
  keyModifiers: {
    Alt: boolean;
    Control: boolean;
    Shift: boolean;
    Meta: boolean;
  },
  actionKeys: {
    Escape: boolean;
    Backspace: boolean;
    Delete: boolean;
  },
  mouseButtons: {
    left: boolean;
    right: boolean;
  },
  toolParams: any,
  sectionCut: {
    a: Point,
    b: Point;
  },
}

interface Viewport {
  config: ViewportConfig;
  sketch: Ref<Sketch | null>;
  state: ViewportState;
}

interface ViewportsStore {
  [key: string]: Viewport;
}

interface ToolsStore {
  [key: string]: ToolItem;
}

type CurrentTool = { [key: string]: true };

interface Tools {
  current: CurrentTool;
  _register: (toolConfig: ToolItem) => void;
  _raw: ToolsStore;
  _setCurrent: (toolId: string, parentId?: string | null) => boolean | Promise<boolean> | void;
  [key: string]:
  ToolsStore |
  CurrentTool |
  ((toolConfig: ToolItem) => void) |
  ((toolId: string) => boolean | Promise<boolean> | void) |
  string
}

const globalConfig = reactive({
  $l: (val: string) => val,
});

const currentTool = ref('pointer');
const setCurrentTool = (tool: string) => {
  currentTool.value = tool;
};
const availableTools: ToolsStore = {};
// @ts-expect-error - Tools is correct interface but error due to Proxy
const tools: Tools = new Proxy(availableTools, {
  get(target, prop: string) {
    switch (prop) {
      case 'current':
        return { [currentTool.value]: true };
      case '_register':
        return (toolConfig: ToolItem) => {
          const { id } = toolConfig;
          if (availableTools[id]) {
            Object.assign(availableTools[id], toolConfig);
          } else {
            availableTools[toolConfig.id] = toolConfig;
          }
        };
      case '_raw':
        return availableTools;
      case '_setCurrent':
        return (toolId: string, parentId?: string) => {
          let handler;

          if (parentId) {
            handler = availableTools[parentId]?.children?.find(child => child.id === toolId)?.handler
          } else {
            handler = availableTools[toolId]?.handler
          }

          if (!handler) {
            setCurrentTool(toolId);
            return;
          }

          const res = handler(toolId);

          if (res === true) {
            setCurrentTool(toolId);
            return;
          }

          if (res instanceof Promise) {
            res.then(val => {
              if (val === true) {
                setCurrentTool(toolId);
              }
            });
          }
        };
      case 'icons':
        return toolIcons;

      default:
        if (availableTools[prop]) {
          return prop;
        }

        return Reflect.get(target, prop);
    }
  },
});

DEFAULT_TOOLS.forEach(toolId => {
  tools._register({
    id: toolId,
    icon: toolIcons[toolId]
  })
});

function getOrigin() {
  return { x: 0, y: 0 };
}

const viewports: ViewportsStore = {};

function createViewport(userConfig: UserViewportConfig): Viewport {
  const config = reactive({
    fontSizePx: 12,
    unitScaleFactor: 1,
    // distance to scale between the pointer and a segment to show a new suggested vertex
    proximityDistance: 10,
    precision: 1,
    showGrid: true,
    vertexRadius: 4,
    circleOpeningDiameter: 0.2,
    ...userConfig,
  });

  const state = reactive({
    currentTool,
    keyModifiers: {
      Alt: false,
      Control: false,
      Shift: false,
      Meta: false,
    },
    actionKeys: {
      Escape: false,
      Backspace: false,
      Delete: false,
    },
    isDragging: false,
    isChildMenuOpen: false,
    isPointerActive: false,
    gridPrecision: 1,
    pxToSvg: 1,
    pxPerGridUnit: 1,
    currentPoint: getOrigin(),
    // activePath: null,
    selectedFeatureId: null,
    toolParams: ref({}),
    invalidFeatures: ref([]) as Ref<string[]>,
    intersectingFeatures: ref({}) as Ref<{[id: string]: string[]}>,
  });

  //validate if a feature's located inside panel
  function validateFeature(panelDraft: Sketch, featureDraft: Sketch, allowOnEdge = false){
    const relation = allowOnEdge ? RELATIONS.A_COVERS_B : RELATIONS.A_CONTAINS_B;
    
    const foundRelations = getShapesRelations(panelDraft, featureDraft, [relation]);
    //if no array returned, there's an error (loged by getShapesRelations)
    if(!foundRelations) return;

    const featureId = featureDraft.node.dataset.id;
    const [ isFeatureValid ] = foundRelations;
    if(isFeatureValid) remove(state.invalidFeatures, (id:string) => id === featureId as string)
    else if(!state.invalidFeatures.includes(featureId)) state.invalidFeatures.push(featureId)  
  }
  //validate how a feature's located related to another feature - intersecting, covering, containing
  function validateFeaturesIntersection(featureA: Sketch, featureB: Sketch){
    //checking for any possible relation, i.e. default 'all' relations apply
    const foundRelations = getShapesRelations(featureA, featureB);
    //if no array returned, there's an error (loged by getShapesRelations)
    if(!foundRelations) return;
    const featureAId = featureA.node.dataset.id;
    const featureBId = featureB.node.dataset.id;
    const [ areFeaturesRelated ] = foundRelations;
    if(!areFeaturesRelated) {
      if(state.intersectingFeatures[featureAId]) remove(state.intersectingFeatures[featureAId], (id:string) => id === featureBId as string)
      if(state.intersectingFeatures[featureBId]) remove(state.intersectingFeatures[featureBId], (id:string) => id === featureAId as string)
    }
    else {
      if(!state.intersectingFeatures[featureAId]) state.intersectingFeatures[featureAId] = [];
      if(!state.intersectingFeatures[featureBId]) state.intersectingFeatures[featureBId] = [];

      if(!state.intersectingFeatures[featureAId].includes(featureBId)) state.intersectingFeatures[featureAId].push(featureBId);
      if(!state.intersectingFeatures[featureBId].includes(featureAId)) state.intersectingFeatures[featureBId].push(featureAId);
    }  
  }

  return {
    config: { ...config, ...globalConfig },
    sketch: ref(null),
    state,
    validateFeature,
    validateFeaturesIntersection
  };
}

const popup = reactive({
  target: null,
  isOpen: true,
  x: 0,
  y: 0,
  data: {},
});

function openPopup(e: MouseEvent, data: unknown) {
  Object.assign(popup, {
    target: e.target,
    x: e.clientX,
    y: e.clientY,
    isOpen: true,
    data,
  });
}

function closePopup() {
  Object.assign(popup, {
    isOpen: false,
    data: {},
  });
}

interface ViewportExport extends Viewport {
  tools: Tools;
  openPopup: (e: MouseEvent, data: unknown) => void;
  closePopup: () => void;
  popup: Reactive<{
    target: HTMLElement | null;
    isOpen: boolean;
    x: number;
    y: number;
    data: any,
  }>
}

export default function useDrawing(config?: UserViewportConfig | undefined): ViewportExport {
  const viewportName = inject('viewportName', 'DEFAULT');

  viewports[viewportName] ??= createViewport(config);

  return {
    ...viewports[viewportName],
    tools,
    openPopup,
    closePopup,
    popup,
  };
}

//NOTE: relation A_contains_B - shape B lies in the interior of shape A,
//relation A_covers_B - every point of B lies or in the interior or on the boundary of shape A 

export function getShapesRelations(draftA: Sketch, draftB: Sketch, relations = Object.values(RELATIONS)){
  const foundRelations = [];

  if(!draftA?.shape || !draftB?.shape || relations?.length < 1){
    console.error('Arguments are invalid. Please check expected arguments\' types');
    return;
  }

  if(relations.includes(RELATIONS.INTERSECTION)){
    if(draftA.shape.intersect(draftB.shape).length > 0) foundRelations.push(RELATIONS.INTERSECTION) 
  }
  if(relations.includes(RELATIONS.A_CONTAINS_B)){
    if(draftA.shape.contains(draftB.shape)) foundRelations.push(RELATIONS.A_CONTAINS_B) 
  }
  if(relations.includes(RELATIONS.B_CONTAINS_A)){
    if(draftB.shape.contains(draftA.shape)) foundRelations.push(RELATIONS.B_CONTAINS_A) 
  }
  if(relations.includes(RELATIONS.A_COVERS_B)){
    const aContainsB = draftA.shape.contains(draftB.shape); 
    if(aContainsB) foundRelations.push(RELATIONS.A_COVERS_B);
    else {
      const aIntersectsB = draftA.shape.intersect(draftB.shape);
      const isLocatedOnEdge = aIntersectsB.length > 0 && aIntersectsB.every(point => draftB.vertices.some( vertice => {
        const equal = almost_equal(vertice.x, point.x) && almost_equal(vertice.y, point.y);
        return equal;
      }))
      if(isLocatedOnEdge) foundRelations.push(RELATIONS.A_COVERS_B)
    }
  }

  return [ foundRelations.length > 0, foundRelations ]
}
