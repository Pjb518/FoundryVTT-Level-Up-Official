export default class DamageRoll extends Roll {
  constructor(formula, data, options) {
    super(formula, data, options);
    this.configureDamage();
  }

  static get TOOLTIP_TEMPLATE() { return 'systems/a5e/templates/chat/roll-tooltip.hbs'; }

  /**
   * A convenience reference for whether this DamageRoll is a critical hit
   * @type {boolean}
   */
  get isCritical() {
    return this.options.canCrit && this.options.isCrit;
  }

  configureDamage() {
    this.terms.forEach((term) => {
      if (this.isCritical) {
        if (term instanceof DiceTerm) term.alter(2, 0);
        if (term instanceof NumericTerm) term.number *= 2;
      }
    });

    this._formula = this.constructor.getFormula(this.terms);
  }
}
