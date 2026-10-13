import NumericalGrantConfig from '#view/components/grants/NumericalGrantConfig.svelte';
import { hitDiceBonusContextGrant } from '../../actor/Contexts.ts';
import { BaseGrant } from './BaseGrant.ts';
import { bonusGrantSchema } from './common.ts';

import fields = foundry.data.fields;

// ======================================================
// Schema
// ======================================================
const schema = () => ({
  // Config
  config: new fields.SchemaField({
    bonusType: new fields.StringField({
      required: true,
      nullable: false,
      initial: 'add',
      choices: ['add', 'override', 'modifier'],
    }),
    bonus: new fields.StringField({ required: true, nullable: false, initial: '' }),
    context: new fields.SchemaField(hitDiceBonusContextGrant()),
  }),
  // Applied
  applied: new fields.SchemaField(bonusGrantSchema(), { required: true, nullable: false }),

  // Overrides
  name: new fields.StringField({
    required: true,
    nullable: false,
    initial: 'New Hit Dice Grant',
  }),
  type: new fields.StringField({
    required: true,
    nullable: false,
    blank: false,
    initial: 'hitDice',
  }),
});

// ======================================================
//                      NameSpace
// ======================================================
declare namespace HitDiceGrant {
  type Schema = BaseGrant.Schema & ReturnType<typeof schema>;
}

class HitDiceGrant extends BaseGrant<HitDiceGrant.Schema> {
  #configComponent = NumericalGrantConfig;

  #type = 'hitDice';

  static override type = 'hitDice';

  static override defineSchema(): HitDiceGrant.Schema {
    // @ts-expect-error
    return {
      ...super.defineSchema(),
      ...schema(),
    };
  }

  override getApplyData(actor: Character): any {
    if (!actor) return {};

    const bonusId = foundry.utils.randomID();
    const { default: isDefault, ...context } = this.config.context;
    const bonus = {
      context,
      formula: this.config.bonus,
      bonusType: this.config.bonusType,
      label: this.name || this.item?.name || 'Hit Dice Grant',
      default: isDefault ?? true,
      img: this.img || this?.item?.img,
    };

    const appliedData: typeof this.applied = {
      bonusId,
      bonusType: 'hitDice',
      grantType: 'bonus',
      level: this.level,
      isApplied: true,
    };

    return {
      appliedData: this._getAppliedUpdate(appliedData),
      updateData: {
        [`system.bonuses.hitDice.${bonusId}`]: bonus,
      },
    };
  }

  override getSelectionComponent() {
    return null;
  }

  override getSelectionComponentProps() {
    return null;
  }

  override requiresConfig() {
    return false;
  }

  override async configureGrant() {
    const dialogData = {
      document: this.item,
      grantId: this.id,
      grantType: this.#type,
    };

    super.configureGrant('Configure Hit Dice Grant', dialogData, this.#configComponent, {
      width: 400,
    });
  }
}

export { HitDiceGrant };
