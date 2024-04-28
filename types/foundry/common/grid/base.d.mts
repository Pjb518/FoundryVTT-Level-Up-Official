/**
 * @typedef {object} GridConfiguration
 * @property {number} size            The size of a grid space in pixels (a positive number)
 * @property {number} [distance=1]    The distance of a grid space in units (a positive number)
 * @property {string} [units=""]      The units of measurement
 * @property {string} [style="solidLines"] The style of the grid
 * @property {ColorSource} [color=0]  The color of the grid
 * @property {number} [alpha=1]       The alpha of the grid
 * @property {number} [thickness=1]   The line thickness of the grid
 */
/**
 * A pair of row and column coordinates of a grid space.
 * @typedef {object} GridOffset
 * @property {number} i    The row coordinate
 * @property {number} j    The column coordinate
 */
/**
 * An offset of a grid space or a point with pixel coordinates.
 * @typedef {GridOffset|Point} GridCoordinates
 */
/**
 * Snapping behavior is defined by the snapping mode at the given resolution of the grid.
 * @typedef {object} GridSnappingBehavior
 * @property {number} mode              The snapping mode (a union of {@link CONST.GRID_SNAPPING_MODES})
 * @property {number} [resolution=1]    The resolution (a positive integer)
 */
/**
 * The base grid class.
 * @abstract
 */
export default class BaseGrid {
    /**
     * @deprecated since v12
     * @ignore
     */
    static calculatePadding(gridType: any, width: any, height: any, size: any, padding: any, options: any): any;
    /**
     * The base grid constructor.
     * @param {GridConfiguration} config                        The grid configuration
     */
    constructor({ size, distance, units, style, thickness, color, alpha }: GridConfiguration, ...args: any[]);
    /**
     * The size of a grid space in pixels.
     * @type {number}
     */
    size: number;
    /**
     * The width of a grid space in pixels.
     * @type {number}
     */
    sizeX: number;
    /**
     * The height of a grid space in pixels.
     * @type {number}
     */
    sizeY: number;
    /**
     * The distance of a grid space in units.
     * @type {number}
     */
    distance: number;
    /**
     * The distance units used in this grid.
     * @type {string}
     */
    units: string;
    /**
     * The style of the grid.
     * @type {string}
     */
    style: string;
    /**
     * The thickness of the grid.
     * @type {number}
     */
    thickness: number;
    /**
     * The color of the grid.
     * @type {Color}
     */
    color: Color;
    /**
     * The opacity of the grid.
     * @type {number}
     */
    alpha: number;
    /**
     * The grid type (see {@link CONST.GRID_TYPES}).
     * @type {number}
     */
    type: number;
    /**
     * Is this a gridless grid?
     * @type {boolean}
     */
    get isGridless(): boolean;
    /**
     * Is this a square grid?
     * @type {boolean}
     */
    get isSquare(): boolean;
    /**
     * Is this a hexagonal grid?
     * @type {boolean}
     */
    get isHexagonal(): boolean;
    /**
     * Calculate the total size of the canvas with padding applied, as well as the top-left coordinates of the inner
     * rectangle that houses the scene.
     * @param {number} sceneWidth         The width of the scene.
     * @param {number} sceneHeight        The height of the scene.
     * @param {number} padding            The percentage of padding.
     * @returns {{width: number, height: number, x: number, y: number, rows: number, columns: number}}
     * @abstract
     */
    calculateDimensions(sceneWidth: number, sceneHeight: number, padding: number): {
        width: number;
        height: number;
        x: number;
        y: number;
        rows: number;
        columns: number;
    };
    /**
     * Returns the offset of the grid space corresponding to the given coordinates.
     * @param {GridCoordinates} coords    The coordinates
     * @returns {GridOffset}              The offset
     * @abstract
     */
    getOffset(coords: GridCoordinates): GridOffset;
    /**
     * Returns the smallest possible range containing the offsets of all grid spaces that intersect the given bounds.
     * If the bounds are empty (nonpositive width or height), then the offset range is empty.
     * @example
     * ```js
     * const [i0, j0, i1, j1] = grid.getOffsetRange(bounds);
     * for ( let i = i0; i < i1; i++ ) {
     *   for ( let j = j0; j < j1; j++ ) {
     *     const offset = {i, j};
     *     // ...
     *   }
     * }
     * ```
     * @param {Rectangle} bounds                                      The bounds
     * @returns {[i0: number, j0: number, i1: number, j1: number]}    The offset range
     * @abstract
     */
    getOffsetRange({ x, y, width, height }: Rectangle): [i0: number, j0: number, i1: number, j1: number];
    /**
     * Returns the offsets of the grid spaces adjacent to the one corresponding to the given coordinates.
     * Returns an empty array in gridless grids.
     * @param {GridCoordinates} coords    The coordinates
     * @returns {GridOffset[]}            The adjacent offsets
     * @abstract
     */
    getAdjacentOffsets(coords: GridCoordinates): GridOffset[];
    /**
     * Returns true if the grid spaces corresponding to the given coordinates are adjacent to each other.
     * In square grids with illegal diagonals the diagonally neighboring grid spaces are not adjacent.
     * Returns false in gridless grids.
     * @param {GridCoordinates} coords1    The first coordinates
     * @param {GridCoordinates} coords2    The second coordinates
     * @returns {boolean}
     * @abstract
     */
    testAdjacency(coords1: GridCoordinates, coords2: GridCoordinates): boolean;
    /**
     * Returns the offset of the grid space corresponding to the given coordinates
     * shifted by one grid space in the given direction.
     * In square grids with illegal diagonals the offset of the given coordinates is returned
     * if the direction is diagonal.
     * @param {GridCoordinates} coords    The coordinates
     * @param {number} direction          The direction (see {@link CONST.MOVEMENT_DIRECTIONS})
     * @returns {GridOffset}              The offset
     * @abstract
     */
    getShiftedOffset(coords: GridCoordinates, direction: number): GridOffset;
    /**
     * Returns the point shifted by the difference between the grid space corresponding to the given coordinates
     * and the shifted grid space in the given direction.
     * In square grids with illegal diagonals the point is not shifted if the direction is diagonal.
     * In gridless grids the point coordinates are shifted by the grid size.
     * @param {Point} point         The point that is to be shifted
     * @param {number} direction    The direction (see {@link CONST.MOVEMENT_DIRECTIONS})
     * @returns {Point}             The shifted point
     * @abstract
     */
    getShiftedPoint(point: Point, direction: number): Point;
    /**
     * Returns the top-left point of the grid space corresponding to the given coordinates.
     * If given a point, the top-left point of the grid space that contains it is returned.
     * In gridless grids a point with the same coordinates as the given point is returned.
     * @param {GridCoordinates} coords    The coordinates
     * @returns {Point}                   The top-left point
     * @abstract
     */
    getTopLeftPoint(coords: GridCoordinates): Point;
    /**
     * Returns the center point of the grid space corresponding to the given coordinates.
     * If given a point, the center point of the grid space that contains it is returned.
     * In gridless grids a point with the same coordinates as the given point is returned.
     * @param {GridCoordinates} coords    The coordinates
     * @returns {Point}                   The center point
     * @abstract
     */
    getCenterPoint(coords: GridCoordinates): Point;
    /**
     * Returns the points of the grid space shape relative to the center point.
     * The points are returned in the same order as in {@link BaseGrid#getVertices}.
     * In gridless grids an empty array is returned.
     * @returns {Point[]}    The points of the polygon
     * @abstract
     */
    getShape(): Point[];
    /**
     * Returns the vertices of the grid space corresponding to the given coordinates.
     * The vertices are returned ordered in positive orientation with the first vertex
     * being the top-left vertex in square grids, the top vertex in row-oriented
     * hexagonal grids, and the left vertex in column-oriented hexagonal grids.
     * In gridless grids an empty array is returned.
     * @param {GridCoordinates} coords    The coordinates
     * @returns {Point[]}                 The vertices
     * @abstract
     */
    getVertices(coords: GridCoordinates): Point[];
    /**
     * Snaps the given point to the grid.
     * @param {Point} point                      The point that is to be snapped
     * @param {GridSnappingBehavior} behavior    The snapping behavior
     * @returns {Point}                          The snapped point
     * @abstract
     */
    getSnappedPoint({ x, y }: Point, behavior: GridSnappingBehavior): Point;
    /**
     * @typedef {GridCoordinates | (GridCoordinates & {teleport: boolean})} GridMeasurePathWaypoint
     */
    /**
     * The measurements of a waypoint.
     * @typedef {object} GridMeasurePathResultWaypoint
     * @property {GridMeasurePathResultSegment|null} backward    The segment from the previous waypoint to this waypoint.
     * @property {GridMeasurePathResultSegment|null} forward     The segment from this waypoint to the next waypoint.
     * @property {number} distance    The total distance travelled along the path up to this waypoint.
     * @property {number} spaces      The total number of spaces moved along a direct path up to this waypoint.
     * @property {number} cost    The total cost of the direct path ({@link BaseGrid#getDirectPath}) up to this waypoint.
     */
    /**
     * The measurements of a segment.
     * @typedef {object} GridMeasurePathResultSegment
     * @property {GridMeasurePathResultWaypoint} from    The waypoint that this segment starts from.
     * @property {GridMeasurePathResultWaypoint} to      The waypoint that this segment goes to.
     * @property {boolean} teleport   Is teleporation?
     * @property {number} distance    The distance travelled in grid units along this segment.
     * @property {number} spaces      The number of spaces moved along this segment.
     * @property {number} cost    The cost of the direct path ({@link BaseGrid#getDirectPath}) between the two waypoints.
     */
    /**
     * The measurements result of {@link BaseGrid#measurePath}.
     * @typedef {object} GridMeasurePathResult
     * @property {GridMeasurePathResultWaypoint[]} waypoints    The measurements at each waypoint.
     * @property {GridMeasurePathResultSegment[]} segments      The measurements at each segment.
     * @property {number} distance    The total distance travelled along the path through all waypoints.
     * @property {number} spaces      The total number of spaces moved along a direct path through all waypoints.
     *                                Moving from a grid space to any of its neighbors counts as 1 step.
     *                                Always 0 in gridless grids.
     * @property {number} cost   The total cost of the direct path ({@link BaseGrid#getDirectPath}) through all waypoints.
     */
    /**
     * A function that returns the cost for a given move between grid spaces.
     * In square and hexagonal grids the grid spaces are always adjacent unless teleported.
     * The distance is 0 if and only if teleported. The function is never called with the same offsets.
     * @callback GridMeasurePathCostFunction
     * @param {GridOffset} from    The offset that is moved from.
     * @param {GridOffset} to      The offset that is moved to.
     * @param {number} distance    The distance between the grid spaces, or 0 if teleported.
     * @returns {number}           The cost of the move between the grid spaces.
     */
    /**
     * Measure a shortest, direct path through the given waypoints.
     * @param {GridMeasurePathWaypoint[]} waypoints           The waypoints the path must pass through
     * @param {object} [options]                              Additional measurement options
     * @param {GridMeasurePathCostFunction} [options.cost]    The function that returns the cost
     *   for a given move between grid spaces (default is the distance travelled along the direct path)
     * @returns {GridMeasurePathResult}        The measurements a shortest, direct path through the given waypoints.
     */
    measurePath(waypoints: any[], options?: {
        cost?: (from: GridOffset, to: GridOffset, distance: number) => number;
    }): {
        /**
         * The measurements at each waypoint.
         */
        waypoints: {
            /**
             * The segment from the previous waypoint to this waypoint.
             */
            backward: {
                /**
                 * The waypoint that this segment starts from.
                 */
                from: any;
                /**
                 * The waypoint that this segment goes to.
                 */
                to: any;
                /**
                 * Is teleporation?
                 */
                teleport: boolean;
                /**
                 * The distance travelled in grid units along this segment.
                 */
                distance: number;
                /**
                 * The number of spaces moved along this segment.
                 */
                spaces: number;
                /**
                 * The cost of the direct path ({@link BaseGridgetDirectPath }) between the two waypoints.
                 */
                cost: number;
            };
            /**
             * The segment from this waypoint to the next waypoint.
             */
            forward: {
                /**
                 * The waypoint that this segment starts from.
                 */
                from: any;
                /**
                 * The waypoint that this segment goes to.
                 */
                to: any;
                /**
                 * Is teleporation?
                 */
                teleport: boolean;
                /**
                 * The distance travelled in grid units along this segment.
                 */
                distance: number;
                /**
                 * The number of spaces moved along this segment.
                 */
                spaces: number;
                /**
                 * The cost of the direct path ({@link BaseGridgetDirectPath }) between the two waypoints.
                 */
                cost: number;
            };
            /**
             * The total distance travelled along the path up to this waypoint.
             */
            distance: number;
            /**
             * The total number of spaces moved along a direct path up to this waypoint.
             */
            spaces: number;
            /**
             * The total cost of the direct path ({@link BaseGridgetDirectPath }) up to this waypoint.
             */
            cost: number;
        }[];
        /**
         * The measurements at each segment.
         */
        segments: {
            /**
             * The waypoint that this segment starts from.
             */
            from: any;
            /**
             * The waypoint that this segment goes to.
             */
            to: any;
            /**
             * Is teleporation?
             */
            teleport: boolean;
            /**
             * The distance travelled in grid units along this segment.
             */
            distance: number;
            /**
             * The number of spaces moved along this segment.
             */
            spaces: number;
            /**
             * The cost of the direct path ({@link BaseGridgetDirectPath }) between the two waypoints.
             */
            cost: number;
        }[];
        /**
         * The total distance travelled along the path through all waypoints.
         */
        distance: number;
        /**
         * The total number of spaces moved along a direct path through all waypoints.
         * Moving from a grid space to any of its neighbors counts as 1 step.
         * Always 0 in gridless grids.
         */
        spaces: number;
        /**
         * The total cost of the direct path ({@link BaseGridgetDirectPath }) through all waypoints.
         */
        cost: number;
    };
    /**
     * Measures the path and writes the measurements into `result`.
     * Called by {@link BaseGrid#measurePath}.
     * @param {GridMeasurePathWaypoint[]} waypoints           The waypoints the path must pass through
     * @param {object} options                                Additional measurement options
     * @param {GridMeasurePathCostFunction} [options.cost]    The function that returns the cost
     *   for a given move between grid spaces (default is the distance travelled)
     * @param {GridMeasurePathResult} result    The measurement result that the measurements need to be written to
     * @protected
     * @abstract
     */
    protected _measurePath(waypoints: any[], options: {
        cost?: (from: GridOffset, to: GridOffset, distance: number) => number;
    }, result: {
        /**
         * The measurements at each waypoint.
         */
        waypoints: {
            /**
             * The segment from the previous waypoint to this waypoint.
             */
            backward: {
                /**
                 * The waypoint that this segment starts from.
                 */
                from: any;
                /**
                 * The waypoint that this segment goes to.
                 */
                to: any;
                /**
                 * Is teleporation?
                 */
                teleport: boolean;
                /**
                 * The distance travelled in grid units along this segment.
                 */
                distance: number;
                /**
                 * The number of spaces moved along this segment.
                 */
                spaces: number;
                /**
                 * The cost of the direct path ({@link BaseGridgetDirectPath }) between the two waypoints.
                 */
                cost: number;
            };
            /**
             * The segment from this waypoint to the next waypoint.
             */
            forward: {
                /**
                 * The waypoint that this segment starts from.
                 */
                from: any;
                /**
                 * The waypoint that this segment goes to.
                 */
                to: any;
                /**
                 * Is teleporation?
                 */
                teleport: boolean;
                /**
                 * The distance travelled in grid units along this segment.
                 */
                distance: number;
                /**
                 * The number of spaces moved along this segment.
                 */
                spaces: number;
                /**
                 * The cost of the direct path ({@link BaseGridgetDirectPath }) between the two waypoints.
                 */
                cost: number;
            };
            /**
             * The total distance travelled along the path up to this waypoint.
             */
            distance: number;
            /**
             * The total number of spaces moved along a direct path up to this waypoint.
             */
            spaces: number;
            /**
             * The total cost of the direct path ({@link BaseGridgetDirectPath }) up to this waypoint.
             */
            cost: number;
        }[];
        /**
         * The measurements at each segment.
         */
        segments: {
            /**
             * The waypoint that this segment starts from.
             */
            from: any;
            /**
             * The waypoint that this segment goes to.
             */
            to: any;
            /**
             * Is teleporation?
             */
            teleport: boolean;
            /**
             * The distance travelled in grid units along this segment.
             */
            distance: number;
            /**
             * The number of spaces moved along this segment.
             */
            spaces: number;
            /**
             * The cost of the direct path ({@link BaseGridgetDirectPath }) between the two waypoints.
             */
            cost: number;
        }[];
        /**
         * The total distance travelled along the path through all waypoints.
         */
        distance: number;
        /**
         * The total number of spaces moved along a direct path through all waypoints.
         * Moving from a grid space to any of its neighbors counts as 1 step.
         * Always 0 in gridless grids.
         */
        spaces: number;
        /**
         * The total cost of the direct path ({@link BaseGridgetDirectPath }) through all waypoints.
         */
        cost: number;
    }): void;
    /**
     * Returns the sequence of grid offsets of a shortest, direct path passing through the given waypoints.
     * @param {GridCoordinates[]} waypoints    The waypoints the path must pass through
     * @returns {GridOffset[]}                 The sequence of grid offsets of a shortest, direct path
     * @abstract
     */
    getDirectPath(waypoints: GridCoordinates[]): GridOffset[];
    /**
     * Get the point translated in a direction by a distance.
     * @param {Point} point         The point that is to be translated.
     * @param {number} direction    The angle of direction in degrees.
     * @param {number} distance     The distance in grid units.
     * @returns {Point}             The translated point.
     * @abstract
     */
    getTranslatedPoint(point: Point, direction: number, distance: number): Point;
    /**
     * Get the circle polygon given the radius in grid units for this grid.
     * The points of the polygon are returned ordered in positive orientation.
     * In gridless grids an approximation of the true circle with a deviation of less than 0.25 pixels is returned.
     * @param {Point} center     The center point of the circle.
     * @param {number} radius    The radius in grid units.
     * @returns {Point[]}        The points of the circle polygon.
     * @abstract
     */
    getCircle(center: Point, radius: number): Point[];
    /**
     * Get the cone polygon given the radius in grid units and the angle in degrees for this grid.
     * The points of the polygon are returned ordered in positive orientation.
     * In gridless grids an approximation of the true cone with a deviation of less than 0.25 pixels is returned.
     * @param {Point} origin        The origin point of the cone.
     * @param {number} radius       The radius in grid units.
     * @param {number} direction    The direction in degrees.
     * @param {number} angle        The angle in degrees.
     * @returns {Point[]}           The points of the cone polygon.
     */
    getCone(origin: Point, radius: number, direction: number, angle: number): Point[];
    /**
     * @deprecated since v12
     * @ignore
     */
    getRect(w: any, h: any): any;
    /**
     * @deprecated since v12
     * @ignore
     */
    set w(value: number);
    /**
     * @deprecated
     * @ignore
     */
    get w(): number;
    /**
     * @deprecated since v12
     * @ignore
     */
    set h(value: number);
    /**
     * @deprecated since v12
     * @ignore
     */
    get h(): number;
    /**
     * @deprecated since v12
     * @ignore
     */
    getTopLeft(x: any, y: any): number[];
    /**
     * @deprecated since v12
     * @ignore
     */
    getCenter(x: any, y: any): any[];
    /**
     * @deprecated since v12
     * @ignore
     */
    getNeighbors(row: any, col: any): number[][];
    /**
     * @deprecated since v12
     * @ignore
     */
    getGridPositionFromPixels(x: any, y: any): number[];
    /**
     * @deprecated since v12
     * @ignore
     */
    getPixelsFromGridPosition(row: any, col: any): number[];
    /**
     * @deprecated since v12
     * @ignore
     */
    shiftPosition(x: any, y: any, dx: any, dy: any, options?: {}): any[];
    /**
     * @deprecated since v12
     * @ignore
     */
    measureDistances(segments: any, options?: {}): any;
    /**
     * @deprecated since v12
     * @ignore
     */
    getSnappedPosition(x: any, y: any, interval?: any, options?: {}): {
        x: number;
        y: number;
    };
    /**
     * @deprecated since v12
     * @ignore
     */
    highlightGridPosition(layer: any, options: any): void;
    /**
     * @deprecated since v12
     * @ignore
     */
    get grid(): this;
    /**
     * @deprecated since v12
     * @ignore
     */
    isNeighbor(r0: any, c0: any, r1: any, c1: any): boolean;
    /**
     * @deprecated since v12
     * @ignore
     */
    get isHex(): boolean;
    /**
     * @deprecated since v12
     * @ignore
     */
    measureDistance(origin: any, target: any, options?: {}): any;
    /**
     * @deprecated since v12
     * @ignore
     */
    get highlight(): any;
    /**
     * @deprecated since v12
     * @ignore
     */
    get highlightLayers(): any;
    /**
     * @deprecated since v12
     * @ignore
     */
    addHighlightLayer(name: any): any;
    /**
     * @deprecated since v12
     * @ignore
     */
    clearHighlightLayer(name: any): void;
    /**
     * @deprecated since v12
     * @ignore
     */
    destroyHighlightLayer(name: any): void;
    /**
     * @deprecated since v12
     * @ignore
     */
    getHighlightLayer(name: any): any;
    /**
     * @deprecated since v12
     * @ignore
     */
    highlightPosition(name: any, options: any): void;
}
export type GridConfiguration = {
    /**
     * The size of a grid space in pixels (a positive number)
     */
    size: number;
    /**
     * The distance of a grid space in units (a positive number)
     */
    distance?: number;
    /**
     * The units of measurement
     */
    units?: string;
    /**
     * The style of the grid
     */
    style?: string;
    /**
     * The color of the grid
     */
    color?: ColorSource;
    /**
     * The alpha of the grid
     */
    alpha?: number;
    /**
     * The line thickness of the grid
     */
    thickness?: number;
};
/**
 * A pair of row and column coordinates of a grid space.
 */
export type GridOffset = {
    /**
     * The row coordinate
     */
    i: number;
    /**
     * The column coordinate
     */
    j: number;
};
/**
 * An offset of a grid space or a point with pixel coordinates.
 */
export type GridCoordinates = GridOffset | Point;
/**
 * Snapping behavior is defined by the snapping mode at the given resolution of the grid.
 */
export type GridSnappingBehavior = {
    /**
     * The snapping mode (a union of {@link CONST.GRID_SNAPPING_MODES })
     */
    mode: number;
    /**
     * The resolution (a positive integer)
     */
    resolution?: number;
};
import Color from "../utils/color.mjs";
