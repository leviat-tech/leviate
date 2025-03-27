import { computed, ref, watch } from 'vue';
import { filter } from 'lodash-es';
import Big from 'big.js';
import { convertToSI } from '@crhio/concrete/src/utils/units';
import { getColumnsData } from '../extensions/pdfFormatter';

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
  const xOnly = vertices.map((pt) => pt.x);
  const yOnly = vertices.map((pt) => pt.y);
  const minX = Math.min(...xOnly);
  const minY = Math.min(...yOnly);

  return vertices.map((pt) => {
    const { x, y } = pt;

    return {
      // x: Big(x).minus(minX).times(scale).toNumber(),
      // y: Big(y).minus(minY).times(scale).toNumber(),
      x,
      y,
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

function almost_equal(a, b, absoluteError = 2.2204460492503131e-16, relativeError = 1.1920929e-7) {
  const d = Math.abs(a - b);
  if (d <= absoluteError) return true;

  if (d <= relativeError * Math.min(Math.abs(a), Math.abs(b))) return true;

  return a === b;
}

export function ptDistSq(pt1, pt2) {
  return (pt2.x - pt1.x) ** 2 + (pt2.y - pt1.y) ** 2;
}

function pointOnSegement(a, b, pt) {
  const length = Math.sqrt(ptDistSq(a, b));
  const dist1 = Math.sqrt(ptDistSq(a, pt));
  const dist2 = Math.sqrt(ptDistSq(pt, b));
  return almost_equal(dist1 + dist2, length);
}

function pointInPolygonInclusiveEdges(vertices, vertex) {
  let odd = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; i += 1) {
    if (pointOnSegement(vertices[i], vertices[j], vertex)) {
      odd = true;
      break;
    }
    if (
      vertices[i].y > vertex.y !== vertices[j].y > vertex.y &&
      vertex.x <
        ((vertices[j].x - vertices[i].x) * (vertex.y - vertices[i].y)) /
          (vertices[j].y - vertices[i].y) +
          vertices[i].x
    ) {
      odd = !odd;
    }
    j = i;
  }
  return odd;
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
          const normalizedVertices = getNormalizedVertices(vertices, scale);
          const pdfData = columnData && columnData[i];
          shapes.push({ 
            isSelected: true,
            vertices: normalizedVertices,
            data: pdfData ? { pdfData, ...rest } : rest
          });
          currentShape = null;
          i++
        }
      }
    }

    return shapes;
  },
};

const dxfConverter = {
  SHAPE_TYPES: {
    TEXT: 'TEXT',
    CIRCLE: 'CIRCLE',
    POLYLINE: 'POLYLINE',
    LWPOLYLINE: 'LWPOLYLINE',
  },
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

  isPointOnLineSegment(point, p1, p2) {
    let x = point[0],
      y = point[1];
    let x1 = p1[0],
      y1 = p1[1];
    let x2 = p2[0],
      y2 = p2[1];

    // Check if the point is on the line formed by p1 and p2
    let crossProduct = (y - y1) * (x2 - x1) - (x - x1) * (y2 - y1);
    if (Math.abs(crossProduct) > Number.EPSILON) return false;

    // Check if the point lies within the bounds of the line segment
    let dotProduct = (x - x1) * (x2 - x1) + (y - y1) * (y2 - y1);
    if (dotProduct < 0) return false;

    let squaredLength = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    if (dotProduct > squaredLength) return false;

    return true;
  },

  isPointInPolygonOrOnEdge(point, polygon) {
    let x = point[0],
      y = point[1];
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      let xi = polygon[i][0],
        yi = polygon[i][1];
      let xj = polygon[j][0],
        yj = polygon[j][1];

      // Check if point is on an edge of the polygon
      if (this.isPointOnLineSegment(point, [xi, yi], [xj, yj])) {
        return true; // Point is on the edge
      }

      // Ray-Casting Algorithm for inside check
      let intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  },

  // Function to check if a polygon is fully inside another polygon (including edges)
  isElementFullyInside(innerElement, outerElement) {
    // Check if all vertices of innerElement are inside or on the edge of outerElement
    for (let vertex of innerElement) {
      if (!this.isPointInPolygonOrOnEdge(vertex, outerElement)) {
        return false;
      }
    }
    return true;
  },

  findAllOpeningsForShape(shape, entities) {
    function isPointInOrOnPolygon(point, polygon) {
      let [x, y] = point;
      let inside = false;

      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let [xi, yi] = polygon[i];
        let [xj, yj] = polygon[j];

        // Check if point is exactly on an edge
        if (isPointOnSegment([xi, yi], [xj, yj], [x, y])) {
          return true; // Considered inside if on edge
        }

        // Ray-Casting Algorithm for inside check
        let intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }

      return inside;
    }

    // Function to check if a point is on a line segment
    function isPointOnSegment(A, B, P) {
      let [Ax, Ay] = A,
        [Bx, By] = B,
        [Px, Py] = P;

      // Check if collinear
      let crossProduct = (Py - Ay) * (Bx - Ax) - (Px - Ax) * (By - Ay);
      if (Math.abs(crossProduct) > 1e-10) return false;

      // Check if within segment bounds
      let dotProduct = (Px - Ax) * (Bx - Ax) + (Py - Ay) * (By - Ay);
      if (dotProduct < 0) return false;

      let squaredLength = (Bx - Ax) ** 2 + (By - Ay) ** 2;
      if (dotProduct > squaredLength) return false;

      return true;
    }

    // Function to check if polygonA is fully inside or touching polygonB
    function isPolygonInsideOrTouching(polygonA, polygonB) {
      return polygonA.every((point) => isPointInOrOnPolygon(point, polygonB));
    }

    return entities.reduce((acc, entity) => {
      if (
        isPolygonInsideOrTouching(
          entity.vertices.map(({ x, y }) => [x, y]),
          shape.vertices.map(({ x, y }) => [x, y])
        )
      ) {
        acc.push(entity);
      }

      return acc;
    }, []);
  },

  findTitleForShape(shape, entities) {
    return entities.find((entity) => {
      const { startPoint, endPoint } = entity;

      // Both points of TEXT should be inside slab
      if (
        pointInPolygonInclusiveEdges(shape.vertices, startPoint) &&
        pointInPolygonInclusiveEdges(shape.vertices, endPoint)
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
      return el.type === this.SHAPE_TYPES.LWPOLYLINE && el.vertices.length > 2;
    });
  },

  getAllElementsByType(entities, type) {
    return entities.filter((el) => {
      return el.type === type;
    });
  },

  findOnlyShapes(entities) {
    const polygons = this.mapPolygonsById(entities);
    let shapeIds = [];

    for (let id1 in polygons) {
      let isIncluded = false;

      for (let id2 in polygons) {
        if (id1 !== id2) {
          if (this.isElementFullyInside(polygons[id1], polygons[id2])) {
            isIncluded = true;
            break;
          }
        }
      }

      if (!isIncluded) {
        shapeIds.push(id1);
      }
    }

    return entities.filter((el) => {
      return shapeIds.includes(el.handle);
    });
  },

  async getShapesFromFileContent(content) {
    const { DxfParser } = await import('dxf-parser');
    const parser = new DxfParser();
    const dxf = parser.parseSync(content);

    console.log('Loaded entities', dxf.entities);

    shapeUnits.value = this.getUnits(dxf.header.$INSUNITS);

    const shapes = this.findOnlyShapes(dxf.entities);
    const allTextElements = this.getAllElementsByType(dxf.entities, this.SHAPE_TYPES.TEXT);

    return shapes.map((shape, index) => {
      const openings = this.findAllOpeningsForShape(
        shape,
        this.getAllPolygons(dxf.entities).filter(({ handle }) => handle !== shape.handle)
      ).map((el) => {
        return {
          ...el,
          featureType: 'OPENING',
          vertices: getNormalizedVertices(el.vertices),
        };
      });

      return {
        id: shape.handle,
        isSelected: true,
        type: shape.type || '',
        layer: shape.layer || '',
        vertices: getNormalizedVertices(shape.vertices),
        name: this.findTitleForShape(shape, allTextElements),

        features: [...openings],
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
          openings: shape.openings.map((o) => {
            return {
              ...o,
              vertices: getFormattedVertices(o.vertices),
            };
          }),
        };
      });
    },
  };
}
