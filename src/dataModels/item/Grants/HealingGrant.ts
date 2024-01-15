import BaseGrant from './BaseGrant';

import NumericalGrantConfig from '../../../apps/components/grants/NumericalGrantConfig.svelte';

import { getHealingBonusContext } from '../../actor/Contexts';

export default class HealingGrant extends BaseGrant {
  #configComponent = NumericalGrantConfig;

  #type = 'healing';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'healing' }),
      bonus: new fields.StringField({ required: true, initial: '' }),
      context: new fields.SchemaField(getHealingBonusContext()),
      healingType: new fields.StringField({ required: true, initial: 'healing' }),
      label: new fields.StringField({ required: true, initial: 'New Healing Grant' })
    });
  }

  override async applyGrant(actor: typeof Actor): Promise<void> {
    if (!actor) return;

    const bonusId = foundry.utils.randomID();
    const bonus = {
      context: this.context,
      formula: this.bonus,
      label: this.label || this.parent?.name || 'Healing Grant',
      default: this.default ?? true,
      img: this.img || this?.parent?.img
    };

    const grantData = {
      itemUuid: this.parent.uuid,
      grantId: this._id,
      bonusId,
      type: 'healing'
    };

    await actor.update({
      [`system.bonuses.healing.${bonusId}`]: bonus,
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
      grantType: this.#type
    };

    super.configureGrant(
      'Configure Healing Grant',
      dialogData,
      this.#configComponent,
      { width: 400 }
    );
  }
}
