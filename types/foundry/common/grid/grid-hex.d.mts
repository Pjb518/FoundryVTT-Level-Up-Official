/**
 * A helper class which represents a single hexagon as part of a HexagonalGrid.
 * This class relies on having an active canvas scene in order to know the configuration of the hexagonal grid.
 */
import HexagonalGrid from './hexagonal.d.mts';

export default class GridHex {
  /**
   * Construct a GridHex instance by providing a hex coordinate.
   * @param {HexagonalGridCoordinates} coordinates  The coordinates of the hex to construct
   * @param {HexagonalGrid} grid                    The hexagonal grid instance to which this hex belongs
   */
  constructor(coordinates: HexagonalGridCoordinates, grid: HexagonalGrid);
  /**
   * The hexagonal grid to which this hex belongs.
   * @type {HexagonalGrid}
   */
  grid: HexagonalGrid;

  /**
   * The cube coordinate of this hex
   * @type {HexagonalGridCube}
   */
  cube: HexagonalGridCube;

  /**
   * The offset coordinate of this hex
   * @type {GridOffset}
   */
  offset: GridOffset;
  /**
   * Return a reference to the pixel point in the center of this hexagon.
   * @type {Point}
   */
  get center(): Point;
  /**
   * Return a reference to the pixel point of the top-left corner of this hexagon.
   * @type {Point}
   */
  get topLeft(): Point;
  /**
   * Return the array of hexagons which are neighbors of this one.
   * This result is un-bounded by the confines of the game canvas and may include hexes which are off-canvas.
   * @returns {GridHex[]}
   */
  getNeighbors(): GridHex[];
  /**
   * Get a neighboring hex by shifting along cube coordinates
   * @param {number} dq     A number of hexes to shift along the q axis
   * @param {number} dr     A number of hexes to shift along the r axis
   * @param {number} ds     A number of hexes to shift along the s axis
   * @returns {GridHex}     The shifted hex
   */
  shiftCube(dq: number, dr: number, ds: number): GridHex;
  /**
   * Return whether this GridHex equals the same position as some other GridHex instance.
   * @param {GridHex} other     Some other GridHex
   * @returns {boolean}         Are the positions equal?
   */
  equals(other: GridHex): boolean;
}
