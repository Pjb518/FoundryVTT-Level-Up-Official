export default class TokenPreviewManager {
  private initialLayer: any;

  private moveTime: number = 0;

  private events: any = {};

  token: any;

  constructor(token: any) {
    this.token = token;

    this.initialLayer = canvas.activeLayer;
  }

  async preview() {
    this.token.draw();
    this.token.layer.preview.addChild(this.token);

    return this.activatePreviewListeners();
  }

  activatePreviewListeners() {
    return new Promise((resolve, reject) => {
      this.events = {
        cancel: this._onCancel.bind(this),
        confirm: this._onConfirm.bind(this),
        move: this._onMove.bind(this),
        rotate: this._onRotate.bind(this),
        resolve,
        reject
      };

      canvas.stage.on('mousemove', this.events.move);
      canvas.stage.on('mousedown', this.events.confirm);
      canvas.app.view.oncontextmenu = this.events.cancel;
      canvas.app.view.onwheel = this.events.rotate;
    });
  }

  _cleanup() {
    canvas.stage.off('mousemove', this.events.move);
    canvas.stage.off('mousedown', this.events.confirm);
    canvas.app.view.oncontextmenu = null;
    canvas.app.view.onwheel = null;

    // TODO: Revert to original layer
  }

  _onMove(e: any) {
    e.stopPropagation();

    const now = Date.now();
    if (now - this.moveTime <= 10) return;
    const center = e.data.getLocalPosition(this.token.layer);

    // Snap to grid
    const hw = canvas.grid.w / 2;
    const hh = canvas.grid.h / 2;
    const x = center.x - (this.token.document.width * hw);
    const y = center.y - (this.token.document.height * hh);

    const destination = e.shiftKey ? { x, y } : canvas.grid.getSnappedPosition(x, y);

    this.token.document.updateSource({ x: destination.x, y: destination.y });
    this.token.refresh();
    this.moveTime = now;
  }

  _onRotate(e: any) {
    if (e.ctrlKey) e.preventDefault(); // Prevent zooming
    e.stopPropagation();

    const delta = Math.sign(e.deltaY);
    const rotation = this.token.rotation + (delta * Math.PI) / 6;

    this.token.document.updateSource({ rotation });
    this.token.refresh();
  }

  _onCancel(e: any) {
    this.token.layer._onDragLeftCancel(e ?? {});
    this._cleanup();

    this.token.layer.preview.removeChild(this.token);
    this.token.destroy();
    this.events.reject();
  }

  _onConfirm() {
    this._cleanup();

    const { token } = this;
    const interval = canvas.grid.type === CONST.GRID_TYPES.GRIDLESS ? 0 : 2;
    const destination = canvas.grid
      .getSnappedPosition(token.document.x, token.document.y, interval);

    token.document.updateSource({ x: destination.x, y: destination.y });
    token.refresh();
    token.destroy();

    this.events.resolve(
      canvas.scene.createEmbeddedDocuments('Token', [token.document.toObject()])
    );
  }
}
