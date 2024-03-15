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

    const slotData: Record<string, any> = {};
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((level) => {
      slotData[level] = new fields.SchemaField({
        current: new fields.NumberField({
          required: true, integer: true, min: 0, initial: 0
        }),
        max: new fields.NumberField({
          required: true, integer: true, min: 0, initial: 0
        })
      });
    });

    return {
      _id: new fields.DocumentIdField({ initial: () => foundry.utils.randomID() }),
      name: new fields.StringField({ required: true, initial: 'New Spell Book' }),

      ability: new fields.StringField({ required: true, initial: 'int' }),
      casterType: new fields.StringField({ required: true, initial: 'full' }),
      preparedType: new fields.StringField({ required: true, initial: 'prepared' }),
      spellIds: new fields.ArrayField(
        new fields.StringField({ required: true, initial: '' }),
        { required: true, initial: [] }
      )
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

    for (const id of this.spellIds) {
      try {
        const spell = actor.items.get(id);
        if (spell) this.spells.set(spell.id, spell);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`Failed to load spell with id ${id}`);
      }
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
  addSpell(spell: typeof Item) {
    if (spell.type !== 'spell') {
      ui.notifications.error('You can only add spells to a spell book');
    }

    // TODO: Add logic to add a uses consumer for innate spells.

    this.spellIds.push(spell.id);
    this.update({ spellIds: this.spellIds });
  }

  addSpells(spells: typeof Item[]) {
    const newIds = spells.reduce((acc: string[], spell: typeof Item) => {
      if (spell.type !== 'spell') return acc;
      acc.push(spell.id);
      return acc;
    }, []);

    const spellIds = [...this.spellIds, ...newIds];
    this.update({ spellIds });
  }

  removeSpell(spell: typeof Item) {
    const spellIds = this.spellIds.filter((id: string) => id !== spell.id);
    this.update({ spellIds });
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
