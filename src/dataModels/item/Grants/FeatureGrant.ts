import BaseGrant from './BaseGrant';

import DocumentGrantSelectionDialog from '../../../apps/components/grants/DocumentGrantSelectionDialog.svelte';
import FeatureGrantConfig from '../../../apps/components/grants/FeatureGrantConfig.svelte';

export default class FeatureGrant extends BaseGrant {
  #component = DocumentGrantSelectionDialog;

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
        total: new fields.NumberField({ required: true, initial: 0, integer: true })
      }),
      label: new fields.StringField({ required: true, initial: 'New Feature Grant' })
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getApplyData(actor: any, data: any): any {
    if (!actor) return {};

    const grantData = {
      itemUuid: this.parent.uuid,
      grantId: this._id,
      grantType: 'feature'
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
      base: data?.selected ?? this.features.base ?? [],
      choices: this.features.options ?? [],
      count: this.features.total,
      documentType: this.#type
    };
  }

  requiresConfig() {
    return this.features.options.length;
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
