export default {
  three: {
    axisIndicator: {
      isEnabled: true,
    },
    camera: {
      fov: 30,
      near: 0.2,
      far: 100,
      position: {
        x: 4,
        y: 3,
        z: 4,
      },
    },
    controls: {
      target: [0.3, 0.6, 0],
      panSpeed: 1,
      rotateSpeed: 1,
      zoomToCursor: true,
    },
    light: {
      intensity: 0.5,
      directionalLights: [
        [2, 3, 1],
        [-2, 3, -1],
      ],
    },
  },
  image: {
    use2DCamera: true,
    width: 600,
    height: 600,
    camera: {
      position: {
        x: 4,
        y: 3.5,
        z: 4,
      },
    },
    controls: {
      target: [0, 0, 0],
    },
  },
  styles: {
    slab: { color: '#8ea9db', opacity: 0.5 },
    label: { color: '#4a555b' },
    highlight: { color: '#037180' },
    xAxis: { color: '#ff0000' },
    load: { color: '#ff0000' },
    yAxis: { color: '#008000' },
    zAxis: { color: '#0000ff' },
    slabEdge: { color: '#ffee00', opacity: 1 },
    shape: {
      fill: { color: '#8ea9db', opacity: 0.5 },
      stroke: {
        color: 'black',
        opacity: 0.5,
      },
    },
    opening: {
      fill: {
        color: '#FFFFFF',
      },
      stroke: {
        color: 'black',
        opacity: 1,
      },
    },
    invalidOpening: {
      fill: {
        color: 'orange',
      },
      stroke: {
        color: 'black',
        opacity: 1,
      },
    },
    bearing: {
      fill: {
        color: 'none',
      },
      stroke: {
        color: 'blue',
      },
    },
    connectorGroup: {
      default: {
        fill: { color: '#fee7a7', opacity: 0.5 },
        stroke: { color: 'blue', width: 2 },
        annotation: { font_size: 0.08, color: 'blue' },
      },
      invalid: {
        fill: { color: 'red', opacity: 0.4 },
        stroke: { color: 'red', width: 2 },
      },
      selected: {
        fill: { color: 'yellow', opacity: 0.5 },
        stroke: { color: 'blue', width: 2 },
      },
    },
    edgeSupport: {
      default: {
        stroke: { color: 'blue', width: 2 },
        fill: { color: 'transparent' },
      },
      selected: {
        fill: { color: '#42f5ef', opacity: 0.5 },
      },
      invalid: {
        fill: { color: 'red', opacity: 0.4 },
        stroke: { color: 'red', width: 2 },
      },
    },
    pointLoad: {
      default: {
        stroke: { color: '#743d94', width: 2 },
        fill: { color: 'transparent' },
      },
      invalid: {
        fill: { color: 'red', opacity: 0.4 },
        stroke: { color: 'red', width: 2 },
      },
      selected: {
        fill: { color: '#743d94', opacity: 0.8 },
        stroke: { color: '#c368f7', width: 2 },
      },
    },
    partialAreaLoad: {
      default: {
        stroke: { color: '#743d94', width: 2 },
        fill: { color: '#c368f7', opacity: 0.4 },
      },
      invalid: {
        fill: { color: 'red', opacity: 0.4 },
        stroke: { color: 'red', width: 2 },
      },
      selected: {
        fill: { color: '#8847ad', opacity: 0.5 },
      },
    },
    lineLoad: {
      default: {
        stroke: { width: 5, opacity: 0.4, color: '#743d94' },
      },
      invalid: {
        stroke: { width: 5, opacity: 0.4, color: 'red' },
      },
      selected: {
        stroke: { width: 5, opacity: 0.8, color: '#8847ad' },
      },
    },
    dim: {
      annotation: {
        color: 'black',
        h_align: 'center',
        v_align: 'middle',
        font_size: 90,
        scale: 1,
        extension: 2,
        hash_length: 2,
        offset: 20,
        text_offset: 10,
        precision: 4,
      },
    },
    edgeNumber: {
      annotation: {
        color: 'orange',
        h_align: 'center',
        v_align: 'middle',
        font_size: 90,
        scale: 1,
      },
    },
    diagram: {
      legend: {
        annotation: {
          h_align: 'left',
          v_align: 'middle',
          font_size: 16,
          scale: 1,
        },
      },
      itemX: {
        annotation: {
          h_align: 'center',
          v_align: 'middle',
          font_size: 16,
          scale: 1,
        },
      },
      itemY: {
        annotation: {
          h_align: 'right',
          v_align: 'middle',
          font_size: 16,
          scale: 1,
        },
      },
      gridLine: {
        default: {
          stroke: { width: 0.1, opacity: 0.5 },
        },
        secondary: {
          stroke: { width: 0.1, opacity: 0.3 },
        },
      },
    },
    connectorChart: {
      annotation: {
        h_align: 'center',
        v_align: 'middle',
        font_size: 32,
        scale: 1,
      },
      reactions: {
        stroke: { color: 'red', width: 0.1 },
        annotation: {
          color: 'green',
          h_align: 'right',
          v_align: 'bottom',
          font_size: 16,
          scale: 1,
        },
      },
      resistance: {
        stroke: { color: 'black', width: 0.1 },
        fill: { color: '#8ea9db', opacity: 0.5 },
      },
    },
  },
  toolbar: [
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
  ],
};
