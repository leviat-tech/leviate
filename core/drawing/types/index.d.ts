export interface Sketch {
  children: Array<Sketch>;
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
  polyface: (...points: unknown) => Sketch;
  style: (
    style:
      | string
      | {
      fill?: { color?: string; opacity?: number };
      stroke?: { color?: string; width?: number };
      annotation?: { color?: string; font_size?: number };
    },
  ) => Sketch;
  add: (...params: unknown) => Sketch;
  translate: (x: number, y: number) => Sketch;
  subtract: (sketch: Sketch) => Sketch;
  z: (index: number) => Sketch;
  rotate: (angle: number, units?: string) => Sketch;
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
  rectangle: (
    arg1: number | [number, number],
    arg2: number | [number, number],
    arg3: number,
    arg4: number,
  ) => Sketch;
  stroke: (color: string, thickness?: number) => Sketch;
  fill: (color: string) => Sketch;
  scale: (x: number, y?: number) => Sketch;
  circle: (center: [number, number], a: number | [number, number], b?: [number, number]) => Sketch;
  polycurve: (...params: unknown) => Sketch;
  text: (text: string, p: [number, number]) => Sketch;
  user: {
    shape?: (params: ShapeParams) => Sketch;
    pointBearing?: (params: { location: Point }) => Sketch;
    pointLoad?: (params: { location: Point }) => Sketch;
    edgeBearing?: (params: { perimeter: Array<PointWithBulge>; group: Support }) => Sketch;
    connectorGroup?: (params: ConnectorGroupParams) => Sketch;
    lineLoad?: (params: { vertices: Array<Point> }) => Sketch;
    partialAreaLoad?: (params: { vertices: Array<Point>; id: string }) => Sketch;
    edgeBearingDims?: (params: EdgeBearingDimsParams) => Sketch;
    connectorGroupDims?: (params: ConnectorGroupDimsParams) => Sketch;
  };
}
