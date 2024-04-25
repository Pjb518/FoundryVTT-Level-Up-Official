import BaseGrant from './BaseGrant';

import SkillSpecialtyConfig from '../../../apps/components/grants/SkillSpecialtyConfig.svelte';
import SkillSpecialtyGrantSelectionDialog from '../../../apps/components/grants/SkillSpecialtyGrantSelectionDialog.svelte';

export default class SkillSpecialtyGrant extends BaseGrant {
  #component = SkillSpecialtyGrantSelectionDialog;

  #configComponent = SkillSpecialtyConfig;

  #type = 'skillSpecialty';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'skillSpecialty' }),
      skill: new fields.StringField({ required: true, initial: 'acr' }),
      specialties: new fields.SchemaField({
        base: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        ),
        options: new fields.ArrayField(
          new fields.StringField({ required: true, initial: '' }),
          { required: true, initial: [] }
        ),
        total: new fields.NumberField({ required: true, initial: 0, integer: true })
      }),
      label: new fields.StringField({ required: true, initial: 'New Skill Specialty Grant' })
    });
  }

  getApplyData(actor: any, data: any) {
    if (!actor) return {};
    const selected: string[] = data?.selected ?? this.specialties.base ?? [];
    const skill: string = data?.skill ?? this.skill ?? 'acr';
    const count: number = this.specialties.total;

    if (!skill) return {};

    // Construct grant
    const grantData = {
      specialtyData: {
        specialties: selected,
        skill,
        total: count
      },
      itemUuid: this.parent.uuid,
      grantId: this._id,
      grantType: this.#type,
      level: this.level
    };

    // Construct specialty update
    const key = `system.skills.${skill}.specialties`;
    const existing = foundry.utils.getProperty(actor, key) as string[] ?? [];
    const specialties = new Set([
      ...selected,
      ...existing
    ]);

    return {
      [key]: [...specialties],
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
      base: data?.selected ?? this.specialties.base ?? [],
      choices: this.specialties.options,
      count: this.specialties.total,
      skill: this.skill
    };
  }

  requiresConfig(): boolean {
    return this.specialties.options.length;
  }

  override async configureGrant(): Promise<any> {
    const dialogData = {
      document: this.parent,
      grantId: this._id,
      grantType: this.#type
    };

    super.configureGrant(
      'Configure Skill Specialty Grant',
      dialogData,
      this.#configComponent,
      { width: 400 }
    );
  }
}
