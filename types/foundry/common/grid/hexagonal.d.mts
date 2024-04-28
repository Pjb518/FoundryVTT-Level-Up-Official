/**
 * @typedef {object} _HexagonalGridConfiguration
 * @property {boolean} [columns=false]  Is this grid column-based (flat-topped) or row-based (pointy-topped)?
 * @property {boolean} [even=false]     Is this grid even or odd?
 */
/**
 * @typedef {GridConfiguration&_HexagonalGridConfiguration} HexagonalGridConfiguration
 */
/**
 * Cube coordinates in a hexagonal grid. q + r + s = 0.
 * @typedef {object} HexagonalGridCube
 * @property {number} q    The coordinate along the E-W (columns) or SW-NE (rows) axis.
 *                         Equal to the offset column coordinate if column orientation.
 * @property {number} r    The coordinate along the NE-SW (columns) or N-S (rows) axis.
 *                         Equal to the offset row coordinate if row orientation.
 * @property {number} s    The coordinate along the SE-NW axis.
 */
/**
 * Hex cube coordinates, an offset of a grid space, or a point with pixel coordinates.
 * @typedef {GridCoordinates|HexagonalGridCube} HexagonalGridCoordinates
 */
/**
 * The hexagonal grid class.
 */
export default class HexagonalGrid extends BaseGrid {
    /**
     * Calculate the total size of the canvas with padding applied, as well as the top-left coordinates of the inner
     * rectangle that houses the scene. (Legacy)
     * @param {number} columns            Column or row orientation?
     * @param {number} legacySize         The legacy size of the grid.
     * @param {number} sceneWidth         The width of the scene.
     * @param {number} sceneHeight        The height of the scene.
     * @param {number} padding            The percentage of padding.
     * @returns {{width: number, height: number, x: number, y: number, rows: number, columns: number}}
     * @internal
     */
    static _calculatePreV10Dimensions(columns: number, legacySize: number, sceneWidth: number, sceneHeight: number, padding: number): {
        width: number;
        height: number;
        x: number;
        y: number;
        rows: number;
        columns: number;
    };
    /**
     * Round the fractional cube coordinates (q, r, s).
     * @see {@link https://www.redblobgames.com/grids/hexagons/}
     * @param {HexagonalGridCube} cube    The fractional cube coordinates
     * @returns {HexagonalGridCube}       The rounded integer cube coordinates
     */
    static cubeRound({ q, r, s }: HexagonalGridCube): HexagonalGridCube;
    /**
     * Measure the distance in hexagons between two cube coordinates.
     * @see {@link https://www.redblobgames.com/grids/hexagons/}
     * @param {HexagonalGridCube} a    The first cube coordinates
     * @param {HexagonalGridCube} b    The second cube coordinates
     * @returns {number}               The distance between the two cube coordinates in hexagons
     */
    static cubeDistance(a: HexagonalGridCube, b: HexagonalGridCube): number;
    /**
     * Used by {@link HexagonalGrid#snapToCenter}.
     * @type {Point}
     */
    static "__#30@#TEMP_POINT": Point;
    /**
     * Used by {@link HexagonalGrid#snapToCenter}.
     * Always an odd grid!
     * @type {HexagonalGrid}
     */
    static "__#30@#TEMP_GRID": HexagonalGrid;
    /**
     * @deprecated since v12
     * @ignore
     */
    static get POINTY_HEX_BORDERS(): {
        0.5: number[][];
        1: number[][];
        2: number[][];
        3: number[][];
        4: number[][];
    };
    /**
     * @deprecated since v12
     * @ignore
     */
    static "__#30@#POINTY_HEX_BORDERS": {
        0.5: number[][];
        1: number[][];
        2: number[][];
        3: number[][];
        4: number[][];
    };
    /**
     * @deprecated since v12
     * @ignore
     */
    static get FLAT_HEX_BORDERS(): {
        0.5: number[][];
        1: number[][];
        2: number[][];
        3: number[][];
        4: number[][];
    };
    /**
     * @deprecated since v12
     * @ignore
     */
    static "__#30@#FLAT_HEX_BORDERS": {
        0.5: number[][];
        1: number[][];
        2: number[][];
        3: number[][];
        4: number[][];
    };
    /**
     * @deprecated since v12
     * @ignore
     */
    static get pointyHexPoints(): number[][];
    /**
     * @deprecated since v12
     * @ignore
     */
    static get flatHexPoints(): number[][];
    /**
     * @deprecated since v12
     * @ignore
     */
    static computeDimensions({ columns, size, legacy }: {
        columns: any;
        size: any;
        legacy: any;
    }): {
        width: any;
        height: number;
    } | {
        width: number;
        height: any;
    };
    /**
     * @deprecated since v12
     * @ignore
     */
    static getConfig(type: any, size: any): {
        columns: boolean;
        even: boolean;
        size: any;
    };
    /**
     * @deprecated since v12
     * @ignore
     */
    static offsetToCube({ row, col }?: {
        row: any;
        col: any;
    }, { columns, even }?: {
        columns?: boolean;
        even?: boolean;
    }): HexagonalGridCube;
    /**
     * @deprecated since v12
     * @ignore
     */
    static cubeToOffset(cube?: {}, { columns, even }?: {
        columns?: boolean;
        even?: boolean;
    }): {
        row: GridOffset;
        col: GridOffset;
    };
    /**
     * @deprecated since v12
     * @ignore
     */
    static pixelToCube({ x, y }: {
        x: any;
        y: any;
    }, config: any): {
        q: number;
        r: number;
        s: number;
    };
    /**
     * @deprecated since v12
     * @ignore
     */
    static offsetToPixels({ row, col }: {
        row: any;
        col: any;
    }, { columns, even, width, height }: {
        columns: any;
        even: any;
        width: any;
        height: any;
    }): {
        x: number;
        y: number;
    };
    /**
     * @deprecated since v12
     * @ignore
     */
    static pixelsToOffset({ x, y }: {
        x: any;
        y: any;
    }, config: any, method?: string): {
        row: any;
        col: any;
    };
    /**
     * The hexagonal grid constructor.
     * @param {HexagonalGridConfiguration} config   The grid configuration
     */
    constructor(config: HexagonalGridConfiguration);
    /**
     * Is this grid column-based (flat-topped) or row-based (pointy-topped)?
     * @type {boolean}
     */
    columns: boolean;
    /**
     * Is this grid even or odd?
     * @type {boolean}
     */
    even: boolean;
    /**
     * Returns the offset of the grid space corresponding to the given coordinates.
     * @param {HexagonalGridCoordinates} coords    The coordinates
     * @returns {GridOffset}                       The offset
     */
    getOffset(coords: HexagonalGridCoordinates): GridOffset;
    /** @override */
    override getOffsetRange({ x, y, width, height }: {
        x: any;
        y: any;
        width: any;
        height: any;
    }): any[];
    /** @override */
    override getAdjacentOffsets(coords: any): GridOffset[];
    /** @override */
    override testAdjacency(coords1: any, coords2: any): boolean;
    /** @override */
    override getShiftedOffset(coords: any, direction: any): GridOffset;
    /** @override */
    override getShiftedPoint(point: any, direction: any): Point;
    /**
     * Returns the cube coordinates of the grid space corresponding to the given coordinates.
     * @param {HexagonalGridCoordinates} coords    The coordinates
     * @returns {HexagonalGridCube}                The cube coordinates
     */
    getCube(coords: HexagonalGridCoordinates): HexagonalGridCube;
    /**
     * Returns the cube coordinates of grid spaces adjacent to the one corresponding to the given coordinates.
     * @param {HexagonalGridCoordinates} coords   The coordinates
     * @returns {HexagonalGridCube[]}             The adjacent cube coordinates
     */
    getAdjacentCubes(coords: HexagonalGridCoordinates): HexagonalGridCube[];
    /**
     * Returns the cube coordinates of the grid space corresponding to the given coordinates
     * shifted by one grid space in the given direction.
     * @param {GridCoordinates} coords    The coordinates
     * @param {number} direction          The direction (see {@link CONST.MOVEMENT_DIRECTIONS})
     * @returns {HexagonalGridCube}       The cube coordinates
     */
    getShiftedCube(coords: GridCoordinates, direction: number): HexagonalGridCube;
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
    }): any;
    /** @inheritdoc */
    calculateDimensions(sceneWidth: any, sceneHeight: any, padding: any): {
        width: any;
        height: any;
        x: number;
        y: number;
        rows: number;
        columns: number;
    };
    /** @override */
    override _measurePath(waypoints: any, { cost }: {
        cost: any;
    }, result: any): void;
    /**
     * @see {@link https://www.redblobgames.com/grids/hexagons/#line-drawing}
     * @override
     */
    override getDirectPath(waypoints: any): GridOffset[];
    /** @override */
    override getTranslatedPoint(point: any, direction: any, distance: any): {
        x: any;
        y: any;
    };
    /** @override */
    override getCircle({ x, y }: {
        x: any;
        y: any;
    }, radius: any): {
        x: any;
        y: any;
    }[];
    /**
     * Convert point coordinates (x, y) into cube coordinates (q, r, s).
     * Inverse of {@link HexagonalGrid#cubeToPoint}.
     * @see {@link https://www.redblobgames.com/grids/hexagons/}
     * @param {Point} point            The point
     * @returns {HexagonalGridCube}    The (fractional) cube coordinates
     */
    pointToCube({ x, y }: Point): HexagonalGridCube;
    /**
     * Convert cube coordinates (q, r, s) into point coordinates (x, y).
     * Inverse of {@link HexagonalGrid#pointToCube}.
     * @see {@link https://www.redblobgames.com/grids/hexagons/}
     * @param {HexagonalGridCube} cube    The cube coordinates
     * @returns {Point}                   The point coordinates
     */
    cubeToPoint({ q, r }: HexagonalGridCube): Point;
    /**
     * Convert offset coordinates (i, j) into integer cube coordinates (q, r, s).
     * Inverse of {@link HexagonalGrid#cubeToOffset}.
     * @see {@link https://www.redblobgames.com/grids/hexagons/}
     * @param {GridOffset} offset      The offset coordinates
     * @returns {HexagonalGridCube}    The integer cube coordinates
     */
    offsetToCube({ i, j }: GridOffset): HexagonalGridCube;
    /**
     * Convert integer cube coordinates (q, r, s) into offset coordinates (i, j).
     * Inverse of {@link HexagonalGrid#offsetToCube}.
     * @see {@link https://www.redblobgames.com/grids/hexagons/}
     * @param {HexagonalGridCube} cube    The cube coordinates
     * @returns {GridOffset}              The offset coordinates
     */
    cubeToOffset({ q, r }: HexagonalGridCube): GridOffset;
    /**
     * @deprecated since v12
     * @ignore
     */
    get hexPoints(): any;
    /**
     * @deprecated since v12
     * @ignore
     */
    getPolygon(x: any, y: any, w: any, h: any, points: any): any[];
    /**
     * @deprecated since v12
     * @ignore
     */
    getBorderPolygon(w: any, h: any, p: any): any[];
    /**
     * @deprecated since v12
     * @ignore
     */
    _adjustSnapForTokenSize(x: any, y: any, token: any): any[];
    /**
     * @deprecated since v12
     * @ignore
     */
    set columnar(value: boolean);
    /**
     * @deprecated since v12
     * @ignore
     */
    get columnar(): boolean;
    /**
     * @deprecated since v12
     * @ignore
     */
    getCenter(x: any, y: any): number[];
    /**
     * @deprecated since v12
     * @ignore
     */
    getSnappedPosition(x: any, y: any, interval?: number, { token }?: {
        token: any;
    }): {
        x: number;
        y: number;
    };
    /**
     * @deprecated since v12
     * @ignore
     */
    getGridPositionFromPixels(x: any, y: any): any[];
    /**
     * @deprecated since v12
     * @ignore
     */
    shiftPosition(x: any, y: any, dx: any, dy: any, { token }?: {
        token: any;
    }): any[];
    /**
     * @deprecated since v12
     * @ignore
     */
    _adjustPositionForTokenSize(row: any, col: any, token: any): any[];
    /**
     * @deprecated since v12
     * @ignore
     */
    getAStarPath(start: any, goal: any, options: any): {
        from: any;
        to: any;
        cost: any;
        path: any[];
    };
    #private;
}
export type _HexagonalGridConfiguration = {
    /**
     * Is this grid column-based (flat-topped) or row-based (pointy-topped)?
     */
    columns?: boolean;
    /**
     * Is this grid even or odd?
     */
    even?: boolean;
};
export type HexagonalGridConfiguration = GridConfiguration & _HexagonalGridConfiguration;
/**
 * Cube coordinates in a hexagonal grid. q + r + s = 0.
 */
export type HexagonalGridCube = {
    /**
     * The coordinate along the E-W (columns) or SW-NE (rows) axis.
     * Equal to the offset column coordinate if column orientation.
     */
    q: number;
    /**
     * The coordinate along the NE-SW (columns) or N-S (rows) axis.
     * Equal to the offset row coordinate if row orientation.
     */
    r: number;
    /**
     * The coordinate along the SE-NW axis.
     */
    s: number;
};
/**
 * Hex cube coordinates, an offset of a grid space, or a point with pixel coordinates.
 */
export type HexagonalGridCoordinates = GridCoordinates | HexagonalGridCube;
import BaseGrid from "./base.mjs";
