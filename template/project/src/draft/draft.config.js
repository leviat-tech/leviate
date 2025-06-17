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
        opacity: '0'
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

    shape: {
      fill: {
        color: '#3435ff',
        opacity: 0.25,
      },
      stroke: {
        color: 'black',
        opacity: 0.25,
      },
    },
  },
};
