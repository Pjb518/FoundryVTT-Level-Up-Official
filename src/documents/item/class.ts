import type ArchetypeItemA5e from './archetype';
import type { A5EClassData } from '../../dataModels/item/ClassDataModel';
import type { ClassCastingData } from './data';

import { A5EArchetypeData } from '../../dataModels/item/ArchetypeDataModel';
import OriginItemA5e from './origin';

import ClassResourceManager from '../../managers/ClassResourceManager';
import getDeterministicBonus from '../../dice/getDeterministicBonus';

export default class ClassItemA5e extends OriginItemA5e {
	declare casting: ClassCastingData | null;

	declare hitDice: {
		current: number;
		total: number;
		size: number;
	};

	declare resources: ClassResourceManager;

	declare system: InstanceType<typeof A5EClassData>;

	get associatedLevels() {
		const { levels } = this.system.hp;
		return Object.entries(levels ?? {}).reduce((acc, [level, value]) => {
			if (!value) return acc;
			acc.push(level);
			return acc;
		}, [] as string[]);
	}

	get averageHP() {
		return Math.floor(this.hitDice.size / 2) + 1;
	}

	get classLevels() {
		return this.system.classLevels;
	}

	get isStartingClass() {
		if (!this.isEmbedded) return false;

		// @ts-expect-error
		return this.parent?.system.classes.startingClass === this.slug;
	}

	// TODO: Class documents - Cache this
	get maxHP() {
		return this.prepareMaxHitPoints();
	}

	get archetype() {
		if (!this.isEmbedded) return null;
		const { slug } = this;

		const cls: unknown | undefined = this.parent?.items.find(
			(i) => i.system instanceof A5EArchetypeData && i.system.class === slug,
		);

		if (!cls) return null;
		return cls as ArchetypeItemA5e;
	}

	get slug() {
		return this.system.slug || this.name.slugify({ strict: true });
	}

	get totalHitDice() {
		return this.classLevels;
	}

	override prepareBaseData() {
		super.prepareBaseData();

		// Set up class resource manager
		this.resources = new ClassResourceManager(this);

		// this.maxHP = this.prepareMaxHitPoints();
		this.hitDice = {
			current: this.totalHitDice - this.system.hp.hitDiceUsed,
			total: this.totalHitDice,
			size: this.system.hp.hitDiceSize,
		};

		this.casting = this.prepareCasterData();
	}

	prepareMaxHitPoints() {
		const { levels } = this.system.hp;

		const actor = this.isEmbedded ? this.parent : null;
		// @ts-expect-error
		const maxLevel = actor ? actor.levels.character : 20;

		return Object.entries(levels ?? {}).reduce((acc, [level, value]) => {
			if (!value || level > maxLevel) return acc;
			return acc + (value as number);
		}, 0);
	}

	prepareCasterData() {
		const { casterType } = this.system.spellcasting;
		if (!casterType || casterType === 'none' || !this.classLevels) {
			return this.archetype?.casting ?? null;
		}

		const progressionConfig = CONFIG.A5E.casterProgression[casterType] ?? null;
		if (!progressionConfig) return null;

		const { type, config, resource, multiplier, roundUp, multiclassMode } = progressionConfig;

		const data: ClassCastingData = { casterType, resource, progressionType: type };

		// Add spellcasting resource data
		if (type === 'multiplier' && resource === 'slots') {
			const roundFunc = Math.ceil;
			const slots = config[roundFunc(this.classLevels * (multiplier ?? 1))] ?? [];

			data.slots = Object.fromEntries(
				slots.map((slot: number, idx: number) => {
					const skip = Math.round(1 / multiplier) > this.classLevels;
					if (multiplier < 1 && skip && !roundUp) return [idx + 1, 0];

					return [idx + 1, slot];
				}),
			);
		}

		if (type === 'reference') {
			const ref = config[this.classLevels];
			data.multiclassMode = multiclassMode;
			if (resource === 'slots') {
				data.slots = { [ref.level]: ref.slots };
			} else if (resource === 'points') {
				data.points = ref.points;
				data.maxLevel = ref.level;
			} else if (resource === 'inventions') {
				data.inventions = ref.count;
				data.maxLevel = ref.level;
			} else if (resource === 'artifactCharges') {
				data.charges = ref.charges;
				data.maxLevel = ref.level;
			}
		}

		return data;
	}

	override getRollData() {
		const data: Record<string, any> = { ...super.getRollData() };
		const resources = this?.resources?.rollData ?? {};

		const { archetype } = this;
		if (archetype) {
			const subResources = archetype?.resources?.rollData ?? {};
			Object.assign(resources, subResources);
		}

		data.actorTransfer = {
			level: this.classLevels,
			hitDiceSize: this.system.hp.hitDiceSize,
			hitDiceUsed: this.system.hp.hitDiceUsed,
			resources,
			...resources,
		};

		return data;
	}

	// eslint-disable-next-line consistent-return
	override async _preCreate(data, options, user): Promise<boolean | void> {
		foundry.utils.setProperty(data, 'system.classLevels', 1);
		foundry.utils.setProperty(data, 'system.hp.hitDiceUsed', 0);

		// Reset hp rolls
		Array.from({ length: 19 }, (_, i) => i + 2).forEach((level) => {
			foundry.utils.setProperty(data, `system.hp.levels.${level}`, 0);
		});

		if (this.parent?.documentName === 'Actor') {
			const actor = this.parent;
			// @ts-expect-error
			const { classes } = actor;

			if (!Object.keys(classes).length) {
				await actor.update({ 'system.classes.startingClass': this.slug });

				// Update starting hp
				const startingHp = this?.system?.hp?.hitDiceSize ?? 6;
				foundry.utils.setProperty(data, 'system.hp.levels.1', startingHp);
			} else {
				foundry.utils.setProperty(data, 'system.hp.levels.1', 0);
			}

			const existing = classes[this.slug];
			if (existing) {
				existing.update({ 'system.classLevels': Math.min(existing.system.classLevels + 1, 20) });
				return false;
			}
		}

		this.updateSource(data);

		await super._preCreate(data, options, user);
	}

	// eslint-disable-next-line consistent-return
	override async _preUpdate(changed, options, user): Promise<boolean | void> {
		await super._preUpdate(changed, options, user);

		const keys = Object.keys(foundry.utils.flattenObject(changed));
		if (keys.includes('system.hp.hitDiceSize') && (this.isStartingClass || !this.parent)) {
			const size = foundry.utils.getProperty(changed, 'system.hp.hitDiceSize');
			// @ts-expect-error
			await this.updateSource({ 'system.hp.levels.1': size });
		}

		if (
			keys.includes('system.slug') &&
			this.isStartingClass &&
			this.parent?.documentName === 'Actor'
		) {
			const slug = foundry.utils.getProperty(changed, 'system.slug');
			this.parent.update({ 'system.classes.startingClass': slug });
		}

		// Clamp hitDice used
		if (keys.includes('system.hp.hitDiceUsed')) {
			const used = foundry.utils.getProperty(changed, 'system.hp.hitDiceUsed');
			const max = this.totalHitDice;
			// @ts-expect-error
			await this.updateSource({ 'system.hp.hitDiceUsed': Math.clamp(used, 0, max) });
		}

		if (this.parent?.documentName === 'Actor' && keys.includes('system.classLevels')) {
			const actor = this.parent;
			const currentLevel = this.system.classLevels;
			const newLevel = foundry.utils.getProperty(changed, 'system.classLevels');
			// @ts-expect-error
			const result = await actor.grants.createLeveledGrants(currentLevel, newLevel, this);
			if (!result) return false;
		}
	}

	override async _onCreate(data, options, userId) {
		super._onCreate(data, options, userId);

		// Update class resource values
		if (this.isEmbedded) {
			const clsLevel = this.resources.level ?? 1;
			const resourceData = this.resources.consumableResources.reduce((acc, r) => {
				acc[r.slug] = getDeterministicBonus(r.reference[clsLevel], this.actor?.getRollData()) ?? 0;
				return acc;
			}, {});

			this.actor?.update({
				'system.resources.classResources': resourceData,
			});
		}
	}

	override _onUpdate(data, options, userId) {
		super._onUpdate(data, options, userId);
	}

	override async _onDelete(options, user) {
		await super._onDelete(options, user);

		if (this.isStartingClass && this.parent?.documentName === 'Actor') {
			const actor = this.parent;
			actor.update({ 'system.classes.startingClass': '' });
		}

		if (this.isEmbedded) {
			// Delete associated archetype
			const { archetype } = this;
			if (archetype) archetype.delete();

			// Delete actor resource data
			const resourceData = this.resources.consumableResources.reduce((acc, r) => {
				acc[`-=${r.slug}`] = null;
				return acc;
			}, {});

			this.actor?.update({ 'system.resources.classResources': resourceData });
		}
	}
}
