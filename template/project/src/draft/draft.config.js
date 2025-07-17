export default {
  features: {},
  settings: {
    model_unit: 'm',
    plot_size: 6000,
    style: {
      annotation: {
        font_size: 16,
      },
    },
  },
  styles: {
    // TODO: inject styles from app
    // ...config.styles,
    opening: {
      fill: {
        color: 'none',
      },
      stroke: {
        color: 'black',
        opacity: 0.25,
      },
    },
    recessBase: {
      fill: {
        opacity: '1',
        color: 'red',
      },
      stroke: {
        color: 'black',
        opacity: 0.25,
      },
    },
    recess: {
      fill: {
        hatch: 'lines',
        hatch_angle: 0,
        hatch_scale: 10,
        hatch_color: 'red',
        hatch_background: 'yellow',
      },
      stroke: { color: 'black', width: 0.5 }
    },
    upstand: {
      fill: {
        color: 'cyan',
      },
      stroke: {
        color: 'black',
        opacity: 0.25,
      },
    },
  },
};
