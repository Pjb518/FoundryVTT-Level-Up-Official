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
}
