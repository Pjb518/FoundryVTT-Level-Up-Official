export default class ItemMeasuredTemplate extends MeasuredTemplate {
  drawPreview() {
    const initLayer = canvas.activeLayer;

    // Draw template and switch to template layer
    this.draw();
    this.layer.activate();
    this.layer.preview.addChild(this);

    // Hide sheet
    this.actorSheet?.minimize();

    // Enable interactive mode
    this.activatePreviewListeners(initLayer);
  }

  activatePreviewListeners(initLayer) {
    const handlers = {};
    let moveTime = 0;

    // Move
    handlers.move = (e) => {
      e.stopPropagation();

      const now = Date.now();
      if (now - moveTime <= 10) return;

      const center = e.data.getLocalPosition(this.layer);
      const snapped = canvas.grid.getSnappedPosition(center.x, center.y, 2);

      this.data.update({ x: snapped.x, y: snapped.y });
      this.refresh();
      moveTime = now;
    };

    // Rotate
    handlers.rotate = (e) => {
      if (e.ctrlKey) e.preventDefault();
      e.stopPropagation();

      const delta = canvas.grid.type > CONST.GRID_TYPES.SQUARE ? 30 : 15;
      const snap = e.shiftKey ? delta : 0;

      this.data.update({ direction: this.data.direction + snap * Math.sign(e.deltaY) });
      this.refresh();
    };

    // Cancel
    handlers.cancel = (e) => {
      // eslint-disable-next-line no-underscore-dangle
      this.layer._onDragLeftCancel(e);
      canvas.stage.off('mousemove', handlers.move);
      canvas.stage.off('mousedown', handlers.confirm);

      canvas.app.view.oncontextmenu = null;
      canvas.app.view.onwheel = null;
      initLayer.activate();
      this.actorSheet?.maximize();
    };

    // Confirm
    handlers.confirm = (e) => {
      handlers.cancel(e);
      const destination = canvas.grid.getSnappedPosition(this.data.x, this.data.y, 2);

      this.data.update(destination);
      canvas.scene.createEmbeddedDocuments('MeasuredTemplate', [this.data]);
    };

    // Setup Listeners
    canvas.stage.on('mousemove', handlers.move);
    canvas.stage.on('mousedown', handlers.confirm);
    canvas.app.view.oncontextmenu = handlers.cancel;
    canvas.app.view.onwheel = handlers.rotate;
  }
}
