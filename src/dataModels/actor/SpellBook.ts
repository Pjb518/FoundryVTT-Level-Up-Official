import type { SpellBookStats } from 'types/spellBook';
import A5EDataModel from '../A5EDataModel';

import getDeterministicBonus from '../../dice/getDeterministicBonus';

export default class SpellBook extends A5EDataModel {
  declare _id: string;

  declare name: string;

  declare img: string;

  declare ability: string;

  declare disableSpellConsumers: boolean;

  declare showArtifactCharges: boolean;

  declare showSpellInventions: boolean;

  declare showSpellPoints: boolean;

  declare showSpellSlots: boolean;

  declare slug: string;

  declare stats: SpellBookStats;

  spells: Collection<any> = new foundry.utils.Collection();

  constructor(data: any, options: any = {}) {
    // @ts-ignore
    super(data, options);
  }

  static defineSchema() {
    const { fields } = foundry.data;

    return {
      name: new fields.StringField({ required: true, initial: 'New Spell Book' }),
      img: new fields.StringField({ required: true, initial: 'icons/svg/book.svg' }),

      ability: new fields.StringField({ required: true, initial: 'default' }),
      disableSpellConsumers: new fields.BooleanField({ required: true, initial: false }),
      showArtifactCharges: new fields.BooleanField({ required: true, initial: false }),
      showSpellInventions: new fields.BooleanField({ required: true, initial: false }),
      showSpellPoints: new fields.BooleanField({ required: true, initial: false }),
      showSpellSlots: new fields.BooleanField({ required: true, initial: true })
    };
  }

  // ======================================
  // Getters
  // ======================================

  get spellIds(): string[] {
    return this.spells.map((spell: typeof Item) => spell.id);
  }

  // ======================================
  // Data Preparation
  // ======================================
  prepareBaseData(): void {
    super.prepareBaseData();
    const actor = this.parent;
    this.spells = new foundry.utils.Collection();
    if (!actor) return;

    for (const item of actor.items) {
      if (item.type !== 'spell') continue;

      if (item.system.spellBook !== this._id) continue;
      this.spells.set(item.id, item);
    }

    this.slug = `spellbook-${this.name}`.slugify();
    this.prepareSpellBookStats();
  }

  prepareSpellBookStats(): void {
    const actor = this.parent;
    if (!actor) return;

    let { ability } = this;

    if (this.ability === 'default') ability = actor.system.attributes.spellcasting;
    if (!ability) ability = 'int';

    const spellDC = getDeterministicBonus([
      8,
      actor.system.attributes.prof,
      actor.system.bonuses.spellDC || 0,
      actor.system.abilities[ability].check.mod
    ].join(' + '), actor.getRollData()) || 10;

    const { abilities } = actor.system;
    const spellMod = abilities[ability].check.mod;

    const stats = {
      ability: this.ability,
      dc: spellDC,
      mod: spellMod
    };

    this.stats = stats;
  }

  // ======================================
  // API Methods
  // ======================================
  addSpell(item: typeof Item) {
    const actor = this.parent;
    if (!actor) return;

    const spell = this.#updateSpellData(item);
    if (!spell) return;
    actor.createEmbeddedDocuments('Item', [spell]);
  }

  addSpells(items: typeof Item[]) {
    const actor = this.parent;
    if (!actor) return;

    const spells = items.map((item) => this.#updateSpellData(item));
    actor.createEmbeddedDocuments('Item', spells);
  }

  #updateSpellData(item: typeof Item): any {
    const actor = this.parent;
    if (!actor) return null;

    const spell = item.toObject();
    spell.system.spellBook = this._id;

    return spell;
  }

  async delete() {
    const { spellIds } = this;
    await this.parent.deleteEmbeddedDocuments('Item', spellIds);

    const id = this._id;

    this.parent.update({
      [`system.spellBooks.-=${id}`]: null
    });
  }
}
