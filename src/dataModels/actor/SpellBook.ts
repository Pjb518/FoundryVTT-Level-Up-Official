import { getDeterministicBonus } from '../../dice/getDeterministicBonus.ts';
import { ActionsManager } from '../../managers/ActionsManager.ts';

const { fields } = foundry.data;

export const spellBookSchema = () => ({
	_id: new fields.DocumentIdField({
		required: true,
		nullable: false,
		initial: () => foundry.utils.randomID(),
	}),
	name: new fields.StringField({
		required: true,
		nullable: false,
		initial: 'New Spell Book',
	}),
	img: new fields.StringField({
		required: true,
		initial: 'icons/svg/book.svg',
	}),
	default: new fields.BooleanField({
		required: true,
		nullable: false,
		initial: false,
	}),
	config: new fields.SchemaField({
		ability: new fields.StringField({ required: true, initial: 'default' }),
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
	}),
});

export class SpellBook extends foundry.abstract.DataModel<
	DataSchema & ReturnType<typeof spellBookSchema>,
	Creature
> {
	declare slug: string;

	declare stats: SpellBook.Stats;

	spells: Collection<any> = new foundry.utils.Collection();

	constructor(data: any, options: any = {}) {
		super(data, options);
	}

	/** @inheritdoc */
	static override defineSchema() {
		return {
			...spellBookSchema(),
		};
	}

	// ======================================
	// Getters
	// ======================================

	/** Gets all the ids of the spell in this book */
	get spellIds(): string[] {
		return this.spells.map((spell: Item.OfType<'spell'>) => spell.id!);
	}

	// ======================================
	// Data Preparation
	// ======================================

	/** @inheritdoc */
	prepareBaseData(): void {
		const actor = this.parent as Creature;
		this.spells = new foundry.utils.Collection();
		if (!actor) return;

		for (const item of actor.itemTypes.spell) {
			if (item.type !== 'spell') continue;

			if (item.system.spellBook !== this._id) continue;
			this.spells.set(item.id || '', item);
		}

		this.slug = `spellbook-${this.name}`.slugify({ strict: true });
		this.prepareSpellBookStats();
	}

	/** Prepare stats for this spell book */
	prepareSpellBookStats(): void {
		const actor = this.parent as Creature;
		if (!actor) return;

		let { ability } = this.config;

		if (this.config.ability === 'default') ability = actor.system.attributes.spellcasting;
		if (!ability) ability = 'int';

		const spellDC =
			getDeterministicBonus(
				[
					8,
					actor.system.attributes.prof,
					actor.system.bonuses.spellDC || 0,
					actor.system.abilities[ability].check.mod,
				].join(' + '),
				actor.getRollData(),
			) || 10;

		const { abilities } = actor.system;
		const spellMod = abilities[ability].check.mod;

		const stats = {
			ability: this.config.ability,
			dc: spellDC,
			mod: spellMod,
		};

		this.stats = stats;
	}

	// ======================================
	// API Methods
	// ======================================
	/** Add a spell to this book */
	addSpell(item: Item.OfType<'spell'>) {
		const actor = this.parent;
		if (!actor) return;

		const spell = this.#updateSpellData(item);
		if (!spell) return;
		actor.createEmbeddedDocuments('Item', [spell]);
	}

	/** Add multiple spells to this book */
	addSpells(items: Item.OfType<'spell'>[]) {
		const actor = this.parent;
		if (!actor) return;

		const spells = items.map((item) => this.#updateSpellData(item));
		actor.createEmbeddedDocuments('Item', spells);
	}

	/** Update a spell with its book id */
	#updateSpellData(item: Item.OfType<'spell'>): any {
		const actor = this.parent;
		if (!actor) return null;

		const spell = item.toObject();
		spell.system.spellBook = this._id;

		return spell;
	}

	/** Add Spell consumers to all spells on this book */
	async addSpellConsumers(spells: Item.OfType<'spell'>[]) {
		const actor = this.parent;
		if (!actor) return;

		if (spells.length === 0) {
			spells = [...this.spells.values()];
		}

		const type = this.config.showSpellSlots ? 'spell' : 'itemUses';
		const updates: Record<string, any>[] = [];

		for (const spell of spells) {
			const actionId = spell.actions?.default?.id;
			const action = actionId ? spell.system.actions[actionId] : null;
			if (!actionId || !action) continue;

			const hasConsumer = Object.values(action.consumers ?? {}).some((c: any) => c.type === type);
			if (hasConsumer) continue;

			const update = await ActionsManager.addConsumer(spell, [actionId, action], type, {}, false);
			updates.push({ _id: spell.id, ...update });
		}

		if (updates.length) await actor.updateEmbeddedDocuments('Item', updates);
	}

	async delete() {
		const { spellIds } = this;
		await this.parent.deleteEmbeddedDocuments('Item', spellIds);

		const id = this._id;

		const updates: Record<string, any> = { [`system.spellBooks.${id}`]: _del };

		if (this.default) {
			const next = [...(this.parent as Creature).spellBooks.values()].find((s) => s._id !== id);
			if (next) updates[`system.spellBooks.${next._id}.default`] = true;
		}

		await this.parent.update(updates);
	}
}

export namespace SpellBook {
	export interface Config {
		ability: string;
		disableSpellConsumers: boolean;
		showArtifactCharges: boolean;
		showSpellInventions: boolean;
		showSpellPoints: boolean;
		showSpellSlots: boolean;
	}

	export interface Data {
		_id: string;
		name: string;
		img: string;
		default: boolean;
		config: Config;
	}

	export interface Stats {
		ability: string;
		dc: number;
		mod: number;
	}
}
