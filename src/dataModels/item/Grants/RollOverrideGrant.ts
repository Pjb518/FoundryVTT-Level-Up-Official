import BaseGrant from './BaseGrant';

import RollOverrideGrantConfig from '../../../apps/components/grants/RollOverrideGrantConfig.svelte';
import RollOverrideGrantSelectionDialog from '../../../apps/components/grants/RollOverrideGrantSelectionDialog.svelte';

export default class RollOverrideGrant extends BaseGrant {
  #component = RollOverrideGrantSelectionDialog;

  #configComponent = RollOverrideGrantConfig;

  #type = 'rollOverride';

  // Schema variables
  declare keys: {
    base: string[];
    options: string[];
    total: number;
  };

  declare rollMode: number;

  declare rollOverrideType: string;

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'rollOverride' }),
      keys: new fields.SchemaField({
        base: new fields.ArrayField(
          new fields.StringField({ nullable: false, initial: '' }),
          { required: true, initial: [] }
        ),
        options: new fields.ArrayField(
          new fields.StringField({ nullable: false, initial: '' }),
          { required: true, initial: [] }
        ),
        total: new fields.NumberField({ nullable: false, initial: 0, integer: true })
      }),
      rollMode: new fields.NumberField({ nullable: false, initial: 0 }),
      rollOverrideType: new fields.StringField({ required: false, initial: 'abilityCheck' }),
      label: new fields.StringField({ required: true, initial: 'New Roll Override Grant' })
    });
  }

  getApplyData(actor: any, data: any) {
    if (!actor) return {};
    const selected: string[] = data?.selected ?? this.keys.base ?? [];
    const count: number = this.keys.total;

    const updates: Record<string, any> = {};

    // Construct grant
    const grantData = {
      rollOverrideData: {
        keys: selected,
        total: count,
        rollOverrideType: this.rollOverrideType,
        rollMode: this.rollMode
      },
      itemUuid: this.parent.uuid,
      grantId: this._id,
      grantType: this.#type,
      level: this.level
    };

    updates['system.grants'] = {
      ...actor.system.grants,
      [this._id]: grantData
    };

    return updates;
  }

  getSelectionComponent() {
    return this.#component;
  }

  getSelectionComponentProps(data: any) {
    return {
      base: this.keys.base ?? [],
      choices: this.keys.options ?? [],
      count: this.keys.total,
      rollOverrideType: this.rollOverrideType,
      selected: data?.selected ?? []
    };
  }

  requiresConfig(): boolean {
    return !!this.keys.options.length;
  }

  override async configureGrant() {
    const dialogData = {
      document: this?.parent,
      grantId: this._id,
      grantType: this.#type
    };

    super.configureGrant(
      'Configure Roll Override Grant',
      dialogData,
      this.#configComponent,
      { width: 400 }
    );
  }
}
