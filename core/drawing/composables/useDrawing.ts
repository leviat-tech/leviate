import { Sketch } from '../types';
import { inject, reactive, ref } from 'vue';

const globalConfig = reactive({
  $l: (val: string) => val,
});

const availableTools = [
  'pointer',
  'new_polygon',
  'add_vertex',
  'delete_vertex',
  'round_off',
  'mirror_geometry',
  'point_bearing',
  'edge_bearing',
  'range_for_connectors',
  'point_loads',
  'line_loads',
  'area_loads',
  'rect_opening',
  'circle_opening',
  'polygon_opening',
];

const toolHandlers = {};
const currentTool = ref('pointer');
const setCurrentTool = (tool: string) => {
  currentTool.value = tool;
};

const tools = new Proxy(availableTools, {
  get(target, prop: string) {
    switch (prop) {
      case 'current':
        return { [currentTool.value]: true };
      case 'register':
        return (tool: string, handler: () => unknown) => {
          if (!tools.includes(tool)) {
            availableTools.push(tool);
          }
          toolHandlers[tool] = handler;
        };
      case '_setCurrent':
        return (tool: string) => {
          const handler = toolHandlers[tool];

          if (!handler) {
            setCurrentTool(tool);
            return;
          }

          const res = handler(tool);

          if (res === true) {
            setCurrentTool(tool);
            return;
          }

          if (res instanceof Promise) {
            res.then(val => {
              if (val === true) {
                setCurrentTool(tool);
              }
            });
          }
        };

      default:
        if (availableTools.includes(prop)) {
          return prop;
        }

        return Reflect.get(target, prop);
    }
  },
});

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
