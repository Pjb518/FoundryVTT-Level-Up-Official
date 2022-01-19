/**
 * Extend the base TokenDocument class to implement system-specific HP bar logic.
 * @extends {TokenDocument}
 */
export default class TokenDocument5e extends TokenDocument {
  /** @inheritdoc */
  getBarAttribute(barName, { alternative } = {}) {
    const data = super.getBarAttribute(barName, { alternative });

    if (data && (data.attribute === 'attributes.hp')) {
      data.value += parseInt(getProperty(this.actor.data, 'data.attributes.hp.temp') || 0, 10);
      data.max += parseInt(getProperty(this.actor.data, 'data.attributes.hp.temp') || 0, 10);
    }

    return data;
  }
}
