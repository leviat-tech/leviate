import { Feature, PointWithBulge, ShapeParams } from "./Drawings";

type Bulge = number;
type Segment = [SketchPoint, SketchPoint];
type FilletPoint = [SketchPoint, number];

export type SketchPoint = [number, number];

type CircleArgs =
    | [center: SketchPoint, radius: number]
    | [center: SketchPoint, point: SketchPoint]
    | [p1: SketchPoint, p2: SketchPoint, p3: SketchPoint]
    | [seg1: Segment, seg2: Segment, radius: number];

type PolycurveElement = SketchPoint | number | FilletPoint;
type PolycurveArgs = [...PolycurveElement[]] | [Segment[]];

type RectangleArgs =
    | [xmin: number, ymin: number, xmax: number, ymax: number, radius?: number]
    | [origin: SketchPoint, width: number, height: number, radius?: number]
    | [corner1: SketchPoint, corner2: SketchPoint, radius?: number]
    | [segment: Segment, height: number, radius?: number];

type PolyfaceInput = (SketchPoint | Bulge | FilletPoint)[] | Segment[];

export type StyleProp = string | {
    fill?:
    { color?: string; opacity?: number } |
    {
        hatch: 'crosshatch' | 'lines' | 'steel' | 'concrete',
        hatch_scale: number,
        hatch_color: string,
        hatch_background: string,
        hatch_stroke_width: number,
    };
    stroke?: { color?: string; width?: number, opacity: number };
    annotation?: { color?: string; font_size?: number };
    opacity?: number;
}

export interface Sketch {
    children: Array<Sketch>;
    new: Sketch;
    /**
     const dimSketch = sketch.aligned_dim([0, 0], [4, 3]);
     Places an aligned dimension string traveling from the origin to [4, 3],
     with a distance label of "5".
  
     const dimSketch = sketch.aligned_dim([0, 0], [4, 3], "right");
     Places the same aligned dimension string, but offset to the opposite side as in the previous example.
  
     const dimSketch = sketch.aligned_dim([0, 0], [4, 3], 1);
     Places the same aligned dimension string, but with the offset bar one unit from the line between the two points.
  
     const dimSketch = sketch.aligned_dim([0, 0], [4, 3], [3, 6]);
     Places the same aligned dimension string, but with the offset bar passing
     through the point [3, 6].
     */
    aligned_dim: (
        point1: [number, number],
        point2: [number, number],
        offset?: number,
        callback?: unknown,
        dataset?: unknown,
    ) => Sketch;
    polyface: (...points: unknown[]) => Sketch;
    segment: (start: SketchPoint, end: SketchPoint) => Sketch;
    style: (style: string) => Sketch;
    dataset: (...args: unknown[]) => Sketch;
    add: (...sketch: Sketch[]) => Sketch;
    translate: (x: number, y: number) => Sketch;
    subtract: (sketch: Sketch) => Sketch;
    z: (index: number) => Sketch;
    rotate: (angle: number, units?: string) => Sketch;
    clone: () => Sketch;
    /**
     * Adds a rectangle to a sketch. A rectangle is a "polyface"--a closed chain of segments and arcs.
     *
     *  Construction: xmin, ymin, xmax, ymax, radius
     *
     const rectSketch = sketch.rectangle(1, 1, 11, 6, 1);
  
     Construction: origin, width, height, radius
  
     const rectSketch = sketch.rectangle([1, 1], 10, 5, 1);
  
     Construction: corner1, corner2, radius
  
     const rectSketch = sketch.rectangle([1, 1], [11, 6], 1);
  
     Construction: segment, height, radius
  
     const rectSketch = sketch.rectangle([[1, 1], [11, 1]], 5, 1);
     */
    rectangle: (...args: RectangleArgs) => Sketch;
    name: (name: string) => Sketch;
    stroke: (color: string, thickness?: number) => Sketch;
    fill: (color: string) => Sketch;
    scale: (x: number, y?: number) => Sketch;
    // circle: (center: [number, number], a: number | [number, number], b?: [number, number]) => Sketch;

    circle: (...args: CircleArgs) => Sketch;
    // polycurve: (...params: unknown) => Sketch;

    polycurve: (...args: PolycurveArgs) => Sketch;

    text: (text: string, p: [number, number]) => Sketch;
    // TODO: separate dynamic user features
    user: {
        shape?: (params: ShapeParams) => Sketch;
        perimeter: (params: Array<PointWithBulge>) => Sketch;
        feature: (params: Feature) => Sketch;
    };
}