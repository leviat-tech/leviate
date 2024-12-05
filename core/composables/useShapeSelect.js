import { computed, ref, watch } from 'vue';
import { filter } from 'lodash-es';
import Big from 'big.js';
import { convertToSI } from '@crhio/concrete/src/utils/units';

const shapes = ref([]);
const shapeUnits = ref('m');
const shapeUnitPrecision = ref(4);

const selectedShapes = computed(() => filter(shapes.value, { isSelected: true }));

/**
 * @typedef Vertex
 * @property { number } x
 * @property { number } y
 * @property { number } [bulge]
 */

/**
 * @typedef { Vertex[] } Vertices
 */

/**
 * Normalise the position of a shape by translating vertices to minimum x,y position of 0.
 * Scale coordinates if specified e.g. when determining actual measurements from positions of points on a pdf page
 * @param { Vertices } vertices
 * @param { number } scale - the amount to scale each coordinate by
 * @returns { Vertices }
 */
function getNormalizedVertices(vertices, scale = 1) {
  const xOnly = vertices.map(pt => pt.x);
  const yOnly = vertices.map(pt => pt.y);
  const minX = Math.min(...xOnly);
  const minY = Math.min(...yOnly);

  return vertices.map(pt => {
    const { x, y } = pt;

    return {
      x: Big(x).minus(minX).times(scale).toNumber(),
      y: Big(y).minus(minY).times(scale).toNumber(),
      bulge: pt.bulge || 0
    };
  });
}

/**
 * Format a number according to the shapeUnits and shapeUnitsPrecision values
 * @param {number} value
 * @returns {number}
 */
function getFormattedValue(value) {
  const precision = shapeUnitPrecision.value;
  const units = shapeUnits.value;
  const roundedValue = parseFloat(value.toFixed(precision));

  return convertToSI(roundedValue, units);
}

/**
 * Format all vertices in a shape according to the shapeUnits and shapeUnitsPrecision values
 * @returns {Vertices}
 */
function getFormattedVertices(vertices) {
  return vertices.map(pt => {
    const { x, y, bulge } = pt;

    return {
      x: getFormattedValue(x),
      y: getFormattedValue(y),
      bulge,
    };
  });
}

const pdfConverter = {
  getShapeMeta(chunk) {
    const isShape = chunk.match(/Subj\(Area Measurement\)\/Type\/Annot/);

    if (!isShape) {
      return
    }

    const verticesStr = chunk
    .match(/Vertices\[([^\]]+)]/)[1]
    .split(' ');

    const vertices = [];

    for (let i = 0; i < verticesStr.length; i += 2) {
      const x = parseFloat(verticesStr[i]);
      const y = parseFloat(verticesStr[i + 1]);
      vertices.push({ x, y })
    }

    const annotationHTML = chunk.match(/<body[^>]+>(.+)<\/body>/)?.[1];
    const div = document.createElement('div');
    div.innerHTML = annotationHTML;
    const nodes = Array.from(div.childNodes);
    const title = nodes[0].textContent;
    const annotationText = nodes.map(node => node.textContent).join(', ');

    return {
      annotationHTML,
      annotationText,
      title,
      vertices,
      isSelected: true,
    }
  },

  getScale(chunk) {
    const isScale = chunk.match(/Type\/Measure\/Subtype\/RL/);

    if (!isScale) {
      return;
    }

    const scale = chunk.match(/Type\/NumberFormat\/U\(m\)\/C (.+)\/D/);

    return parseFloat(scale[1]);
  },

  getShapesFromFileContent(text) {
    const shapes = [];
    const regex = /(\d+ 0 obj.*?endobj)/gs;
    let match;
    let currentShape;

    while ((match = regex.exec(text)) !== null) {
      const chunk = match[1];
      const shapeMeta = this.getShapeMeta(chunk);

      if (shapeMeta) {
        currentShape = shapeMeta;
      }

      if (currentShape) {
        const scale = this.getScale(chunk);

        if (scale) {
          const vertices = getNormalizedVertices(currentShape.vertices, scale);
          shapes.push({ ...currentShape, vertices });
          currentShape = null;
        }
      }
    }

    return shapes;
  }
}

const dxfConverter = {
  includeEntityTypes: [
    'LWPOLYLINE',
    'POLYLINE'
  ],
  getUnits(dxfUnitType) {
    switch (dxfUnitType) {
      case 1:
        return 'in';
      case 2:
        return 'ft';
      case 4:
        return 'mm';
      case 5:
        return 'cm';
      case 6:
        return 'm';
      default:
        console.warn('No units specified. Default "m" will be used')
        return 'm';
    }
  },
  async getShapesFromFileContent(content) {
    const { DxfParser } = await import('dxf-parser');
    const parser = new DxfParser();
    const dxf = parser.parseSync(content);

    shapeUnits.value = this.getUnits(dxf.header.$INSUNITS);

    return dxf.entities.reduce((entities, entity) => {
      const { type, layer, vertices } = entity;

      if (!this.includeEntityTypes.includes(type)) {
        return entities;
      }

      return [
        ...entities,
        {
          type,
          layer,
          isSelected: true,
          vertices: getNormalizedVertices(vertices),
        }
      ];
    }, []);
  },
}

const fileTypeConverterMap = {
  dxf: dxfConverter,
  pdf: pdfConverter,
};

export default function useShapeSelect() {
  return {
    shapes,
    shapeUnits,
    shapeUnitPrecision,
    selectedShapes,
    setShapesFromFile: async (fileData) => {
      shapeUnits.value = 'm';
      shapes.value = [];

      const converter = fileTypeConverterMap[fileData.type];

      if (!converter) {
        console.log(`File format "${fileData.type}" not supported`);
        return;
      }

      shapes.value = await converter.getShapesFromFileContent(fileData.content);
    },
    clearShapes: () => shapes.value = [],
    getShapeParams: (shape) => {
      return shape.vertices.reduce((vertices, pt) => {
        const { x, y, bulge } = pt;
        const nextVertices = [...vertices, [x, y]];

        return typeof bulge === 'number' ? [...nextVertices, bulge] : nextVertices;
      }, [])
    },
    getFormattedShapes() {
      return selectedShapes.value.map(shape => {
        return {
          ...shape,
          vertices: getFormattedVertices(shape.vertices),
        }
      })
    }
  }
}
