/**
 * @typedef {object} _SquareGridConfiguration
 * @property {number} [diagonals=CONST.GRID_DIAGONALS.EQUIDISTANT]  The rule for diagonal measurement
 *                                                                  (see {@link CONST.GRID_DIAGONALS})
 */
/**
 * @typedef {GridConfiguration&_SquareGridConfiguration} SquareGridConfiguration
 */
/**
 * An offset of a grid space or a point with pixel coordinates.
 * @typedef {GridCoordinates} SquareGridCoordinates
 */
/**
 * The square grid class.
 */
import BaseGrid from './base.d.mts';

export default class SquareGrid extends BaseGrid {
  /**
   * The square grid constructor.
   * @param {SquareGridConfiguration} config   The grid configuration
   */
  constructor(config: SquareGridConfiguration);
  /**
   * The rule for diagonal measurement (see {@link CONST.GRID_DIAGONALS}).
   * @type {number}
   */
  diagonals: number;

  /**
   * Returns the offset of the grid space corresponding to the given coordinates.
   * @param {SquareGridCoordinates} coords    The coordinates
   * @returns {GridOffset}                    The offset
   */
  getOffset(coords: GridCoordinates): GridOffset;
  /** @override */
  override getOffsetRange({
    x, y, width, height
  }: {
    x: any;
    y: any;
    width: any;
    height: any;
  }): number[];
  /** @override */
  override getAdjacentOffsets(coords: any): {
    i: GridOffset;
    j: any;
  }[];
  /** @override */
  override testAdjacency(coords1: any, coords2: any): boolean;
  /** @override */
  override getShiftedOffset(coords: any, direction: any): GridOffset;
  /** @override */
  override getShiftedPoint(point: any, direction: any): Point;
  /** @override */
  override getShape(): {
    x: number;
    y: number;
  }[];
  /** @override */
  override getVertices(coords: any): {
    x: number;
    y: number;
  }[];
  /** @override */
  override getSnappedPoint(point: any, { mode, resolution }: {
    mode: any;
    resolution?: number;
  }): {
    x: any;
    y: any;
  };
  /**
   * @typedef {object} _SquareGridMeasurePathResultWaypoint
   * @property {number} diagonals    The total number of diagonals moved along a direct path up to this waypoint.
   */
  /**
   * @typedef {GridMeasurePathResultWaypoint & _SquareGridMeasurePathResultWaypoint} SquareGridMeasurePathResultWaypoint
   */
  /**
   * @typedef {object} _SquareGridMeasurePathResultWaypoint
   * @property {number} diagonals    The number of diagonals moved along this segment.
   */
  /**
   * @typedef {GridMeasurePathResultWaypoint & _SquareGridMeasurePathResultWaypoint} SquareGridMeasurePathResultWaypoint
   */
  /**
   * @typedef {object} _SquareGridMeasurePathResult
   * @property {number} diagonals    The total number of diagonals moved along a direct path through all waypoints.
   */
  /**
   * @typedef {GridMeasurePathResult & _SquareGridMeasurePathResult} SquareGridMeasurePathResult
   */
  /**
   * Measure a shortest, direct path through the given waypoints.
   * @function measurePath
   * @memberof SquareGrid
   * @instance
   *
   * @param {GridMeasurePathWaypoint[]} waypoints           The waypoints the path must pass through
   * @param {object} [options]                              Additional measurement options
   * @param {GridMeasurePathCostFunction} [options.cost]    The function that returns the cost
   *   for a given move between grid spaces (default is the distance travelled)
   * @returns {SquareGridMeasurePathResult}    The measurements a shortest, direct path through the given waypoints.
   */
  /** @override */
  override _measurePath(waypoints: any, { cost }: {
    cost: any;
  }, result: any): void;
  /**
   * @see {@link https://en.wikipedia.org/wiki/Bresenham's_line_algorithm}
   * @override
   */
  override getDirectPath(waypoints: any): GridOffset[];
  /** @override */
  override getTranslatedPoint(point: any, direction: any, distance: any): {
    x: any;
    y: any;
  };
  /** @override */
  override getCircle(center: any, radius: any): Point[];
  /** @override */
  override calculateDimensions(sceneWidth: any, sceneHeight: any, padding: any): {
    width: any;
    height: any;
    x: number;
    y: number;
    rows: number;
    columns: number;
  };
  /**
   * @deprecated since v12
   * @ignore
   */
  getCenter(x: any, y: any): number[];
  /**
   * @deprecated since v12
   * @ignore
   */
  getSnappedPosition(x: any, y: any, interval?: number, options?: {}): {
    x: number;
    y: number;
  };
  /**
   * @deprecated since v12
   * @ignore
   */
  shiftPosition(x: any, y: any, dx: any, dy: any, options?: {}): number[];
  #private;
}
export type _SquareGridConfiguration = {
  /**
   * The rule for diagonal measurement
   *   (see {@link CONST.GRID_DIAGONALS })
   */
  diagonals?: number;
};
export type SquareGridConfiguration = GridConfiguration & _SquareGridConfiguration;
/**
 * An offset of a grid space or a point with pixel coordinates.
 */
export type SquareGridCoordinates = GridCoordinates;
