export default class ItemMeasuredTemplate extends MeasuredTemplate {
  #moveTime = 0;

  #initialLayer;

  #events;

  async drawPreview() {
    const initialLayer = canvas.activeLayer;

    // Draw template and switch to template layer
    this.draw();
    // TODO: Remove when upstream bug is fixed
    try {
      this.layer.activate();
    } catch (err) {
      if (err.name !== 'TypeError') throw new Error(err);
    }
    this.layer.preview.addChild(this);

    // Enable interactive mode
    return this.activatePreviewListeners(initialLayer);
  }

  activatePreviewListeners(initialLayer) {
    return new Promise((resolve, reject) => {
      this.#initialLayer = initialLayer;
      this.#events = {
        cancel: this._onCancel.bind(this),
        confirm: this._onConfirm.bind(this),
        move: this._onMove.bind(this),
        rotate: this._onRotate.bind(this),
        resolve,
        reject
      };

      // Activate listeners
      canvas.stage.on('mousemove', this.#events.move);
      canvas.stage.on('mousedown', this.#events.confirm);
      canvas.app.view.oncontextmenu = this.#events.cancel;
      canvas.app.view.onwheel = this.#events.rotate;
    });
  }

  async _finishPlacement(e) {
    this.layer._onDragLeftCancel(e ?? {});
    canvas.stage.off('mousemove', this.#events.move);
    canvas.stage.off('mousedown', this.#events.confirm);
    canvas.app.view.oncontextmenu = null;
    canvas.app.view.onwheel = null;
    this.#initialLayer.activate();
  }

  _onMove(e) {
    e.stopPropagation();

    const now = Date.now();
    if (now - this.#moveTime <= 10) return;
    const center = e.data.getLocalPosition(this.layer);
    const interval = canvas.grid.type === CONST.GRID_TYPES.GRIDLESS ? 0 : 2;
    const snapped = canvas.grid.getSnappedPosition(center.x, center.y, interval);

    this.document.updateSource({ x: snapped.x, y: snapped.y });
    this.refresh();
    this.#moveTime = now;
  }

  _onRotate(e) {
    if (e.ctrlKey) e.preventDefault(); // Avoid zooming the browser window
    e.stopPropagation();

    const delta = canvas.grid.type > CONST.GRID_TYPES.SQUARE ? 30 : 15;
    const snap = e.shiftKey ? delta : 5;
    const update = {
      direction: this.document.direction + (snap * Math.sign(e.deltaY))
    };

    this.document.updateSource(update);
    this.refresh();
  }

  async _onConfirm(e) {
    await this._finishPlacement(e);
    const interval = canvas.grid.type === CONST.GRID_TYPES.GRIDLESS ? 0 : 2;
    const destination = canvas.grid.getSnappedPosition(this.document.x, this.document.y, interval);

    this.document.updateSource(destination);
    this.#events.resolve(
      canvas.scene.createEmbeddedDocuments('MeasuredTemplate', [this.document.toObject()])
    );

    Hooks.callAll('a5e.measuredTemplatePlaced', this.item, this.document.toObject(), game.user.id);
  }

  async _onCancel(e) {
    await this._finishPlacement(e ?? {});
    this.#events.reject();
  }
}
