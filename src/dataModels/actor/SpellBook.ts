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
    console.error('Here');
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
      spellResources: new fields.SchemaField({
        slots: new fields.SchemaField(slotData),
        innate: new fields.SchemaField({
          current: new fields.NumberField({
            required: true, integer: true, min: 0, initial: 0
          }),
          max: new fields.NumberField({
            required: true, integer: true, min: 0, initial: 0
          })
        }),
        pact: new fields.SchemaField({
          current: new fields.NumberField({
            required: true, integer: true, min: 0, initial: 0
          }),
          max: new fields.NumberField({
            required: true, integer: true, min: 0, initial: 0
          })
        }),
        points: new fields.SchemaField({
          current: new fields.NumberField({
            required: true, integer: true, min: 0, initial: 0
          }),
          max: new fields.NumberField({
            required: true, integer: true, min: 0, initial: 0
          })
        })
      }),
      spellIds: new fields.ArrayField(
        new fields.StringField({ required: true, initial: '' }),
        { required: true, initial: [] }
      )
    };
  }

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

  get progressionDivisor(): number {
    if (this.casterType === 'full') return 1;
    if (this.casterType === 'half') return 2;
    if (this.casterType === 'third') return 3;
    if (this.casterType === 'quarter') return 4;

    return 0;
  }

  get spellResourceData(): any {
    if (this.arePactSlots) return this.spellResources.pact;
    if (this.arePoints) return this.spellResources.points;
    if (this.isInnate) return this.spellResources.innate;

    // Return slots based on progression
    return this.spellResources.slots;
  }

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
    this.prepareRollStats();
  }

  prepareRollStats(): void {
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
      progressionDivisor: this.progressionDivisor,
      spellResources: this.spellResourceData
    };

    this.stats = stats;
  }
}
