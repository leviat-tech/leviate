import updateEdge from '../operations/updateEdge';

const bulge = 0;
const rect = [
  { x: 0, y: 0, bulge },
  { x: 3, y: 0, bulge },
  { x: 3, y: 2, bulge },
  { x: 0, y: 2, bulge },
];

const diamond = [
  { x: 3, y: 0, bulge },
  { x: 6, y: 4, bulge },
  { x: 3, y: 8, bulge },
  { x: 0, y: 4, bulge },
];

const [end, start, centre] = ['end', 'start', 'centre'];

describe('updateEdge', () => {
  describe('horizontal and vertical edges', () => {
    describe('bottom edge', () => {
      it('extends from the start point', () => {
        const updatedPath = updateEdge(rect, 0, 4, start);
        expect(updatedPath[0]).toEqual({ x: 0, y: 0, bulge });
        expect(updatedPath[1]).toEqual({ x: 4, y: 0, bulge });
      });
      it('extends from the centre', () => {
        const updatedPath = updateEdge(rect, 0, 5, centre);
        expect(updatedPath[0]).toEqual({ x: -1, y: 0, bulge });
        expect(updatedPath[1]).toEqual({ x: 4, y: 0, bulge });
      });
      it('extends from the end point', () => {
        const updatedPath = updateEdge(rect, 0, 4, end);
        expect(updatedPath[0]).toEqual({ x: -1, y: 0, bulge });
        expect(updatedPath[1]).toEqual({ x: 3, y: 0, bulge });
      });
      it('reduces from the start point', () => {
        const updatedPath = updateEdge(rect, 0, 2, start);
        expect(updatedPath[0]).toEqual({ x: 0, y: 0, bulge });
        expect(updatedPath[1]).toEqual({ x: 2, y: 0, bulge });
      });
      it('reduces from the centre', () => {
        const updatedPath = updateEdge(rect, 0, 1, centre);
        expect(updatedPath[0]).toEqual({ x: 1, y: 0, bulge });
        expect(updatedPath[1]).toEqual({ x: 2, y: 0, bulge });
      });
      it('reduces from the end point', () => {
        const updatedPath = updateEdge(rect, 0, 2, end);
        expect(updatedPath[0]).toEqual({ x: 1, y: 0, bulge });
        expect(updatedPath[1]).toEqual({ x: 3, y: 0, bulge });
      });
    });

    describe('right edge', () => {
      it('extends from the start point', () => {
        const updatedPath = updateEdge(rect, 1, 3, start);
        expect(updatedPath[1]).toEqual({ x: 3, y: 0, bulge });
        expect(updatedPath[2]).toEqual({ x: 3, y: 3, bulge });
      });
      it('extends from the centre', () => {
        const updatedPath = updateEdge(rect, 1, 4, centre);
        expect(updatedPath[1]).toEqual({ x: 3, y: -1, bulge });
        expect(updatedPath[2]).toEqual({ x: 3, y: 3, bulge });
      });
      it('extends from the end point', () => {
        const updatedPath = updateEdge(rect, 1, 3, end);
        expect(updatedPath[1]).toEqual({ x: 3, y: -1, bulge });
        expect(updatedPath[2]).toEqual({ x: 3, y: 2, bulge });
      });
      it('reduces from the start point', () => {
        const updatedPath = updateEdge(rect, 1, 1, start);
        expect(updatedPath[1]).toEqual({ x: 3, y: 0, bulge });
        expect(updatedPath[2]).toEqual({ x: 3, y: 1, bulge });
      });
      it('reduces from the centre', () => {
        const updatedPath = updateEdge(rect, 1, 1, centre);
        expect(updatedPath[1]).toEqual({ x: 3, y: 0.5, bulge });
        expect(updatedPath[2]).toEqual({ x: 3, y: 1.5, bulge });
      });
      it('reduces from the end point', () => {
        const updatedPath = updateEdge(rect, 1, 1, end);
        expect(updatedPath[1]).toEqual({ x: 3, y: 1, bulge });
        expect(updatedPath[2]).toEqual({ x: 3, y: 2, bulge });
      });
    });

    describe('top edge', () => {
      it('extends from the start point', () => {
        const updatedPath = updateEdge(rect, 2, 4, start);
        expect(updatedPath[2]).toEqual({ x: 3, y: 2, bulge });
        expect(updatedPath[3]).toEqual({ x: -1, y: 2, bulge });
      });
      it('extends from the centre', () => {
        const updatedPath = updateEdge(rect, 2, 5, centre);
        expect(updatedPath[2]).toEqual({ x: 4, y: 2, bulge });
        expect(updatedPath[3]).toEqual({ x: -1, y: 2, bulge });
      });
      it('extends from the end point', () => {
        const updatedPath = updateEdge(rect, 2, 4, end);
        expect(updatedPath[2]).toEqual({ x: 4, y: 2, bulge });
        expect(updatedPath[3]).toEqual({ x: 0, y: 2, bulge });
      });
      it('reduces from the start point', () => {
        const updatedPath = updateEdge(rect, 2, 2, start);
        expect(updatedPath[2]).toEqual({ x: 3, y: 2, bulge });
        expect(updatedPath[3]).toEqual({ x: 1, y: 2, bulge });
      });
      it('reduces from the centre', () => {
        const updatedPath = updateEdge(rect, 2, 1, centre);
        expect(updatedPath[2]).toEqual({ x: 2, y: 2, bulge });
        expect(updatedPath[3]).toEqual({ x: 1, y: 2, bulge });
      });
      it('reduces from the end point', () => {
        const updatedPath = updateEdge(rect, 2, 2, end);
        expect(updatedPath[2]).toEqual({ x: 2, y: 2, bulge });
        expect(updatedPath[3]).toEqual({ x: 0, y: 2, bulge });
      });
    });

    describe('left edge', () => {
      it('extends from the start point', () => {
        const updatedPath = updateEdge(rect, 3, 3, start);
        expect(updatedPath[3]).toEqual({ x: 0, y: 2, bulge });
        expect(updatedPath[0]).toEqual({ x: 0, y: -1, bulge });
      });
      it('extends from the centre', () => {
        const updatedPath = updateEdge(rect, 3, 4, centre);
        expect(updatedPath[3]).toEqual({ x: 0, y: 3, bulge });
        expect(updatedPath[0]).toEqual({ x: 0, y: -1, bulge });
      });
      it('extends from the end point', () => {
        const updatedPath = updateEdge(rect, 3, 3, end);
        expect(updatedPath[3]).toEqual({ x: 0, y: 3, bulge });
        expect(updatedPath[0]).toEqual({ x: 0, y: 0, bulge });
      });
      it('reduces from the start point', () => {
        const updatedPath = updateEdge(rect, 3, 1, start);
        expect(updatedPath[3]).toEqual({ x: 0, y: 2, bulge });
        expect(updatedPath[0]).toEqual({ x: 0, y: 1, bulge });
      });
      it('reduces from the centre', () => {
        const updatedPath = updateEdge(rect, 3, 1, centre);
        expect(updatedPath[3]).toEqual({ x: 0, y: 1.5, bulge });
        expect(updatedPath[0]).toEqual({ x: 0, y: 0.5, bulge });
      });
      it('reduces from the end point', () => {
        const updatedPath = updateEdge(rect, 3, 1, end);
        expect(updatedPath[3]).toEqual({ x: 0, y: 1, bulge });
        expect(updatedPath[0]).toEqual({ x: 0, y: 0, bulge });
      });
    });
  });

  describe('angled edges', () => {
    describe('bottom right edge', () => {
      it('extends from the start point', () => {
        const updatedPath = updateEdge(diamond, 0, 10, start);
        expect(updatedPath[0]).toEqual({ x: 3, y: 0, bulge });
        expect(updatedPath[1]).toEqual({ x: 9, y: 8, bulge });
      });
      it('extends from the centre', () => {
        const updatedPath = updateEdge(diamond, 0, 15, centre);
        expect(updatedPath[0]).toEqual({ x: 0, y: -4, bulge });
        expect(updatedPath[1]).toEqual({ x: 9, y: 8, bulge });
      });
      it('extends from the end point', () => {
        const updatedPath = updateEdge(diamond, 0, 10, end);
        expect(updatedPath[0]).toEqual({ x: 0, y: -4, bulge });
        expect(updatedPath[1]).toEqual({ x: 6, y: 4, bulge });
      });
      it('reduces from the start point', () => {
        const updatedPath = updateEdge(diamond, 0, 2.5, start);
        expect(updatedPath[0]).toEqual({ x: 3, y: 0, bulge });
        expect(updatedPath[1]).toEqual({ x: 4.5, y: 2, bulge });
      });
      it('reduces from the centre', () => {
        const updatedPath = updateEdge(diamond, 0, 2.5, centre);
        expect(updatedPath[0]).toEqual({ x: 3.75, y: 1, bulge });
        expect(updatedPath[1]).toEqual({ x: 5.25, y: 3, bulge });
      });
      it('reduces from the end point', () => {
        const updatedPath = updateEdge(diamond, 0, 2.5, end);
        expect(updatedPath[0]).toEqual({ x: 4.5, y: 2, bulge });
        expect(updatedPath[1]).toEqual({ x: 6, y: 4, bulge });
      });
    });

    describe('top right edge', () => {
      it('extends from the start point', () => {
        const updatedPath = updateEdge(diamond, 1, 10, start);
        expect(updatedPath[1]).toEqual({ x: 6, y: 4, bulge });
        expect(updatedPath[2]).toEqual({ x: 0, y: 12, bulge });
      });
      it('extends from the centre', () => {
        const updatedPath = updateEdge(diamond, 1, 15, centre);
        expect(updatedPath[1]).toEqual({ x: 9, y: 0, bulge });
        expect(updatedPath[2]).toEqual({ x: 0, y: 12, bulge });
      });
      it('extends from the end point', () => {
        const updatedPath = updateEdge(diamond, 1, 10, end);
        expect(updatedPath[1]).toEqual({ x: 9, y: 0, bulge });
        expect(updatedPath[2]).toEqual({ x: 3, y: 8, bulge });
      });
      it('reduces from the start point', () => {
        const updatedPath = updateEdge(diamond, 1, 2.5, start);
        expect(updatedPath[1]).toEqual({ x: 6, y: 4, bulge });
        expect(updatedPath[2]).toEqual({ x: 4.5, y: 6, bulge });
      });
      it('reduces from the centre', () => {
        const updatedPath = updateEdge(diamond, 1, 2.5, centre);
        expect(updatedPath[1]).toEqual({ x: 5.25, y: 5, bulge });
        expect(updatedPath[2]).toEqual({ x: 3.75, y: 7, bulge });
      });
      it('reduces from the end point', () => {
        const updatedPath = updateEdge(diamond, 1, 2.5, end);
        expect(updatedPath[1]).toEqual({ x: 4.5, y: 6, bulge });
        expect(updatedPath[2]).toEqual({ x: 3, y: 8, bulge });
      });
    });

    describe('top left edge', () => {
      it('extends from the start point', () => {
        const updatedPath = updateEdge(diamond, 2, 10, start);
        expect(updatedPath[2]).toEqual({ x: 3, y: 8, bulge });
        expect(updatedPath[3]).toEqual({ x: -3, y: 0, bulge });
      });
      it('extends from the centre', () => {
        const updatedPath = updateEdge(diamond, 2, 15, centre);
        expect(updatedPath[2]).toEqual({ x: 6, y: 12, bulge });
        expect(updatedPath[3]).toEqual({ x: -3, y: 0, bulge });
      });
      it('extends from the end point', () => {
        const updatedPath = updateEdge(diamond, 2, 10, end);
        expect(updatedPath[2]).toEqual({ x: 6, y: 12, bulge });
        expect(updatedPath[3]).toEqual({ x: 0, y: 4, bulge });
      });
      it('reduces from the start point', () => {
        const updatedPath = updateEdge(diamond, 2, 2.5, start);
        expect(updatedPath[2]).toEqual({ x: 3, y: 8, bulge });
        expect(updatedPath[3]).toEqual({ x: 1.5, y: 6, bulge });
      });
      it('reduces from the centre', () => {
        const updatedPath = updateEdge(diamond, 2, 2.5, centre);
        expect(updatedPath[2]).toEqual({ x: 2.25, y: 7, bulge });
        expect(updatedPath[3]).toEqual({ x: 0.75, y: 5, bulge });
      });
      it('reduces from the end point', () => {
        const updatedPath = updateEdge(diamond, 2, 2.5, end);
        expect(updatedPath[2]).toEqual({ x: 1.5, y: 6, bulge });
        expect(updatedPath[3]).toEqual({ x: 0, y: 4, bulge });
      });
    });

    describe('bottom left edge', () => {
      it('extends from the start point', () => {
        const updatedPath = updateEdge(diamond, 3, 10, start);
        expect(updatedPath[3]).toEqual({ x: 0, y: 4, bulge });
        expect(updatedPath[0]).toEqual({ x: 6, y: -4, bulge });
      });
      it('extends from the centre', () => {
        const updatedPath = updateEdge(diamond, 3, 15, centre);
        expect(updatedPath[3]).toEqual({ x: -3, y: 8, bulge });
        expect(updatedPath[0]).toEqual({ x: 6, y: -4, bulge });
      });
      it('extends from the end point', () => {
        const updatedPath = updateEdge(diamond, 3, 10, end);
        expect(updatedPath[3]).toEqual({ x: -3, y: 8, bulge });
        expect(updatedPath[0]).toEqual({ x: 3, y: 0, bulge });
      });
      it('reduces from the start point', () => {
        const updatedPath = updateEdge(diamond, 3, 2.5, start);
        expect(updatedPath[3]).toEqual({ x: 0, y: 4, bulge });
        expect(updatedPath[0]).toEqual({ x: 1.5, y: 2, bulge });
      });
      it('reduces from the centre', () => {
        const updatedPath = updateEdge(diamond, 3, 2.5, centre);
        expect(updatedPath[3]).toEqual({ x: 0.75, y: 3, bulge });
        expect(updatedPath[0]).toEqual({ x: 2.25, y: 1, bulge });
      });
      it('reduces from the end point', () => {
        const updatedPath = updateEdge(diamond, 3, 2.5, end);
        expect(updatedPath[3]).toEqual({ x: 1.5, y: 2, bulge });
        expect(updatedPath[0]).toEqual({ x: 3, y: 0, bulge });
      });
    });
  });
});
