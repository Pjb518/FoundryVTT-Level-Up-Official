import BaseGrant from "./BaseGrant.ts";

import NumericalGrantConfig from "#view/components/grants/NumericalGrantConfig.svelte";
import NumericalGrantSelectionDialog from "#view/components/grants/NumericalGrantSelectionDialog.svelte";

import { getSkillBonusContext } from "../../actor/Contexts.ts";

export default class SkillGrant extends BaseGrant {
  #component = NumericalGrantSelectionDialog;

  #configComponent = NumericalGrantConfig;

  #type = "skill";

  static override defineSchema() {
    const { fields } = foundry.data;

    return this.mergeSchema(super.defineSchema(), {
      grantType: new fields.StringField({ required: true, initial: "skill" }),
      skills: new fields.SchemaField({
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
      context: new fields.SchemaField(getSkillBonusContext("grant")),
      label: new fields.StringField({
        required: true,
        initial: "New Skill Grant",
      }),
    });
  }

  override getApplyData(actor: typeof Actor, data: any = {}): any {
    if (!actor) return {};
    const selected = data?.selected ?? this.skills.base ?? [];

    // Construct bonus
    const bonusId = foundry.utils.randomID();
    const bonus = {
      context: {
        skills: selected,
        ...this.context,
      },
      formula: this.bonus,
      label: this.label || this.parent?.name || "Skill Grant",
      default: this.context.default ?? true,
      img: this.img || this?.parent?.img,
    };

    delete bonus.context.default;

    const grantData = {
      itemUuid: this.parent.uuid,
      grantId: this._id,
      bonusId,
      type: "skills",
      grantType: "bonus",
      level: this.level,
    };

    return {
      [`system.bonuses.skills.${bonusId}`]: bonus,
      "system.grants": {
        ...actor.system.grants,
        [this._id]: grantData,
      },
    };
  }

  override getSelectionComponent() {
    return this.#component;
  }

  override getSelectionComponentProps(data: any) {
    return {
      base: this.skills.base,
      bonus: this.bonus,
      choices: this.skills.options,
      configObject: CONFIG.A5E.skills,
      count: this.skills.total,
      heading: "Skill Grant Selection",
      selected: data?.selected ?? [],
    };
  }

  override requiresConfig() {
    return this.skills.options.length;
  }

  override async configureGrant() {
    const dialogData = {
      document: this.parent,
      grantId: this._id,
      grantType: "skills",
    };

    super.configureGrant(
      "Configure Skill Grant",
      dialogData,
      this.#configComponent,
      {
        width: 400,
      },
    );
  }
}
