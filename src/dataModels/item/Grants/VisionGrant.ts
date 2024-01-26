import BaseGrant from './BaseGrant';

import NumericalGrantConfig from '../../../apps/components/grants/NumericalGrantConfig.svelte';

export default class VisionGrant extends BaseGrant {
  #configComponent = NumericalGrantConfig;

  #type = 'vision';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'vision' }),
      visionMode: new fields.StringField({ required: true, initial: 'darkvision' }),
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
      label: this.label ?? this.parent?.name ?? 'Vision Grant',
      default: this.default ?? true,
      img: this.img ?? this?.parent?.img
    };

    const grantData = {
      itemUuid: this.parent.uuid,
      grantId: this._id,
      bonusId,
      type: 'vision'
    };

    await actor.update({
      [`system.bonuses.vision.${bonusId}`]: bonus,
      'system.grants': {
        ...actor.system.grants,
        [foundry.utils.randomID()]: grantData
      }
    });
  }
}
