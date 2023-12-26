import BaseGrant from './BaseGrant';

import NumericalGrantConfig from '../../../apps/components/grants/NumericalGrantConfig.svelte';

export default class MovementGrant extends BaseGrant {
  #configComponent = NumericalGrantConfig;

  #type = 'movement';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'movement' }),
      movementMode: new fields.StringField({ required: true, initial: 'walk' }),
      ranges: new fields.SchemaField({
        base: new fields.SchemaField({
          distance: new fields.NumberField(
            { required: true, initial: 0, integer: true }
          ),
          unit: new fields.StringField({ required: true, initial: 'feet' })
        }),
        bonus: new fields.SchemaField({
          distance: new fields.NumberField(
            { required: true, initial: 0, integer: true }
          ),
          unit: new fields.StringField({ required: true, initial: 'feet' })
        })
      })
    });
  }

  override async applyGrant(actor: typeof Actor): Promise<void> {
    if (!actor) return;

    const bonusId = foundry.utils.randomID();
    const bonus = {
      context: this.context,
      formula: this.bonus,
      label: this.label ?? this.parent?.name ?? 'Movement Grant',
      default: this.default ?? true,
      img: this.img ?? this?.parent?.img
    };

    const grantData = {
      itemUuid: this.parent.uuid,
      grantId: this._id,
      bonusId,
      type: 'movement'
    };

    await actor.update({
      [`system.bonuses.movement.${bonusId}`]: bonus,
      'system.grants': {
        ...actor.system.grants,
        [foundry.utils.randomID()]: grantData
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
      'Configure Movement Grant',
      dialogData,
      this.#configComponent,
      { width: 400 }
    );
  }
}
