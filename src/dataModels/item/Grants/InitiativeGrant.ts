import BaseGrant from './BaseGrant';

import NumericalGrantConfig from '../../../apps/components/grants/NumericalGrantConfig.svelte';

import { getInitiativeBonusContext } from '../../actor/Contexts';

export default class InitiativeGrant extends BaseGrant {
  #configComponent = NumericalGrantConfig;

  #type = 'initiative';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'initiative' }),
      bonus: new fields.StringField({ required: true, initial: '' }),
      context: new fields.SchemaField(getInitiativeBonusContext()),
      label: new fields.StringField({ required: true, initial: 'New Initiative Grant' })
    });
  }

  getApplyData(actor: any): any {
    if (!actor) return {};

    // Construct bonus
    const bonusId = foundry.utils.randomID();
    const bonus = {
      context: this.context,
      formula: this.bonus,
      label: this.label || this.parent?.name || 'Initiative Grant',
      default: this.default ?? true,
      img: this.img || this?.parent?.img
    };

    const grantData = {
      itemUuid: this.parent.uuid,
      grantId: this._id,
      bonusId,
      type: 'initiative',
      grantType: 'bonus'
    };

    return {
      [`system.bonuses.initiative.${bonusId}`]: bonus,
      'system.grants': {
        ...actor.system.grants,
        [this._id]: grantData
      }
    };
  }

  getSelectionComponent() { return null; }

  getSelectionComponentProps() { return null; }

  requiresConfig() { return false; }

  override async configureGrant() {
    const dialogData = {
      document: this?.parent,
      grantId: this._id,
      grantType: this.#type
    };

    super.configureGrant(
      'Configure Initiative Grant',
      dialogData,
      this.#configComponent,
      { width: 500 }
    );
  }
}
