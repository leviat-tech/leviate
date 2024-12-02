import { computed, ref } from 'vue';
import { filter } from 'lodash-es';

const shapes = ref([]);

function getShapeMeta(chunk) {
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
    vertices.push([x, y])
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
}

function getScale(chunk) {
  const isScale = chunk.match(/Type\/Measure\/Subtype\/RL/);

  if (!isScale) {
    return;
  }

  const scale = chunk.match(/Type\/NumberFormat\/U\(m\)\/C (.+)\/D/);

  return parseFloat(scale[1]);
}

function getNormalizedVertices(vertices, scale) {
  const xOnly = vertices.map(pt => pt[0]);
  const yOnly = vertices.map(pt => pt[1]);
  const minX = Math.min(...xOnly);
  const minY = Math.min(...yOnly);

  return vertices.map(pt => {
    const [x, y] = pt;

    return {
      x: (x - minX) * scale,
      y: (y - minY) * scale,
    };
  })
}

function getShapesFromPDFFileContent(text) {
  const shapes = [];
  const regex = /(\d+ 0 obj.*?endobj)/gs;
  let match;
  let currentShape;

  while ((match = regex.exec(text)) !== null) {
    const chunk = match[1];
    const shapeMeta = getShapeMeta(chunk);

    if (shapeMeta) {
      currentShape = shapeMeta;
    }

    if (currentShape) {
      const scale = getScale(chunk);

      if (scale) {
        const vertices = getNormalizedVertices(currentShape.vertices, scale);
        shapes.push({ ...currentShape, vertices });
        currentShape = null;
      }
    }
  }

  return shapes;
}

/**
 * Parses an array of vertices and returns lowest coordinates for normalisation.
 * @param { object } vertices - The array of vertices to be parsed.
 * @return { object } - Containing min values for x and y.
 */
const findMinCoords = (vertices) => {

  // Intialise as highest number
  let minX = Infinity;
  let minY = Infinity;

  vertices.forEach((vertex) => {
    // Update minimum x coordinate with lowest value
    if (vertex.x < minX) {
      minX = vertex.x;
    }
    // Update minimum y coordinate with lowest value
    if (vertex.y < minY) {
      minY = vertex.y;
    }
  })
  return { 'x': minX, 'y': minY };
}

async function getShapesFromFile({ type, content }) {
  switch (type) {
    case 'dxf':
      const { DxfParser } = await import('dxf-parser');
      const parser = new DxfParser();
      const dxf = parser.parseSync(content);
      const includeTypes = ['LWPOLYLINE', 'POLYLINE'];

      return dxf.entities.reduce((entities, entity) => {
        const { type, layer, vertices } = entity;

        if (!includeTypes.includes(type)) {
          return entities;
        }

        const minCoords = findMinCoords(vertices);

        return [
          ...entities,
          {
            type,
            layer,
            isSelected: true,
            vertices: vertices.map(vertex => {
              return {
                x: vertex.x - minCoords.x,
                y: vertex.y - minCoords.y,
                bulge: vertex.bulge,
              }
            })
          }
        ];
      }, []);
    case 'pdf':
      return getShapesFromPDFFileContent(content);
    default:
      console.log('File format not supported');
      return null;
  }
}

export default function useShapeSelect() {
  return {
    shapes,
    setShapesFromFile: async (fileData) => {
      shapes.value = [];
      shapes.value = await getShapesFromFile(fileData);
    },
    setShapes: (newShapes) => {
      shapes.value = newShapes;
    },
    clearShapes: () => shapes.value = [],
    getShapeParams: (shape) => {
      return shape.vertices.reduce((vertices, pt) => {
        const { x, y, bulge } = pt;
        const nextVertices = [...vertices, [x, y]];

        return typeof bulge === 'number' ? [...nextVertices, bulge] : nextVertices;
      }, [])
    },
    selectedShapes: computed(() => filter(shapes.value, { isSelected: true })),
  }
}
