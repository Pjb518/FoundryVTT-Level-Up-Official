export default class D20Roll extends Roll {
  constructor(formula, data, options) {
    super(formula, data, options);

    if (!((this.terms[0] instanceof Die) && (this.terms[0].faces === 20))) {
      throw new Error(
        `Invalid D20Roll formula provided: ${this._formula}. D20Roll formulae must begin with a 20-sided die term.`
      );
    }
  }

  static get TOOLTIP_TEMPLATE() { return 'systems/a5e/templates/chat/roll-tooltip.hbs'; }
}
