import BaseGrant from './BaseGrant';

import DocumentGrantSelectionDialog from '../../../apps/components/grants/DocumentGrantSelectionDialog.svelte';
import ItemGrantConfig from '../../../apps/components/grants/ItemGrantConfig.svelte';

export default class ItemGrant extends BaseGrant {
  #component = DocumentGrantSelectionDialog;

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getApplyData(actor: any, data: any): any {
    if (!actor) return {};

    const grantData = {
      itemUuid: this.parent.uuid,
      grantId: this._id,
      grantType: this.#type
    };

    return {
      'system.grants': {
        ...actor.system.grants,
        [this._id]: grantData
      }
    };
  }

  getSelectionComponent() {
    return this.#component;
  }

  getSelectionComponentProps(data: any) {
    return {
      base: data?.selected ?? this.items.base.map(({ uuid }) => uuid) ?? [],
      choices: this.items.options.map(({ uuid }) => uuid) ?? [],
      count: this.items.total,
      documentType: this.#type
    };
  }

  requiresConfig() {
    return this.items.options.length;
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
