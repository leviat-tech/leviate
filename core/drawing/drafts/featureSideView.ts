import { SHAPE_TYPES, PANEL_FACE_OPTIONS, AVAILABLE_PANEL_FEATURE_TYPES } from '../constants';
import { CircularFeature, PointWithBulge, PolygonalFeature, RectangularFeature } from "../types/Drawings";
import { Sketch, SketchPoint } from '../types/Sketch'
import getExtents from '../utils/getExtents';

function convertVerticesToPoints(vertices: PointWithBulge[]): SketchPoint[] {
  return vertices.map(({ x, y }) => [x, y]);
}

export default {
  func(sketch: Sketch, 
       params: Array<RectangularFeature | CircularFeature | PolygonalFeature | string | number> 
      ) : Sketch {
    let shape = null;
    const feature = params[0] as RectangularFeature | CircularFeature | PolygonalFeature;
    const viewSide = params[1] as string;
    const panelThickness = params[2] as number;

    const dataset = {
      type: feature.type,
      id: feature.id,
    };

    let corner1: SketchPoint = [0, 0];
    let corner2: SketchPoint = [0, 0];
    switch (feature.shapeType) {
      case SHAPE_TYPES.CIRCULAR: {
        const { diameter, location } = feature;

        if (diameter <= 0) {
          return sketch;
        }
        switch (viewSide) {
          case 'top':
          case 'bottom':
            corner1 = [location.x - diameter / 2, 0];
            corner2 = [location.x + diameter / 2, feature.thickness];
            break;
          case 'left':
          case 'right':
            corner1 = [0, location.y - diameter / 2];
            corner2 = [feature.thickness, location.y + diameter / 2];
            break;
        }
        break;
      }

      case SHAPE_TYPES.POLYGONAL:
      case SHAPE_TYPES.RECTANGULAR:
      {
        const { vertices } = feature;

        if (vertices.length < 3) {
          return sketch;
        }

        const adjustedVertices = convertVerticesToPoints(vertices);
        const featureExtents = getExtents(vertices);
        
        switch (viewSide) {
          case 'top':
          case 'bottom':
            corner1 = [featureExtents.xmin, 0];
            corner2 = [featureExtents.xmax, feature.thickness];
            break;
          case 'left':
          case 'right':
            corner1 = [0, featureExtents.ymin];
            corner2 = [feature.thickness, featureExtents.ymax];
            break;
        }
        break;
      }
    }

    const index = viewSide === 'top' || viewSide === 'bottom' ? 1 : 0;
    if (feature.type === AVAILABLE_PANEL_FEATURE_TYPES.UPSTAND) {
      if (feature.panelFace === PANEL_FACE_OPTIONS.NEAR_END) {
        corner1[index] -= feature.thickness;
        corner2[index] -= feature.thickness;
      }
      else if (feature.panelFace === PANEL_FACE_OPTIONS.FAR_END) {
        corner1[index] += panelThickness;
        corner2[index] += panelThickness;
      }
    }
    else if (feature.type === AVAILABLE_PANEL_FEATURE_TYPES.RECESS) {
      if (feature.panelFace === PANEL_FACE_OPTIONS.FAR_END) {
        corner1[index] += panelThickness - feature.thickness;
        corner2[index] += panelThickness - feature.thickness;
      }
    }
    else if (feature.type === AVAILABLE_PANEL_FEATURE_TYPES.HOLLOW) {
      corner1[index] += feature.depthFromNearFace || 0;
      corner2[index] += feature.depthFromNearFace || 0;
    }
    shape = sketch.rectangle(corner1, corner2);

    const opacity = feature.isDragging ? 0.5 : 1;

    return sketch.add(shape).dataset(dataset).style(feature.style || feature.type || 'shape').style({ opacity });
  },
};
