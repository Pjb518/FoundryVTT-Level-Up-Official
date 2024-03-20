import A5EDataModel from '../A5EDataModel';

import getDeterministicBonus from '../../dice/getDeterministicBonus';

export default class SpellBook extends A5EDataModel {
  spells: Collection<any> = new foundry.utils.Collection();

  stats: Record<string, any> = {};

  constructor(data: any, options: any = {}) {
    // @ts-ignore
    super(data, options);
  }

  static defineSchema() {
    const { fields } = foundry.data;

    return {
      _id: new fields.DocumentIdField({ initial: () => foundry.utils.randomID() }),
      name: new fields.StringField({ required: true, initial: 'New Spell Book' }),

      ability: new fields.StringField({ required: true, initial: 'int' }),
      casterType: new fields.StringField({ required: true, initial: 'full' }),
      preparedType: new fields.StringField({ required: true, initial: 'prepared' })
    };
  }

  // ======================================
  // Getters
  // ======================================
  get arePactSlots(): boolean {
    return this.preparedType === 'pact';
  }

  get arePoints(): boolean {
    return this.preparedType === 'points';
  }

  get isInnate(): boolean {
    return this.preparedType === 'innate';
  }

  get isPrepared(): boolean {
    return this.preparedType === 'prepared';
  }

  get isRitual(): boolean {
    return this.preparedType === 'ritual';
  }

  get spellIds(): string[] {
    return this.spells.map((spell: typeof Item) => spell.id);
  }

  get progressionDivisor(): number {
    if (this.casterType === 'full') return 1;
    if (this.casterType === 'half') return 2;
    if (this.casterType === 'third') return 3;
    if (this.casterType === 'quarter') return 4;

    return 0;
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

    this.slug = `${this.name}-spellcasting`.slugify();
    this.prepareSpellBookStats();
  }

  prepareSpellBookStats(): void {
    const actor = this.parent;
    if (!actor) return;

    const spellDC = getDeterministicBonus([
      8,
      actor.system.attributes.prof,
      actor.system.bonuses.spellDc || 0,
      actor.system.abilities[this.ability || 'int'].check.mod
    ].join(' + '), actor.getRollData()) || 10;

    const stats = {
      ability: this.ability,
      casterType: this.casterType,
      dc: spellDC,
      progressionDivisor: this.progressionDivisor
    };

    this.stats = stats;
  }

  // ======================================
  // API Methods
  // ======================================
  async delete() {
    const { spellIds } = this;
    await this.parent.deleteEmbeddedDocuments('Item', spellIds);

    const id = this._id;

    this.parent.update({
      [`system.spellBooks.-=${id}`]: null
    });
  }
}
