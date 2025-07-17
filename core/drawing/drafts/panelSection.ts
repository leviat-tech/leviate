import { AVAILABLE_PANEL_FEATURE_TYPES, PANEL_FACE_OPTIONS } from "../constants";
import { Feature, ShapeParams, ShapeSketch } from "../types";
import { Sketch } from '../types/Sketch'
import sketchSection from "./sketchSection";
import getExtents from "../utils/getExtents";

export default {
  func(sketch: ShapeSketch, params: ShapeParams) {
    const { perimeter, features, thickness, cutSegment, viewDirection } = params;
    const shapeExtents = getExtents(perimeter);
    const isHorizontal = viewDirection === 'top' || viewDirection === 'bottom';
    let perimeterSketch: Sketch = sketch.user.perimeter(perimeter).name('perimeter');
    let cutLine = cutSegment;
    if(!cutLine) {
      cutLine = isHorizontal 
        ? { 
            a: { x: shapeExtents.xmin, y: (shapeExtents.ymin + shapeExtents.ymax) / 2 }, 
            b: { x: shapeExtents.xmax, y: (shapeExtents.ymin + shapeExtents.ymax) / 2 }, 
          }
        : { 
            a: { x: (shapeExtents.xmin + shapeExtents.xmax) / 2, y: shapeExtents.ymin }, 
            b: { x: (shapeExtents.xmin + shapeExtents.xmax) / 2, y: shapeExtents.ymax }, 
          };
    }
    let sectionSketch = sketchSection(perimeterSketch, cutLine, 0, thickness);
    const isSectionView = sectionSketch !== null && sectionSketch.entities.length > 0;
    if (!isSectionView) { //cut line outside of panel -> sideview  
      const length = isHorizontal 
        ? shapeExtents.xmax - shapeExtents.xmin
        : shapeExtents.ymax - shapeExtents.ymin;
      sectionSketch = isHorizontal 
        ? sketch.rectangle([shapeExtents.xmin, shapeExtents.ymin], length, thickness).style('shape')
        : sketch.rectangle([shapeExtents.xmin, shapeExtents.ymin], thickness, length).style('shape');
    }
    const featuresSketches = features.map((ft: Feature) => {
      const featureSketch = sketch.user.feature(ft);
      let off = 0;
      switch(ft.type) {
        case AVAILABLE_PANEL_FEATURE_TYPES.RECESS:
          off = ft.panelFace === PANEL_FACE_OPTIONS.FAR_END ? thickness - ft.thickness : off;
          break;
        case AVAILABLE_PANEL_FEATURE_TYPES.UPSTAND:
          off = ft.panelFace === PANEL_FACE_OPTIONS.FAR_END ? thickness :  -ft.thickness;
          break;
        case AVAILABLE_PANEL_FEATURE_TYPES.HOLLOW:
          off = ft.depthFromNearFace || 0;
          break;
      }
      let sec = null; 
      if(isSectionView) {
        sec = sketchSection( 
          featureSketch,
          cutLine,
          off,
          ft.type === AVAILABLE_PANEL_FEATURE_TYPES.OPENING ? thickness : ft.thickness,
        );
      }
      else {
        if(ft.type === AVAILABLE_PANEL_FEATURE_TYPES.OPENING)
           ft.thickness = thickness;
        sec = sketch.user.featureSideView([ft, viewDirection, thickness]);
      }
      const op = ft.type === 'upstand' ? 'union' : 'subtract';
      return { sec, op };
    });
    if(isSectionView) {
      featuresSketches.forEach((ft) => {
        if(ft.sec)
          sectionSketch = ft.op === 'union' ? sectionSketch.union(ft.sec).z(1) : sectionSketch.subtract(ft.sec).z(1);
      });
      return sketch.add(sectionSketch.hatch('lines', 10, 0, 'black', '#F6F6F6').z(1)).fill('#F6F6F6');
    }

    return sketch.add(sectionSketch, ...featuresSketches.map(ftsk => ftsk.sec));
  }
};
