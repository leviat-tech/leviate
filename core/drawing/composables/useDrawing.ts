import { computed, ComputedRef, inject, Reactive, reactive, Ref, ref } from 'vue';
import { remove, intersection, isEqual } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';

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

export const DIVIDER_ID = 'divider'

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
  };
  actionKeys: {
    Escape: boolean;
    Backspace: boolean;
    Delete: boolean;
  };
  // mouseButtons: {
  //   left: boolean;
  //   right: boolean;
  // };
  toolParams: any,
  sectionCut?: {
    a: Point,
    b: Point;
  };
  invalidFeatures: string[];
  intersectingFeatures: { [id: string]: string[] };
}

interface Viewport {
  config: ViewportConfig;
  sketch: Ref<Sketch | null>;
  state: ViewportState;
  validateFeature: (panelDraft: Sketch, featureDraft: Sketch, allowOnEdge: boolean) => void;
  validateFeaturesIntersection: (featureA: Sketch, featureB: Sketch) => void;
  useValidityCheck: (id: string) => ComputedRef<boolean>
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
  _register: (toolConfig: ToolItem | null) => void;
  _raw: ToolsStore;
  _setCurrent: (toolId: string, parentId?: string | null) => boolean | Promise<boolean> | void;
  addDefaultIcons: () => void
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

function createTools(): Tools {
  const localTools: Tools = {
    ...availableTools,
    current: {},
    _register: () => { },
    _raw: {},
    _setCurrent: () => { },
    addDefaultIcons: () => { },
    icons: toolIcons,
  };

  const proxy = new Proxy(localTools, {
    get(target, prop: string) {
      switch (prop) {
        case 'current':
          return { [currentTool.value]: true };
        case '_register':
          return (toolConfig: ToolItem | null) => {
            if (!toolConfig) {
              localTools[uuidv4()] = {
                id: DIVIDER_ID
              };
              return
            }

            const { id } = toolConfig;
            if (localTools[id]) {
              Object.assign(localTools[id], toolConfig);
            } else {
              localTools[id] = toolConfig;
            }
          };
        case '_raw':
          return localTools;
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

        case 'addDefaultIcons':
          return () => {
            DEFAULT_TOOLS.forEach(toolId => {
              proxy._register({
                id: toolId,
                icon: toolIcons[toolId],
              });
            });
          };

        default:
          if (localTools[prop]) {
            return prop;
          }

          return Reflect.get(target, prop);
      }
    },
  });

  return proxy;
}

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
    invalidFeatures: [] as string[],
    intersectingFeatures: {} as { [id: string]: string[] },
  });

  //validate if a feature's located inside panel
  function validateFeature(panelDraft: Sketch, featureDraft: Sketch, allowOnEdge = false) {
    featureDraft = removeFailingFeatures(featureDraft)!;
    const validRelations = allowOnEdge
      ? [[RELATIONS.A_CONTAINS_B], [RELATIONS.A_CONTAINS_B, RELATIONS.INTERSECTION]] //contains+intersection=covers
      : [[RELATIONS.A_CONTAINS_B]]
    const foundRelations = getShapesRelations(panelDraft, featureDraft);
    //if no array returned, there's an error (loged by getShapesRelations)
    if (!foundRelations) return;

    const featureId = featureDraft.node.dataset.id;
    const [, relations] = foundRelations;
    const isFeatureValid = validRelations.some(validR => isEqual(validR, relations.sort()))
    if (isFeatureValid) remove(state.invalidFeatures, (id: string) => id === featureId)
    else if (!state.invalidFeatures.includes(featureId)) state.invalidFeatures.push(featureId)
  }
  //validate how a feature's located related to another feature - intersecting, covering, containing
  function validateFeaturesIntersection(featureA: Sketch, featureB: Sketch, allowOnEdge = false) {
    featureA = removeFailingFeatures(featureA)!;
    featureB = removeFailingFeatures(featureB)!;
    const validRelations = allowOnEdge
      ? [[ /*not related*/], [RELATIONS.A_TOUCHES_B, RELATIONS.INTERSECTION]]
      : [[ /*not related*/]]
    //checking for any possible relation, i.e. default 'all' relations apply
    const foundRelations = getShapesRelations(featureA, featureB);
    //if no array returned, there's an error (loged by getShapesRelations)
    if (!foundRelations) return;
    const featureAId = featureA.node.dataset.id;
    const featureBId = featureB.node.dataset.id;
    const [, relations] = foundRelations;

    const areFeaturesValidRelated = validRelations.some(validR => isEqual(validR, relations.sort()))

    if (areFeaturesValidRelated) {
      if (state.intersectingFeatures[featureAId]) remove(state.intersectingFeatures[featureAId], (id: string) => id === featureBId)
      if (state.intersectingFeatures[featureBId]) remove(state.intersectingFeatures[featureBId], (id: string) => id === featureAId)
    }
    else {
      if (!state.intersectingFeatures[featureAId]) state.intersectingFeatures[featureAId] = [];
      if (!state.intersectingFeatures[featureBId]) state.intersectingFeatures[featureBId] = [];

      if (!state.intersectingFeatures[featureAId].includes(featureBId)) state.intersectingFeatures[featureAId].push(featureBId);
      if (!state.intersectingFeatures[featureBId].includes(featureAId)) state.intersectingFeatures[featureBId].push(featureAId);
    }
  }

  function useValidityCheck(id: string) {
    const isValid = computed(() => {
      return !state.invalidFeatures.includes(id)
        && !Object.values(state.intersectingFeatures).flat().includes(id)
    })

    return isValid;
  }

  return {
    config: { ...config, ...globalConfig },
    sketch: ref(null),
    state,
    validateFeature,
    validateFeaturesIntersection,
    useValidityCheck
  };
}

const popup = reactive({
  target: null,
  isOpen: false,
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
    tools: createTools(), // fresh instance per call,
    openPopup,
    closePopup,
    popup,
  };
}

//NOTE: relation A_contains_B - shape B lies in the interior of shape A,
//relation A_contains_B + intersection - every point of B lies or in the interior or on the boundary of shape A = A covers B

export function getShapesRelations(draftA: Sketch, draftB: Sketch, relations = Object.values(RELATIONS)): undefined | [boolean, string[]] {
  const foundRelations = [];

  if (!draftA?.shape || !draftB?.shape || relations?.length < 1) {
    console.error('Arguments are invalid. Please check expected arguments\' types');
    return;
  }

  if (relations.includes(RELATIONS.A_CONTAINS_B)) {
    if (draftA.shape.contains(draftB.shape)) foundRelations.push(RELATIONS.A_CONTAINS_B)
  }
  if (relations.includes(RELATIONS.B_CONTAINS_A)) {
    if (draftB.shape.contains(draftA.shape)) foundRelations.push(RELATIONS.B_CONTAINS_A)
  }
  if (intersection(relations, [RELATIONS.INTERSECTION, RELATIONS.A_TOUCHES_B]).length > 0) {
    const intersection = draftA.shape.intersect(draftB.shape);
    if (intersection.length > 0) {
      foundRelations.push(RELATIONS.INTERSECTION)
      try {
        //check if A touches B (or vice versa)
        const draftAWithoutIntersection = draftA.subtract(draftB);
        const draftBWithoutIntersection = draftB.subtract(draftA);
        const intersectionDraftA = draftA.subtract(draftAWithoutIntersection);
        const intersectionDraftB = draftB.subtract(draftBWithoutIntersection);

        //if one draft remains 'unchanged' by intersection, the second one should as well. Second check's here just to increase a chance of detection 
        if (intersectionDraftA.vertices.length === 0 || intersectionDraftB.vertices.length === 0) foundRelations.push(RELATIONS.A_TOUCHES_B)
      } catch {
        console.log("Error while checking drafts' intersection variants.")
      }
    }
  }
  return [foundRelations.length > 0, foundRelations]
}

export function removeFailingFeatures(sketch: Sketch, removeTypes = ['text'] ) {
  if(!sketch) return;
  
  remove(sketch.node.children, ({ node }) => removeTypes.includes(node.feature))
  
  if(sketch.node.children.length > 0) {
    sketch.node.children.forEach(child => removeFailingFeatures(child))
  }
  
  return sketch;
}
