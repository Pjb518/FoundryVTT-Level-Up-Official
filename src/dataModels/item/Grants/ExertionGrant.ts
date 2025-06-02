import BaseGrant from "./BaseGrant.ts";

import ExertionGrantConfig from "#view/components/grants/ExertionGrantConfig.svelte";

export default class ExertionGrant extends BaseGrant {
  #component = null;

  #configComponent = ExertionGrantConfig;

  #type = "exertion";

  // Schema values
  declare grantType: string;

  declare exertionType: "bonus" | "pool";

  declare bonus: string;

  declare poolType: "none" | "prof" | "doubleProf";

  declare label: string;

  static override defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({
        required: true,
        initial: "exertion",
      }),
      exertionType: new fields.StringField({
        required: true,
        initial: "bonus",
        choices: ["bonus", "pool"],
      }),
      bonus: new fields.StringField({ required: true, initial: "" }),
      poolType: new fields.StringField({
        required: true,
        initial: "none",
        choices: ["none", "prof", "doubleProf"],
      }),
      label: new fields.StringField({
        required: true,
        initial: "New Exertion Grant",
      }),
    });
  }

  override getApplyData(actor: any): any {
    if (!actor) return {};

    const updates: Record<string, any> = {};

    // Construct bonus
    const bonusId = foundry.utils.randomID();

    if (this.exertionType === "bonus") {
      const bonus = {
        formula: this.bonus,
        label: this.label || this.parent?.name || "Exertion Grant",
        img: this.img || this?.parent?.img,
      };

      updates[`system.bonuses.exertion.${bonusId}`] = bonus;
    }

    // Construct grant data
    const grantData = {
      itemUuid: this.parent.uuid,
      grantId: this._id,
      exertionData: {
        exertionType: this.exertionType,
        bonusId: this.exertionType === "bonus" ? bonusId : undefined,
        poolType: this.poolType,
      },
      grantType: this.#type,
      level: this.level,
    };

    updates["system.grants"] = {
      ...actor.system.grants,
      [this._id]: grantData,
    };

    return updates;
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

  override async configureGrant(): Promise<any> {
    const dialogData = {
      document: this?.parent,
      grantId: this._id,
      grantType: this.#type,
    };

    super.configureGrant(
      "Configure Exertion Grant",
      dialogData,
      this.#configComponent,
      {
        width: 400,
      },
    );
  }
}
