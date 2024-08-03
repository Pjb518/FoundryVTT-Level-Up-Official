import BaseGrant from './BaseGrant';

import NumericalGrantConfig from '../../../apps/components/grants/NumericalGrantConfig.svelte';
import NumericalGrantSelectionDialog from '../../../apps/components/grants/NumericalGrantSelectionDialog.svelte';

import { getAttackBonusContext } from '../../actor/Contexts';

export default class AttackGrant extends BaseGrant {
  #component = NumericalGrantSelectionDialog;

  #configComponent = NumericalGrantConfig;

  #type = 'attack';

  static override defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: 'attack' }),
      attackTypes: new fields.SchemaField({
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
      context: new fields.SchemaField(getAttackBonusContext('grant')),
      label: new fields.StringField({ required: true, initial: 'New Attack Grant' })
    });
  }

  override getApplyData(actor: any, data: any) {
    if (!actor) return {};

    const selected = data?.selected ?? this.attackTypes.base ?? [];

    // Construct bonus
    const bonusId = foundry.utils.randomID();
    const bonus = {
      context: {
        attackTypes: selected,
        ...this.context
      },
      formula: this.bonus,
      label: this.label || this.parent?.name || 'Attack Grant',
      default: this.context.default ?? true,
      img: this.img || this?.parent?.img
    };

    delete bonus.context.default;

    const grantData = {
      itemUuid: this.parent.uuid,
      grantId: this._id,
      bonusId,
      type: 'attacks',
      grantType: 'bonus',
      level: this.level
    };

    return {
      [`system.bonuses.attacks.${bonusId}`]: bonus,
      'system.grants': {
        ...actor.system.grants,
        [this._id]: grantData
      }
    };
  }

  override getSelectionComponent() {
    return this.#component;
  }

  override getSelectionComponentProps(data: any) {
    return {
      base: this.attackTypes.base ?? [],
      bonus: this.bonus,
      choices: this.attackTypes.options,
      configObject: CONFIG.A5E.attackTypes,
      count: this.attackTypes.total,
      heading: 'Attack Grant Selection',
      selected: data?.selected ?? []
    };
  }

  override requiresConfig(): boolean {
    return this.attackTypes.options.length;
  }

  override async configureGrant() {
    const dialogData = {
      document: this?.parent,
      grantId: this._id,
      grantType: 'attacks'
    };

    super.configureGrant(
      'Configure Attack Grant',
      dialogData,
      this.#configComponent,
      { width: 400 }
    );
  }
}
