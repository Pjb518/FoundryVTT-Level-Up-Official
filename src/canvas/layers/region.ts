export class RegionLayerA5E extends foundry.canvas.layers.RegionLayer {
  // override placeRegion(data, options = {}) {
  //   if (data.displayMeasurements && data.highlightMode === "coverage") {
  //     options.onMove = ({ position, preview, snap }) => {
  //       if (canvas.grid.type !== CONST.GRID_TYPES.SQUARE || !snap) return;
  //       const snappingMode = (preview as RegionPF2e).snappingMode;
  //       const { x, y } = canvas.grid.getSnappedPoint(position, {
  //         mode: snappingMode,
  //       });
  //       position.x = x;
  //       position.y = y;
  //     };
  //   }
  //   return super.placeRegion(data, options);
  // }
}
