import BaseGrant from "./BaseGrant.ts";

import NumericalGrantConfig from "#view/components/grants/NumericalGrantConfig.svelte";

import { getHealingBonusContext } from "../../actor/Contexts.ts";

export default class HealingGrant extends BaseGrant {
  #configComponent = NumericalGrantConfig;

  #type = "healing";

  static override defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: "healing" }),
      bonus: new fields.StringField({ required: true, initial: "" }),
      context: new fields.SchemaField(getHealingBonusContext("grant")),
      healingType: new fields.StringField({
        required: true,
        initial: "healing",
      }),
      label: new fields.StringField({
        required: true,
        initial: "New Healing Grant",
      }),
    });
  }

  override getApplyData(actor: typeof Actor): any {
    if (!actor) return {};

    const bonusId = foundry.utils.randomID();
    const bonus = {
      context: this.context,
      formula: this.bonus,
      label: this.label || this.parent?.name || "Healing Grant",
      default: this.context.default ?? true,
      img: this.img || this?.parent?.img,
    };

    delete bonus.context.default;

    const grantData = {
      itemUuid: this.parent.uuid,
      grantId: this._id,
      bonusId,
      type: "healing",
      grantType: "bonus",
      level: this.level,
    };

    return {
      [`system.bonuses.healing.${bonusId}`]: bonus,
      "system.grants": {
        ...actor.system.grants,
        [this._id]: grantData,
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
      document: this.parent,
      grantId: this._id,
      grantType: this.#type,
    };

    super.configureGrant(
      "Configure Healing Grant",
      dialogData,
      this.#configComponent,
      {
        width: 400,
      },
    );
  }
}
