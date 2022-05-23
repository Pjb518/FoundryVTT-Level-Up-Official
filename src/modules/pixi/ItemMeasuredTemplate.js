/* global MeasuredTemplate */

const templateMapping = {
  cone: 'cone',
  cube: 'rect',
  cylinder: 'circle',
  line: 'ray',
  sphere: 'circle'
};

export default class ItemMeasuredTemplate extends MeasuredTemplate {
  static fromItem(item) {
    const { shape } = item.data.data.area;
    const size = Number(item.data.data.area.size);

    // TODO: Switch to getting shape from shape classes in the future.
    const templateShape = templateMapping[shape];

    if (!templateShape) return null;

    // Prepare template data
    const templateData = {
      t: templateShape,
      user: game.user.id,
      distance: size,
      direction: 0,
      x: 0,
      y: 0,
      fillColor: game.user.color
    };

    // Morph data based on shape type
    switch (templateShape) {
      case 'cone':
        templateData.angle = CONFIG.MeasuredTemplate.defaults.angle;
        break;
      case 'rect':
        templateData.distance = Math.hypot(size, size);
        templateData.width = size;
        break;
      case 'ray':
        templateData.width = canvas.dimensions.distance;
        break;
      default:
        break;
    }

    // Construct template and return
    const Doc = CONFIG.MeasuredTemplate.documentClass;
    const templateDocument = new Doc(templateData, { parent: canvas.scene });
    const template = new this(templateDocument);
    template.item = item;

    template.actorSheet = item.actor?.sheet || null;

    return template;
  }

  drawPreview() {
    const initLayer = canvas.activeLayer;

    // Draw template and switch to template layer
    this.drawPreview();
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
    canvas.stage.on('mousedown', handlers.cancel);
    canvas.app.view.oncontextmenu = handlers.confirm;
    canvas.app.view.onwheel = handlers.rotate;
  }
}
