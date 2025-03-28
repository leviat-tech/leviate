import { computed, ref, watch } from 'vue';
import { filter } from 'lodash-es';
import Big from 'big.js';
import { convertToSI } from '@crhio/concrete/src/utils/units';
import { getColumnsData } from '../extensions/pdfFormatter';

const shapes = ref([]);
const shapeUnits = ref('m');
const shapeUnitPrecision = ref(4);

const selectedShapes = computed(() => filter(shapes.value, { isSelected: true }));

export const FEATURE_TYPES = {
  OPENING: 'OPENING',
};

export const DXF_SHAPE_TYPES = {
  TEXT: 'TEXT',
  CIRCLE: 'CIRCLE',
  POLYLINE: 'POLYLINE',
  LWPOLYLINE: 'LWPOLYLINE',
};

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
 * @param { Vertex } refPoint - minimum x,y to use for translating
 * @returns { Vertices }
 */
function getNormalizedVertices(vertices, scale = 1, refPoint = { x: 0, y: 0 }) {
  const { x: minX, y: minY } = refPoint;

  return vertices.map((pt) => {
    const { x, y } = pt;
    return {
      x: Big(x).minus(minX).round().times(scale).toNumber(),
      y: Big(y).minus(minY).round().times(scale).toNumber(),
      bulge: pt.bulge || 0,
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
  return vertices.map((pt) => {
    const { x, y, bulge } = pt;

    return {
      x: getFormattedValue(x),
      y: getFormattedValue(y),
      bulge,
    };
  });
}

/**
 * Get minimum x,y from vertices
 * @param { Vertices } vertices
 */
function getReferencePoint(vertices) {
  const xOnly = vertices.map((pt) => pt.x);
  const yOnly = vertices.map((pt) => pt.y);
  const minX = Math.min(...xOnly);
  const minY = Math.min(...yOnly);

  return { x: minX, y: minY };
}

const pdfConverter = {
  getShapeMeta(chunk) {
    const isShape = chunk.match(/Subj\(Area Measurement\)\/Type\/Annot/);

    if (!isShape) {
      return;
    }

    const verticesStr = chunk.match(/Vertices\[([^\]]+)]/)[1].split(' ');

    const vertices = [];

    for (let i = 0; i < verticesStr.length; i += 2) {
      const x = parseFloat(verticesStr[i]);
      const y = parseFloat(verticesStr[i + 1]);
      vertices.push({ x, y });
    }

    const annotationHTML = chunk.match(/<body[^>]+>(.+)<\/body>/)?.[1];
    const div = document.createElement('div');
    div.innerHTML = annotationHTML;
    const nodes = Array.from(div.childNodes);
    const title = nodes[0].textContent;
    const annotationText = nodes.map((node) => node.textContent).join(', ');

    return {
      annotationHTML,
      annotationText,
      title,
      vertices,
    };
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
    const columnPropertyLine = /BSIAnnotColumns\s\d+\s/.exec(text)[0]?.split(' ')[1];
    const columnData = columnPropertyLine && getColumnsData(text, columnPropertyLine);
    const shapes = [];
    const regex = /(\d+ 0 obj.*?endobj)/gs;
    let match;
    let currentShape;
    let i = 0;

    while ((match = regex.exec(text)) !== null) {
      const chunk = match[1];
      const shapeMeta = this.getShapeMeta(chunk);

      if (shapeMeta) {
        currentShape = shapeMeta;
      }

      if (currentShape) {
        const scale = this.getScale(chunk);

        if (scale) {
          const { vertices, ...rest } = currentShape;
          const referencePoint = getReferencePoint(vertices);
          const normalizedVertices = getNormalizedVertices(vertices, scale, referencePoint);
          const pdfData = columnData && columnData[i];
          shapes.push({
            isSelected: true,
            vertices: normalizedVertices,
            data: pdfData ? { pdfData, ...rest } : rest,
          });
          currentShape = null;
          i++;
        }
      }
    }

    return shapes;
  },
};

const dxfConverter = {
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
        console.warn('No units specified. Default "m" will be used');
        return 'm';
    }
  },

  isCircleInsideOrTouching(circle, referenceShape) {
    const { center, radius } = circle;
    let inside = false;
    let j = referenceShape.length - 1;

    for (let i = 0; i < referenceShape.length; j = i++) {
      const { x: xi, y: yi } = referenceShape[i];
      const { x: xj, y: yj } = referenceShape[j];

      // Check if center is on the edge
      if (
        (center.x - xi) * (yj - yi) === (center.y - yi) * (xj - xi) &&
        Math.min(xi, xj) <= center.x &&
        center.x <= Math.max(xi, xj) &&
        Math.min(yi, yj) <= center.y &&
        center.y <= Math.max(yi, yj)
      ) {
        return true;
      }

      // Ray-casting algorithm for point inside polygon
      const intersect =
        yi > center.y !== yj > center.y &&
        center.x < ((xj - xi) * (center.y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;

      // Check if circle is touching an edge
      const dx = xj - xi;
      const dy = yj - yi;
      const lengthSq = dx * dx + dy * dy;
      const t = Math.max(0, Math.min(1, ((center.x - xi) * dx + (center.y - yi) * dy) / lengthSq));
      const closestX = xi + t * dx;
      const closestY = yi + t * dy;

      const distanceSq = (center.x - closestX) ** 2 + (center.y - closestY) ** 2;
      if (distanceSq <= radius ** 2) {
        return true;
      }
    }
    return inside;
  },

  findTitleForShape(shape, entities) {
    return entities.find((entity) => {
      const { startPoint, endPoint } = entity;

      // Both points of TEXT should be inside slab
      if (
        this.isPointInsideOrOnEdge(startPoint, shape.vertices) &&
        this.isPointInsideOrOnEdge(endPoint, shape.vertices)
      ) {
        return true;
      }

      return false;
    })?.text;
  },

  mapPolygonsById(entities) {
    return this.getAllPolygons(entities).reduce((acc, el) => {
      acc[el.handle] = el.vertices.map(({ x, y }) => [x, y]);
      return acc;
    }, {});
  },

  getAllPolygons(entities) {
    return entities.filter((el) => {
      // Sometimes line element in not parsed as LINE element (type === LINE) but as polyline with 2 vertices
      return el.type === DXF_SHAPE_TYPES.LWPOLYLINE && el.vertices.length > 2;
    });
  },

  getAllElementsByType(entities, type) {
    return entities.filter((el) => {
      return el.type === type;
    });
  },

  findUncontainedShapes(shapes) {
    function isPointInsideOrOnEdge(point, shape) {
      const [x, y] = point;
      let inside = false;
      let j = shape.length - 1;
      for (let i = 0; i < shape.length; j = i++) {
        const [xi, yi] = shape[i];
        const [xj, yj] = shape[j];

        // Check if point is on the edge
        if (
          (x - xi) * (yj - yi) === (y - yi) * (xj - xi) &&
          Math.min(xi, xj) <= x &&
          x <= Math.max(xi, xj) &&
          Math.min(yi, yj) <= y &&
          y <= Math.max(yi, yj)
        ) {
          return true;
        }

        // Ray-casting algorithm for point inside polygon
        const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    }

    return Object.keys(shapes).filter((id) => {
      return !Object.keys(shapes).some(
        (otherId) =>
          id !== otherId &&
          shapes[id].every((point) => isPointInsideOrOnEdge(point, shapes[otherId]))
      );
    });
  },

  isPointInsideOrOnEdge(point, shape) {
    const { x, y } = point;
    let inside = false;
    let j = shape.length - 1;
    for (let i = 0; i < shape.length; j = i++) {
      const { x: xi, y: yi } = shape[i];
      const { x: xj, y: yj } = shape[j];

      // Check if point is on the edge
      if (
        (x - xi) * (yj - yi) === (y - yi) * (xj - xi) &&
        Math.min(xi, xj) <= x &&
        x <= Math.max(xi, xj) &&
        Math.min(yi, yj) <= y &&
        y <= Math.max(yi, yj)
      ) {
        return true;
      }

      // Ray-casting algorithm for point inside polygon
      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  },

  isShapeInsideOrTouching(shape, referenceShape) {
    return shape.every((point) => this.isPointInsideOrOnEdge(point, referenceShape));
  },

  findOpenings(entities, shape) {
    const openings = [];

    entities.forEach((entity) => {
      if (
        entity.type === DXF_SHAPE_TYPES.CIRCLE &&
        this.isCircleInsideOrTouching(entity, shape.vertices)
      ) {
        openings.push(entity);
      } else if (
        entity.type === DXF_SHAPE_TYPES.LWPOLYLINE &&
        entity.vertices.length > 2 &&
        this.isShapeInsideOrTouching(entity.vertices, shape.vertices)
      ) {
        openings.push(entity);
      }
    });

    return openings;
  },

  filterEntitiesByShape(entities, shapeIds) {
    return entities.reduce(
      (acc, item) => {
        if (shapeIds.includes(item.handle)) {
          acc.shapes.push(item);
        } else {
          acc.entitiesWithoutShapes.push(item);
        }

        return acc;
      },
      {
        shapes: [],
        entitiesWithoutShapes: [],
      }
    );
  },

  async getShapesFromFileContent(content) {
    const { DxfParser } = await import('dxf-parser');
    const parser = new DxfParser();
    const dxf = parser.parseSync(content);

    shapeUnits.value = this.getUnits(dxf.header.$INSUNITS);

    const shapeIds = this.findUncontainedShapes(this.mapPolygonsById(dxf.entities));

    const allTextElements = this.getAllElementsByType(dxf.entities, DXF_SHAPE_TYPES.TEXT);
    const { shapes, entitiesWithoutShapes } = this.filterEntitiesByShape(dxf.entities, shapeIds);

    return shapes.map((shape, index) => {
      const shapeRef = getReferencePoint(shape.vertices);

      const openings = this.findOpenings(entitiesWithoutShapes, shape).map((el) => {
        if (el.type === DXF_SHAPE_TYPES.LWPOLYLINE) {
          const referencePoint = getReferencePoint(el.vertices);
          return {
            ...el,

            vertices: getNormalizedVertices(el.vertices, 1, getReferencePoint(el.vertices)),
            position: [
              Big(referencePoint.x).minus(shapeRef.x).round().toNumber(),
              Big(referencePoint.y).minus(shapeRef.y).round().toNumber(),
            ],
          };
        } else if (el.type === DXF_SHAPE_TYPES.CIRCLE) {
          return {
            ...el,

            radius: Big(el.radius).round().toNumber(),
            center: {
              x: Big(el.center.x).minus(shapeRef.x).round().toNumber(),
              y: Big(el.center.y).minus(shapeRef.y).round().toNumber(),
            },
          };
        } else {
          return el;
        }
      });

      return {
        id: shape.handle,
        isSelected: true,
        type: shape.type || '',
        layer: shape.layer || '',
        vertices: getNormalizedVertices(shape.vertices, 1, getReferencePoint(shape.vertices)),
        name: this.findTitleForShape(shape, allTextElements),

        features: {
          openings,
        },
      };
    });
  },
};

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
    clearShapes: () => (shapes.value = []),
    getShapeParams: (shape) => {
      return shape.vertices.reduce((vertices, pt) => {
        const { x, y, bulge } = pt;
        const nextVertices = [...vertices, [x, y]];

        return typeof bulge === 'number' ? [...nextVertices, bulge] : nextVertices;
      }, []);
    },
    getFormattedShapes() {
      return selectedShapes.value.map((shape) => {
        return {
          ...shape,
          vertices: getFormattedVertices(shape.vertices),
          features: Object.keys(shape.features).reduce((acc, key) => {
            if (key === 'openings') {
              acc.openings = shape.features[key].map((feat) => {
                if (feat.type === DXF_SHAPE_TYPES.CIRCLE) {
                  return {
                    ...feat,
                    radius: getFormattedValue(feat.radius),
                    center: {
                      x: getFormattedValue(feat.center.x),
                      y: getFormattedValue(feat.center.y),
                    },
                  };
                } else if (feat.type === DXF_SHAPE_TYPES.LWPOLYLINE) {
                  return {
                    ...feat,
                    position: [
                      getFormattedValue(feat.position[0]),
                      getFormattedValue(feat.position[1]),
                    ],
                    vertices: getFormattedVertices(feat.vertices),
                  };
                }

                return feat;
              });
            }
            return acc;
          }, {}),
        };
      });
    },
  };
}
