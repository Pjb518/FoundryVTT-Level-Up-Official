import BaseGrant from "./BaseGrant.ts";

import NumericalGrantConfig from "#view/components/grants/NumericalGrantConfig.svelte";
import NumericalGrantSelectionDialog from "#view/components/grants/NumericalGrantSelectionDialog.svelte";

import { getMovementBonusContext } from "../../actor/Contexts.ts";

export default class MovementGrant extends BaseGrant {
  #component = NumericalGrantSelectionDialog;

  #configComponent = NumericalGrantConfig;

  #type = "movement";

  static override defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({
        required: true,
        initial: "movement",
      }),
      movementTypes: new fields.SchemaField({
        base: new fields.ArrayField(
          new fields.StringField({ required: true, initial: "" }),
          {
            required: true,
            initial: [],
          },
        ),
        options: new fields.ArrayField(
          new fields.StringField({ required: true, initial: "" }),
          {
            required: true,
            initial: [],
          },
        ),
        total: new fields.NumberField({
          required: true,
          initial: 0,
          integer: true,
        }),
      }),
      bonus: new fields.StringField({ required: true, initial: "" }),
      unit: new fields.StringField({ required: true, initial: "feet" }),
      context: new fields.SchemaField(getMovementBonusContext("grant")),
      label: new fields.StringField({
        required: true,
        initial: "New Movement Grant",
      }),
    });
  }

  override getApplyData(actor: any, data: any) {
    if (!actor) return {};

    const bonusId = foundry.utils.randomID();
    const bonus = {
      context: {
        movementTypes: data?.selected ?? this.movementTypes.base ?? [],
        ...this.context,
      },
      formula: this.bonus,
      unit: this.unit || "feet",
      label: this.label || this.parent?.name || "Movement Grant",
      img: this.img || this?.parent?.img,
    };

    const grantData = {
      itemUuid: this.parent.uuid,
      grantId: this._id,
      bonusId,
      type: this.#type,
      grantType: "bonus",
      level: this.level,
    };

    return {
      [`system.bonuses.movement.${bonusId}`]: bonus,
      "system.grants": {
        ...actor.system.grants,
        [this._id]: grantData,
      },
    };
  }

  override getSelectionComponent() {
    return this.#component;
  }

  override getSelectionComponentProps(data: Record<string, any>) {
    return {
      base: this.movementTypes.base ?? [],
      bonus: this.bonus,
      choices: this.movementTypes.options ?? [],
      configObject: CONFIG.A5E.movementAbbreviations,
      count: this.movementTypes.total,
      unit: this.unit,
      heading: "Movement Grant Selection",
      selected: data?.selected ?? [],
    };
  }

  override requiresConfig() {
    return this.movementTypes.options.length;
  }

  override async configureGrant() {
    const dialogData = {
      document: this?.parent,
      grantId: this._id,
      grantType: "movement",
    };

    super.configureGrant(
      "Configure Movement Grant",
      dialogData,
      this.#configComponent,
      {
        width: 400,
      },
    );
  }
}
