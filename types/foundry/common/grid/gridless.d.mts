/**
 * The gridless grid class.
 */
import BaseGrid from './base.d.mts';

export default class GridlessGrid extends BaseGrid {
  /** @override */
  override calculateDimensions(sceneWidth: any, sceneHeight: any, padding: any): {
    width: any;
    height: any;
    x: number;
    y: number;
    rows: number;
    columns: number;
  };
  /** @override */
  override getOffset(coords: any): {
    i: any;
    j: any;
  };
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
  override getAdjacentOffsets(coords: any): any[];
  /** @override */
  override testAdjacency(coords1: any, coords2: any): boolean;
  /** @override */
  override getShiftedOffset(coords: any, direction: any): {
    i: any;
    j: any;
  };
  /** @override */
  override getShiftedPoint(point: any, direction: any): {
    x: any;
    y: any;
  };
  /** @override */
  override getTopLeftPoint(coords: any): {
    x: any;
    y: any;
  };
  /** @override */
  override getCenterPoint(coords: any): {
    x: any;
    y: any;
  };
  /** @override */
  override getVertices(coords: any): any[];
  /** @override */
  override getSnappedPoint({ x, y }: {
    x: any;
    y: any;
  }, behavior: any): {
    x: any;
    y: any;
  };
  /** @override */
  override _measurePath(waypoints: any, { cost }: {
    cost: any;
  }, result: any): void;
  /** @override */
  override getDirectPath(waypoints: any): {
    i: any;
    j: any;
  }[];
  /** @override */
  override getTranslatedPoint(point: any, direction: any, distance: any): {
    x: any;
    y: any;
  };
  /** @override */
  override getCircle({ x, y }: {
    x: any;
    y: any;
  }, radius: any): any[];
  /** @override */
  override getCone(origin: any, radius: any, direction: any, angle: any): any[];
}
