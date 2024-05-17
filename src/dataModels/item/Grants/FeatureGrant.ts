import BaseGrant from './BaseGrant';

import FeatureGrantSelectionDialog from '../../../apps/components/grants/FeatureGrantSelectionDialog.svelte';
import FeatureGrantConfig from '../../../apps/components/grants/FeatureGrantConfig.svelte';

export default class FeatureGrant extends BaseGrant {
  #component = FeatureGrantSelectionDialog;

  #configComponent = FeatureGrantConfig;

  #type = 'feature';

  // Variables for the schema

  declare features: {
    base: { uuid: string, limitedReselection: boolean, selectionLimit: number }[];
    options: { uuid: string, limitedReselection: boolean, selectionLimit: number }[];
    total: number;
  };

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'feature' }),
      features: new fields.SchemaField({
        base: new fields.ArrayField(
          new fields.SchemaField({
            uuid: new fields.StringField({ required: true, initial: '' }),
            limitedReselection: new fields.BooleanField({ required: true, initial: true }),
            selectionLimit: new fields.NumberField({ nullable: false, initial: 1 })
          }),
          { required: true, default: [] }
        ),
        options: new fields.ArrayField(
          new fields.SchemaField({
            uuid: new fields.StringField({ required: true, initial: '' }),
            limitedReselection: new fields.BooleanField({ required: true, initial: true }),
            selectionLimit: new fields.NumberField({ nullable: false, initial: 1 })
          }),
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
      grantType: 'feature',
      level: this.level
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
      base: this.features.base,
      choices: this.features.options,
      count: this.features.total,
      selected: data?.uuids ?? []
    };
  }

  requiresConfig(): boolean {
    return !!this.features.options.length;
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
      { width: 550 }
    );
  }
}
