// import config from '@/drawing.config';

import shape from './shape';
import feature from './feature';
import perimeter from './perimeter.ts';
import edgeDimsParallel from './edgeDimsParallel';
import edgeDimsAxis from './edgeDimsAxis';

// function fillStyle(fill) {
//   return {
//     fill,
//     stroke: {
//       color: 'black',
//       opacity: 0.25,
//     },
//   };
// }

export default {
  features: {
    shape,
    feature,
    perimeter,
    edgeDimsParallel,
    edgeDimsAxis,
  },
  xrefs: {},
  settings: {
    model_unit: 'm',
    plot_size: 5,
    style: {
      annotation: {
        font_size: 16,
      },
    },
  },
  styles: {
    // TODO: inject styles from app
    // ...config.styles,

    shape: {
      fill: {
        color: '#009dd3',
        opacity: 0.5,
      },
      stroke: {
        color: 'black',
        opacity: 0.25,
      },
    },
    draggableFeature: {
      fill: {
        color: 'transparent',
      },
      stroke: {
        color: 'transparent',
      },
    },
    activeFeature: {
      opacity: 1,
      fill: {
        color: 'transparent',
      },
      stroke: {
        width: 1,
        color: '#005de3',
        opacity: 1,
      }
    }
  },
};
