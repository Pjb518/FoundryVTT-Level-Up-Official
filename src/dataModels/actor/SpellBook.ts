import type { SpellBookStats } from "types/spellBook";
import type { BaseActorA5e } from "../../documents/actor/base";
import type SpellItemA5e from "../../documents/item/spell";

import { getDeterministicBonus } from "../../dice/getDeterministicBonus";

const { fields } = foundry.data;

const spellBookSchema = () => ({
  name: new fields.StringField({
    required: true,
    nullable: false,
    initial: "New Spell Book",
  }),
  img: new fields.StringField({
    required: true,
    initial: "icons/svg/book.svg",
  }),

  ability: new fields.StringField({ required: true, initial: "default" }),
  disableSpellConsumers: new fields.BooleanField({
    required: true,
    nullable: false,
    initial: false,
  }),
  showArtifactCharges: new fields.BooleanField({
    required: true,
    nullable: false,
    initial: false,
  }),
  showSpellInventions: new fields.BooleanField({
    required: true,
    nullable: false,
    initial: false,
  }),
  showSpellPoints: new fields.BooleanField({
    required: true,
    nullable: false,
    initial: false,
  }),
  showSpellSlots: new fields.BooleanField({
    required: true,
    nullable: false,
    initial: true,
  }),
});

export default class SpellBook extends foundry.abstract.DataModel<
  DataSchema & ReturnType<typeof spellBookSchema>,
  Actor.ConfiguredInstance
> {
  declare _id: string;

  declare slug: string;

  declare stats: SpellBookStats;

  spells: Collection<any> = new foundry.utils.Collection();

  constructor(data: any, options: any = {}) {
    // @ts-ignore
    super(data, options);
  }

  static override defineSchema() {
    return {
      ...spellBookSchema(),
    };
  }

  // ======================================
  // Getters
  // ======================================

  get spellIds(): string[] {
    return this.spells.map((spell: SpellItemA5e) => spell.id!);
  }

  // ======================================
  // Data Preparation
  // ======================================
  prepareBaseData(): void {
    const actor = this.parent as BaseActorA5e;
    this.spells = new foundry.utils.Collection();
    if (!actor) return;

    for (const item of actor.items) {
      if (!item.isType("spell")) continue;

      if (item.system.spellBook !== this._id) continue;
      this.spells.set(item.id || "", item);
    }

    this.slug = `spellbook-${this.name}`.slugify({ strict: true });
    this.prepareSpellBookStats();
  }

  prepareSpellBookStats(): void {
    const actor = this.parent as BaseActorA5e;
    if (!actor) return;

    let { ability } = this;

    if (this.ability === "default")
      ability = actor.system.attributes.spellcasting;
    if (!ability) ability = "int";

    const spellDC =
      getDeterministicBonus(
        [
          8,
          // @ts-expect-error
          actor.system.attributes.prof,
          actor.system.bonuses.spellDC || 0,
          actor.system.abilities[ability].check.mod,
        ].join(" + "),
        actor.getRollData(),
      ) || 10;

    const { abilities } = actor.system;
    const spellMod = abilities[ability].check.mod;

    const stats = {
      ability: this.ability,
      dc: spellDC,
      mod: spellMod,
    };

    this.stats = stats;
  }

  // ======================================
  // API Methods
  // ======================================
  addSpell(item: SpellItemA5e) {
    const actor = this.parent;
    if (!actor) return;

    const spell = this.#updateSpellData(item);
    if (!spell) return;
    actor.createEmbeddedDocuments("Item", [spell]);
  }

  addSpells(items: SpellItemA5e[]) {
    const actor = this.parent;
    if (!actor) return;

    const spells = items.map((item) => this.#updateSpellData(item));
    actor.createEmbeddedDocuments("Item", spells);
  }

  #updateSpellData(item: SpellItemA5e): any {
    const actor = this.parent;
    if (!actor) return null;

    const spell = item.toObject();
    spell.system.spellBook = this._id;

    return spell;
  }

  async delete() {
    const { spellIds } = this;
    await this.parent.deleteEmbeddedDocuments("Item", spellIds);

    const id = this._id;

    this.parent.update({
      [`system.spellBooks.-=${id}`]: null,
    });
  }
}
