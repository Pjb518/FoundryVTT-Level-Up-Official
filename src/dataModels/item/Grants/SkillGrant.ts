import BaseGrant from './BaseGrant';

import NumericalGrantConfig from '../../../apps/components/grants/NumericalGrantConfig.svelte';
import NumericalGrantSelectionDialog from '../../../apps/components/grants/NumericalGrantSelectionDialog.svelte';

import { getSkillBonusContext } from '../../actor/Contexts';

export default class SkillGrant extends BaseGrant {
  #component = NumericalGrantSelectionDialog;

  #configComponent = NumericalGrantConfig;

  #type = 'skill';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'skill' }),
      skills: new fields.SchemaField({
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
      bonus: new fields.StringField({ required: true, initial: '' }),
      context: new fields.SchemaField(getSkillBonusContext('grant')),
      default: new fields.BooleanField({ required: true, initial: true })
    });
  }

  override async applyGrant(actor: typeof Actor): Promise<void> {
    if (!actor) return;

    const dialogData = {
      base: this.skills.base,
      bonus: this.bonus,
      choices: this.skills.options,
      configObject: CONFIG.A5E.skills,
      count: this.skills.total,
      heading: 'Skill Grant Selection'
    };

    const promise = await super.applyGrant('Skill Grant Selection', dialogData, this.#component, { width: 400 });
    if (!promise.selected) {
      throw new Error('No skill selected');
    }

    // Construct bonus
    const bonus = {
      context: {
        skills: promise.selected,
        ...this.context
      },
      formula: this.bonus,
      label: this.label || this.parent?.name || 'Skill Grant',
      default: this.default ?? true,
      img: this.img || this?.parent?.img
    };

    const bonusId = foundry.utils.randomID();
    const grantData = {
      itemUuid: this.parent.uuid,
      grantId: this._id,
      bonusId,
      type: 'skills'
    };

    await actor.update({
      [`system.bonuses.skills.${bonusId}`]: bonus,
      'system.grants': {
        ...actor.system.grants,
        [this._id]: grantData
      }
    });
  }

  override async configureGrant() {
    const dialogData = {
      document: this.parent,
      grantId: this._id,
      grantType: 'skills'
    };

    super.configureGrant('Configure Skill Grant', dialogData, this.#configComponent, { width: 400 });
  }
}
