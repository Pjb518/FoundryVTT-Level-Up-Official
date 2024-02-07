import BaseGrant from './BaseGrant';

import NumericalGrantConfig from '../../../apps/components/grants/NumericalGrantConfig.svelte';
import NumericalGrantSelectionDialog from '../../../apps/components/grants/NumericalGrantSelectionDialog.svelte';

import { getSensesBonusContext } from '../../actor/Contexts';

export default class SensesGrant extends BaseGrant {
  #component = NumericalGrantSelectionDialog;

  #configComponent = NumericalGrantConfig;

  #type = 'senses';

  static defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'senses' }),
      senses: new fields.SchemaField({
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
      unit: new fields.StringField({ required: true, initial: 'feet' }),
      context: new fields.SchemaField(getSensesBonusContext('grant')),
      label: new fields.StringField({ required: true, initial: 'New Senses Grant' })
    });
  }

  getApplyData(actor: any, data: any) {
    if (!actor) return {};

    const bonusId = foundry.utils.randomID();
    const bonus = {
      context: {
        senses: data?.selected ?? this.senses.base ?? [],
        ...this.context
      },
      formula: this.bonus,
      unit: this.unit || 'feet',
      label: this.label || this.parent?.name || 'Senses Grant',
      img: this.img || this?.parent?.img
    };

    const grantData = {
      itemUuid: this.parent.uuid,
      grantId: this._id,
      bonusId,
      type: this.#type,
      grantType: 'bonus'
    };

    return {
      [`system.bonuses.senses.${bonusId}`]: bonus,
      'system.grants': {
        ...actor.system.grants,
        [this._id]: grantData
      }
    };
  }

  getSelectionComponent() {
    return this.#component;
  }

  getSelectionComponentProps(data: Record<string, any>) {
    return {
      base: data?.selected ?? this.senses.base ?? [],
      bonus: this.bonus,
      choices: this.senses.options ?? [],
      configObject: CONFIG.A5E.senses,
      count: this.senses.total,
      unit: this.unit,
      heading: 'Senses Grant Selection'
    };
  }

  requiresConfig() {
    return (this.senses.base.length + this.senses.options.length) > this.senses.total;
  }

  override async configureGrant() {
    const dialogData = {
      document: this?.parent,
      grantId: this._id,
      grantType: 'senses'
    };

    super.configureGrant(
      'Configure Senses Grant',
      dialogData,
      this.#configComponent,
      { width: 400 }
    );
  }
}
