import { inject, Reactive, reactive, Ref, ref } from 'vue';

import { Point, Sketch, ToolRegistrationConfig } from '../types';
import { DEFAULT_TOOLS, TOOLBAR_OPTIONS } from "../constants";

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
  fontSizePx?: number;
  dimFormatter?: (value: number) => string;
  proximityDistance?: number;
  precision?: number;
  showGrid: boolean;
  vertexRadius: number;
}

type UserViewportConfig = Partial<ViewportConfig> | undefined;

interface ViewportState {
  currentTool: string;
  keyModifiers: { [key: string]: boolean };
  isPointerActive: boolean;
  isDragging: boolean;
  gridPrecision: number;
  pxToSvg: number;
  currentPoint: Point;
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
  [key: string]: ToolRegistrationConfig;
}

type CurrentTool = { [key: string]: true };

interface Tools {
  current: CurrentTool;
  register: (toolConfig: ToolRegistrationConfig) => void;
  _raw: ToolsStore;
  _setCurrent: (toolId: string) => boolean | Promise<boolean> | void;
  [key: string]:
  ToolsStore |
  CurrentTool |
  ((toolConfig: ToolRegistrationConfig) => void) |
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
const tools = new Proxy(availableTools, {
  get(target, prop: string) {
    switch (prop) {
      case 'current':
        return { [currentTool.value]: true };
      case 'register':
        return (toolConfig: ToolRegistrationConfig) => {
          console.log(availableTools);
          if (!availableTools[toolConfig.id] && !toolConfig.icon) {
            throw new Error(`Tool '${toolConfig.id}' cannot be registered without an icon`);
          }

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
            handler = availableTools[parentId]?.children.find(child => child.id === toolId)?.handler
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
  tools.register({
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
    isPointerActive: false,
    gridPrecision: 1,
    pxToSvg: 1,
    currentPoint: getOrigin(),
    activePath: null,
  });

  return {
    config: { ...config, ...globalConfig },
    sketch: ref(null),
    state,
  };
}

const popup = reactive({
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
    isOpen: boolean;
    x: number;
    y: number;
    data: unknown,
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
