import BaseGrant from './BaseGrant';

export default class ItemGrant extends BaseGrant {
  #component = null;

  #configComponent = null;

  #type = 'item';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'item' }),
      itemData: new fields.SchemaField({
        uuid: new fields.DocumentIdField({ required: true, initial: '' }),
        quantityOverride: new fields.NumberField({ required: true, initial: 1, integer: true })
      }),
      label: new fields.StringField({ required: true, initial: 'New Item Grant' })
    });
  }

  getApplyData(actor: any, data: any): any {
    if (!actor) return {};
  }

  getSelectionComponent() {
    return this.#component;
  }

  getSelectionComponentProps(data: any) {
    return {
    };
  }

  requiresConfig() {
    return (this.abilities.base.length + this.abilities.options.length) > this.abilities.total;
  }

  override async configureGrant() {
    const dialogData = {
      document: this?.parent,
      grantId: this._id,
      grantType: 'item'
    };

    super.configureGrant(
      'Configure Item Grant',
      dialogData,
      this.#configComponent,
      { width: 400 }
    );
  }
}
