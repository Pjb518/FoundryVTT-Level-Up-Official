import ItemMeasuredTemplate from '../pixi/ItemMeasuredTemplate';

export default class TemplatePreparationManager {
  #action;

  #item;

  constructor(item, action) {
    this.#action = action;
    this.#item = item;
  }

  get TEMPLATE_FUNCTION_MAP() {
    return {
      circle: this.#getCircleTemplateData,
      cone: this.#getConeTemplateData,
      cube: this.#getCubeTemplateData,
      cylinder: this.#getCircleTemplateData,
      line: this.#getLineTemplateData,
      sphere: this.#getCircleTemplateData,
      square: this.#getCubeTemplateData
    };
  }

  // --------------------------------------------
  // Public Functions
  // --------------------------------------------

  async placeActionTemplates() {
    const { area } = this.#action;
    const quantity = area.quantity ?? 1;

    try {
      for (let i = 0; i < quantity; i += 1) {
        const templateDocument = this.#createTemplateDocument(area);
        const template = new ItemMeasuredTemplate(templateDocument);
        if (!template) return;

        template.item = this.#item;
        template.actorSheet = this.#item.actor?.sheet || null;

        let placed = false;
        setTimeout(() => {
          if (placed) return;

          template?._onCancel();
          throw new Error('Time limit for placing template exceeded');
        }, 30000);

        // eslint-disable-next-line no-await-in-loop
        const templateData = await template?.drawPreview();
        placed = true;

        if (templateData) { Hooks.callAll('a5e.templateCreated', this, templateData, game.user.id); }
      }
    } catch (err) {
      // Empty Block
    }
  }

  /**
   *
   * @param {ItemA5e} item
   * @param {Action} action
   * @returns {Boolean} validTemplate
   */
  validateBaseTemplateData(action = this.#action) {
    const { area } = action ?? {};
    if (foundry.utils.isEmpty(area)) return false;
    area.quantity ??= 1;

    if (!area.shape) return false;
    if (area.quantity <= 0) return false;

    // Validate separately
    if (area.shape === 'cone') return this.#validateCone(area);
    if (['cube', 'square'].includes(area.shape)) return this.#validateQuadrilateral(area);
    if (['circle', 'sphere'].includes(area.shape)) return this.#validateRadialObject(area);
    if (area.shape === 'cylinder') return this.#validateCylinder(area);
    if (area.shape === 'line') return this.#validateLine(area.shape);
    return false;
  }

  // --------------------------------------------
  // Internal Functions - Validators
  // --------------------------------------------
  #validateCone(area) {
    const length = parseInt(area?.length, 10);
    if (!length || length <= 0) return false;

    return true;
  }

  #validateQuadrilateral(area) {
    const size = parseInt(area?.width, 10);
    if (!size || size <= 0) return false;

    return true;
  }

  #validateRadialObject(area) {
    const radius = parseInt(area?.radius, 10);
    if (!radius || radius <= 0) return false;

    return true;
  }

  #validateCylinder(area) {
    const radius = parseInt(area?.radius, 10);
    const height = parseInt(area?.radius, 10);

    if (!radius || !height) return false;
    if (radius <= 0 || height <= 0) return false;

    return true;
  }

  #validateLine(area) {
    const length = parseInt(area?.length, 10);
    const width = parseInt(area?.width, 10);

    if (!width || !length) return false;
    if (width <= 0 || length <= 0) return false;

    return true;
  }

  // --------------------------------------------
  // Internal Functions - Template Creations
  // --------------------------------------------
  #createTemplateDocument(area) {
    const { shape } = area;
    const templateConfigFunction = this.TEMPLATE_FUNCTION_MAP[shape];

    // Get scaled data
    // eslint-disable-next-line no-param-reassign
    area = this.#applyTemplateScaling(area);

    const templateData = templateConfigFunction(area);
    if (!templateData) return null;

    const TemplateDocument = CONFIG.MeasuredTemplate.documentClass;
    return new TemplateDocument(templateData, { parent: canvas.scene });
  }

  #getCircleTemplateData(area) {
    const radius = parseInt(area.radius, 10);

    // Scale

    return {
      direction: 0,
      distance: radius,
      fillColor: game.user.color,
      t: 'circle',
      user: game.user.id,
      x: 0,
      y: 0
    };
  }

  #getConeTemplateData(area) {
    const length = parseInt(area.length, 10);

    // Scale

    return {
      angle: CONFIG.MeasuredTemplate.defaults.angle,
      direction: 0,
      distance: length,
      fillColor: game.user.color,
      t: 'cone',
      user: game.user.id,
      x: 0,
      y: 0
    };
  }

  #getCubeTemplateData(area) {
    const size = parseInt(area.width, 10);

    // Scale

    return {
      direction: 45,
      distance: Math.hypot(size, size),
      fillColor: game.user.color,
      t: 'rect',
      user: game.user.id,
      width: size,
      x: 0,
      y: 0
    };
  }

  #getLineTemplateData(area) {
    const length = parseInt(area.length, 10);
    const width = parseInt(area.width, 10);

    // Scale

    return {
      direction: 0,
      distance: length,
      fillColor: game.user.color,
      t: 'ray',
      user: game.user.id,
      width,
      x: 0,
      y: 0
    };
  }

  // --------------------------------------------
  // Internal Functions - Scaling
  // --------------------------------------------
  #applyTemplateScaling(area) {
    const scalingMode = area.scaling?.mode;
    if (!scalingMode) return area;

    if (scalingMode === 'cantrip') return this.#applyCantripScaling(area);
    if (scalingMode === 'spellLevel') return this.#applySpellLevelScaling(area);
    if (scalingMode === 'spellPoints') return this.#applySpellPointScaling(area);
    if (scalingMode === 'actionUses') return this.#applyActionUsesScaling(area);
    if (scalingMode === 'itemUses') return this.#applyItemUsesScaling(area);

    return area;
  }

  #applyCantripScaling(area) { }

  #applySpellLevelScaling(area) { }

  #applySpellPointScaling(area) { }

  #applyActionUsesScaling(area) { }

  #applyItemUsesScaling(area) { }

  // --------------------------------------------
  // Static Functions
  // --------------------------------------------
  static getShapeProperties(shape) {
    switch (shape) {
      case 'circle':
      case 'sphere':
        return ['radius'];
      case 'cone':
        return ['length'];
      case 'cube':
      case 'square':
        return ['width'];
      case 'cylinder':
        return ['radius', 'height'];
      case 'line':
        return ['length', 'width'];
      default:
        return [];
    }
  }
}
