import BaseGrant from './BaseGrant';

import ItemGrantConfig from '../../../apps/components/grants/ItemGrantConfig.svelte';

export default class ItemGrant extends BaseGrant {
  #component = null;

  #configComponent = ItemGrantConfig;

  #type = 'item';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'item' }),
      items: new fields.SchemaField({
        base: new fields.ArrayField(
          new fields.SchemaField({
            uuid: new fields.StringField({ required: true, initial: '' }),
            quantityOverride: new fields.NumberField({ required: true, initial: 0, integer: true })
          }),
          { required: true, default: [] }
        ),
        options: new fields.ArrayField(
          new fields.SchemaField({
            uuid: new fields.StringField({ required: true, initial: '' }),
            quantityOverride: new fields.NumberField({ required: true, initial: 0, integer: true })
          })
        ),
        total: new fields.NumberField({ required: true, default: 0, integer: true })
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
      grantType: this.#type
    };

    super.configureGrant(
      'Configure Item Grant',
      dialogData,
      this.#configComponent,
      { width: 400 }
    );
  }
}
