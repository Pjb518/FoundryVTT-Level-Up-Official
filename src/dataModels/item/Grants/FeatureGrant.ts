import BaseGrant from './BaseGrant';

import FeatureGrantConfig from '../../../apps/components/grants/FeatureGrantConfig.svelte';

export default class FeatureGrant extends BaseGrant {
  #component = null;

  #configComponent = FeatureGrantConfig;

  #type = 'feature';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'feature' }),
      features: new fields.SchemaField({
        base: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, default: [] }
        ),
        options: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, default: [] }
        ),
        total: new fields.NumberField({ required: true, default: 0, integer: true })
      }),
      label: new fields.StringField({ required: true, initial: 'New Feature Grant' })
    });
  }

  getApplyData(actor: any, data: any): any {
    if (!actor) return {};

    return {};
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
      'Configure Feature Grant',
      dialogData,
      this.#configComponent,
      { width: 400 }
    );
  }
}
