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
  #configcomponent = numericalgrantconfig;

  #type = 'hitdice';

  static override type = 'hitdice';

  static override defineschema(): hitdicegrant.schema {
    // @ts-expect-error
    return {
      ...super.defineschema(),
      ...schema(),
    };
  }

  override getapplydata(actor: character): any {
    if (!actor) return {};

    const bonusid = foundry.utils.randomid();
    const { default: isdefault, ...context } = this.config.context;
    const bonus = {
      context,
      formula: this.config.bonus,
      bonustype: this.config.bonustype,
      label: this.name || this.item?.name || 'hit dice grant',
      default: isdefault ?? true,
      img: this.img || this?.item?.img,
    };

    const applieddata: typeof this.applied = {
      bonusid,
      bonustype: 'hitdice',
      granttype: 'bonus',
      level: this.level,
      isapplied: true,
    };

    return {
      applieddata: this._getappliedupdate(applieddata),
      updatedata: {
              [`system.bonuses.hitdice.${bonusid}`]: bonus,
      },
    };
  }

  override getselectioncomponent() {
    return null;
  }

  override getselectioncomponentprops() {
    return null;
  }

  override requiresconfig() {
    return false;
  }

  override async configuregrant() {
    const dialogdata = {
      document: this.item,
      grantid: this.id,
      granttype: this.#type,
      };

      super.configuregrant('configure hit dice grant', dialogdata, this.#configcomponent, {
        width: 400,
        });
  }
}

export { HitDiceGrant };
