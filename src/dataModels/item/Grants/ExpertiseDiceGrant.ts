import BaseGrant from './BaseGrant';

import ExpertiseDiceGrantConfig from '../../../apps/components/grants/ExpertiseDiceGrantConfig.svelte';
import ExpertiseDiceSelectionDialog from '../../../apps/components/grants/ExpertiseDiceSelectionDialog.svelte';

export default class ExpertiseDiceGrant extends BaseGrant {
  #component = ExpertiseDiceSelectionDialog;

  #configComponent = ExpertiseDiceGrantConfig;

  #type = 'expertiseDice';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'expertiseDice' }),
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
      expertiseCount: new fields.NumberField({ nullable: false, initial: 1, integer: true }),
      expertiseType: new fields.StringField({ required: false, initial: 'abilityCheck' }),
      label: new fields.StringField({ required: true, initial: 'New Expertise Dice Grant' })
    });
  }

  getApplyData(actor: any, data: any) {
    if (!actor) return {};
    const selected: string[] = data?.selected ?? this.keys.base ?? [];
    const count: number = this.keys.total;

    const updates: Record<string, any> = {};

    // Construct grant
    const grantData = {
      expertiseDiceData: {
        keys: selected,
        total: count,
        expertiseType: this.expertiseType,
        expertiseCount: this.expertiseCount
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
      base: data?.selected ?? this.keys.base ?? [],
      choices: this.keys.options,
      count: this.keys.total,
      expertiseType: this.expertiseType
    };
  }

  requiresConfig() {
    return !!this.keys.options.length;
  }

  override async configureGrant() {
    const dialogData = {
      document: this?.parent,
      grantId: this._id,
      grantType: 'expertiseDice'
    };

    super.configureGrant(
      'Configure Expertise Grant',
      dialogData,
      this.#configComponent,
      { width: 400 }
    );
  }
}
