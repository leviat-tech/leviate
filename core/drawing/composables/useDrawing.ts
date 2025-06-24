import { Sketch, ToolRegistrationConfig } from '../types';
import { defineAsyncComponent, inject, reactive, ref } from 'vue';
import { DEFAULT_TOOLS } from "../constants";

const globalConfig = reactive({
  $l: (val: string) => val,
});

const currentTool = ref('pointer');
const setCurrentTool = (tool: string) => {
  currentTool.value = tool;
};
const availableTools = {};
const toolIcons = {};

const tools = new Proxy(availableTools, {
  get(target, prop: string) {
    switch (prop) {
      case 'current':
        return { [currentTool.value]: true };
      case 'register':
        return (toolConfig: ToolRegistrationConfig) => {
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
        return (toolId: string) => {
          const handler = availableTools[toolId]?.handler;

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
      case 'icon':
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
    icon: defineAsyncComponent(() => import(`../assets/${toolId}.svg`))
  })
})

function getOrigin() {
  return { x: 0, y: 0 };
}

const viewports = {};

/**
 * @typedef Point
 * @param { number } x
 * @param { number } y
 */

/**
 * @typedef ViewportConfig
 * @param { number } fontSizePx - font size in pixels
 * @param { function } dimFormatter - function for converting SI to dim display value
 * @param { number } proximityDistance - distance in px from a segment to show a new suggested vertex
 * @param { number } precision - snap precision
 * @param { boolean } showGrid - whether to display gridlines
 * @param { number } vertexRadius - radius of editable vertices
 */

/**
 * @typedef ViewportState
 * @param { string } currentTool
 * @param { object } keyModifiers
 * @param { boolean } isPointerActive
 * @param { boolean } isDragging
 * @param { number } gridPrecision
 * @param { number } pxToSvg
 * @param { Point } currentPoint
 */

/**
 * @typedef Viewport
 * @param { ViewportConfig } config,
 * @param { Sketch } sketch,
 * @param { ViewportState } state,
 */

/**
 * @param { ViewportConfig } userConfig
 * @returns Viewport
 */
function createViewport(userConfig) {
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
    shape: ref({}),
    sketch: ref({}),
    state,
  };
}

const popup = reactive({
  isOpen: true,
  x: 0,
  y: 0,
  data: {},
});

function openPopup(e, data) {
  Object.assign(popup, {
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

/**
 * @param { ViewportConfig | object } config
 * @returns { Viewport }
 */
export default function useDrawing(config?: object): {
  state: {};
  sketch: Sketch;
} {
  const viewportName = inject('viewportName', 'DEFAULT');

  viewports[viewportName] ??= createViewport(config);

  return {
    ...viewports[viewportName],
    tools,
    openPopup,
    closePopup,
    popup,
    loadGlobalConfig: useGlobalConfig => {
      Object.assign(globalConfig, useGlobalConfig);
      Object.assign(viewports[viewportName].config, useGlobalConfig);
    },
  };
}
