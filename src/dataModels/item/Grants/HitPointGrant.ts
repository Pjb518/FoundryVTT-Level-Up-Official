import BaseGrant from './BaseGrant';

import NumericalGrantConfig from '../../../apps/components/grants/NumericalGrantConfig.svelte';

import { getHitPointsBonusContext } from '../../actor/Contexts';

export default class HitPointGrant extends BaseGrant {
  #configComponent = NumericalGrantConfig;

  #type = 'hitPoint';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'hitPoint' }),
      bonus: new fields.StringField({ required: true, initial: '' }),
      context: new fields.SchemaField(getHitPointsBonusContext()),
      label: new fields.StringField({ required: true, initial: 'New Hit Point Grant' })
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getApplyData(actor: any, _data: any = {}) {
    if (!actor) return {};

    const bonusId = foundry.utils.randomID();
    const bonus = {
      context: { ...this.context },
      formula: this.bonus,
      label: this.label || this.parent?.name || 'HitPoint Grant',
      img: this.img || this?.parent?.img
    };

    const grantData = {
      itemUuid: this.parent.uuid,
      grantId: this._id,
      bonusId,
      type: this.#type,
      grantType: 'bonus',
      level: this.level
    };

    return {
      [`system.bonuses.hitPoint.${bonusId}`]: bonus,
      'system.grants': {
        ...actor.system.grants,
        [this._id]: grantData
      }
    };
  }

  getSelectionComponent() {
    return null;
  }

  getSelectionComponentProps() {
    return {};
  }

  requiresConfig(): boolean {
    return false;
  }

  override async configureGrant(): Promise<any> {
    const dialogData = {
      document: this?.parent,
      grantId: this._id,
      grantType: this.#type
    };

    super.configureGrant(
      'Configure Hit Points Grant',
      dialogData,
      this.#configComponent,
      { width: 400 }
    );
  }
}
