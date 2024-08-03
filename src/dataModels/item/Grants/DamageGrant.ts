import BaseGrant from './BaseGrant';

import NumericalGrantConfig from '../../../apps/components/grants/NumericalGrantConfig.svelte';

import { getDamageBonusContext } from '../../actor/Contexts';

export default class DamageGrant extends BaseGrant {
  #configComponent = NumericalGrantConfig;

  #type = 'damage';

  static override defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'damage' }),
      bonus: new fields.StringField({ required: true, initial: '' }),
      damageType: new fields.StringField({ required: true, initial: '' }),
      context: new fields.SchemaField(getDamageBonusContext('grant')),
      label: new fields.StringField({ required: true, initial: 'New Damage Grant' })
    });
  }

  override getApplyData(actor: any): any {
    if (!actor) return {};

    const bonusId = foundry.utils.randomID();
    const bonus = {
      context: this.context,
      formula: this.bonus,
      label: this.label || this.parent?.name || 'Damage Grant',
      default: this.context.default ?? true,
      img: this.img || this?.parent?.img
    };

    delete bonus.context.default;

    const grantData = {
      itemUuid: this.parent.uuid,
      grantId: this._id,
      bonusId,
      type: 'damage',
      grantType: 'bonus',
      level: this.level
    };

    return {
      [`system.bonuses.damage.${bonusId}`]: bonus,
      'system.grants': {
        ...actor.system.grants,
        [this._id]: grantData
      }
    };
  }

  override getSelectionComponent() { return null; }

  override getSelectionComponentProps() { return null; }

  override requiresConfig() { return false; }

  override async configureGrant() {
    const dialogData = {
      document: this.parent,
      grantId: this._id,
      grantType: this.#type
    };

    super.configureGrant(
      'Configure Damage Grant',
      dialogData,
      this.#configComponent,
      { width: 500 }
    );
  }
}
