import BaseGrant from './BaseGrant';

import ProficiencyGrantConfig from '../../../apps/components/grants/ProficiencyGrantConfig.svelte';
import ProficiencyGrantSelection from '../../../apps/components/grants/ProficiencyGrantSelection.svelte';

export default class ProficiencyGrant extends BaseGrant {
  #component = ProficiencyGrantSelection;

  #configComponent = ProficiencyGrantConfig;

  #type = 'proficiency';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'proficiency' }),
      keys: new fields.SchemaField({
        base: new fields.ArrayField(
          new fields.StringField({ nullable: false, initial: '' }),
          { required: true, initial: [] }
        ),
        options: new fields.ArrayField(
          new fields.StringField({ nullable: false, initial: '' }),
          { required: true, initial: [] }
        ),
        total: new fields.NumberField({ required: true, initial: 0, integer: true })
      }),
      proficiencyType: new fields.StringField({ required: false, initial: 'ability' }),
      label: new fields.StringField({ required: true, initial: 'New Proficiency Grant' })
    });
  }

  getApplyData(actor: any, data: any) {
    if (!actor) return {};
    const selected: string[] = data?.selected ?? this.keys.base ?? [];
    const count: number = this.keys.total;

    const updates: Record<string, any> = {};

    // Construct grant
    const grantData = {
      proficiencyData: {
        keys: selected,
        total: count,
        proficiencyType: this.proficiencyType
      },
      itemUuid: this.parent.uuid,
      grantId: this._id,
      grantType: this.#type
    };

    updates['system.grants'] = {
      ...actor.system.grants,
      [this._id]: grantData
    };

    // Construct proficiency update
    if (this.proficiencyType === 'ability') {
      selected.forEach((key: string) => {
        updates[`system.abilities.${key}.save.proficient`] = true;
      });
    } else if (this.proficiencyType === 'skill') {
      selected.forEach((key: string) => {
        updates[`system.skills.${key}.proficient`] = true;
      });
    } else {
      return {};
    }

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
      proficiencyType: this.proficiencyType
    };
  }

  requiresConfig(): boolean {
    return (this.keys.base.length + this.keys.options.length) > this.keys.total;
  }

  override async configureGrant() {
    const dialogData = {
      document: this.parent,
      grantId: this._id
    };

    super.configureGrant(
      'Configure Proficiency Grant',
      dialogData,
      this.#configComponent,
      { width: 400 }
    );
  }
}
