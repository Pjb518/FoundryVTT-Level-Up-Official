// *****************************************************************************************

import { createSubscriber } from 'svelte/reactivity';
import { RollOverrideManager } from '#managers/RollOverrideManager.ts';
import { getRollFormula } from '#utils/getRollFormula.ts';
import { localize } from '#utils/localization/localize.ts';
import AbilityBonusConfigDialog from '#view/components/bonuses/AbilityBonusConfigDialog.svelte';
import AttackBonusConfigDialog from '#view/components/bonuses/AttackBonusConfigDialog.svelte';
import DamageBonusConfigDialog from '#view/components/bonuses/DamageBonusConfigDialog.svelte';
import ExertionBonusConfigDialog from '#view/components/bonuses/ExertionBonusConfigDialog.svelte';
import HealingBonusConfigDialog from '#view/components/bonuses/HealingBonusConfigDialog.svelte';
import HitPointsBonusConfigDialog from '#view/components/bonuses/HitPointsBonusConfigDialog.svelte';
import InitiativeBonusConfigDialog from '#view/components/bonuses/InitiativeBonusConfigDialog.svelte';
import MovementBonusConfigDialog from '#view/components/bonuses/MovementBonusConfigDialog.svelte';
import SensesBonusConfigDialog from '#view/components/bonuses/SensesBonusConfigDialog.svelte';
import SkillBonusConfigDialog from '#view/components/bonuses/SkillBonusConfigDialog.svelte';
import AbilityCheckRollDialog from '#view/dialogs/actor/AbilityCheckRollDialog.svelte';
import AbilityConfigDialog from '#view/dialogs/actor/AbilityConfigDialog.svelte';
import ArmorClassConfigDialog from '#view/dialogs/actor/ArmorClassConfigDialog.svelte';
import DetailsConfigDialog from '#view/dialogs/actor/DetailsConfigDialog.svelte';
import HitPointsConfigDialog from '#view/dialogs/actor/HitPointsConfigDialog.svelte';
import InitiativeConfigDialog from '#view/dialogs/actor/InitiativeConfigDialog.svelte';
import MovementConfigDialog from '#view/dialogs/actor/MovementConfigDialog.svelte';
import RestDialog from '#view/dialogs/actor/RestDialog.svelte';
import SavingThrowRollDialog from '#view/dialogs/actor/SavingThrowRollDialog.svelte';
import SensesConfigDialog from '#view/dialogs/actor/SensesConfigDialog.svelte';
import SkillCheckRollDialog from '#view/dialogs/actor/SkillCheckRollDialog.svelte';
import SkillConfigDialog from '#view/dialogs/actor/SkillConfigDialog.svelte';
import { GenericConfigDialog } from '#view/dialogs/initializers/GenericConfigDialog.svelte.ts';
import { getDeterministicBonus } from '../../dice/getDeterministicBonus.ts';
import type { D20Roll } from '../../dice/rolls/D20Roll.ts';
import ActorGrantsManager from '../../managers/ActorGrantsManager.ts';
import { BonusesManager } from '../../managers/BonusesManager.ts';
import HitDiceManager from '../../managers/HitDiceManager.ts';
import { RestManager } from '../../managers/RestManager.ts';
import { RollPreparationManager } from '../../managers/RollPreparationManager.ts';
import SpellBookManager from '../../managers/SpellBookManager.ts';
import { handleDocumentImportMigration } from '../../migration/handlers/handleDocumentMigration.ts';
import { MigrationRunnerBase } from '../../migration/runner/base.ts';
import displayCascadingNumbers from '../../utils/displayCascadingNumbers.js';
import { ActiveEffectA5E } from '../activeEffect/ae.svelte.ts';
import automateHpConditions from '../activeEffect/utils/automateHpConditions.js';
import automateMultiLevelConditions from '../activeEffect/utils/automateMultiLevelConditions.js';
import { generateExpandedChanges } from '../activeEffect/utils/generateExpandedChanges.ts';
import type { BaseItemA5e } from '../item/base.svelte.ts';
import type {
	AbilityCheckRollOptions,
	ActorDialogs,
	LazyActorRefs,
	SavingThrowRollOptions,
	SkillCheckRollOptions,
} from './data.ts';

import FDoc = foundry.abstract.Document;

// *****************************************************************************************

declare module 'fvtt-types/configuration' {
	interface DocumentClassConfig {
		Actor: typeof ActorA5E<Actor.SubType>;
	}

	interface ConfiguredActor<SubType extends Actor.SubType> {
		document: ActorA5E<SubType>;
	}
}

// *****************************************************************************************

class ActorA5E<SubType extends Actor.SubType = Actor.SubType> extends Actor<SubType> {
	// Defaults
	#configDialogMap = {
		ability: AbilityConfigDialog,
		abilityBonus: AbilityBonusConfigDialog,
		alignment: DetailsConfigDialog,
		armor: DetailsConfigDialog,
		armorClass: ArmorClassConfigDialog,
		attackBonus: AttackBonusConfigDialog,
		conditionImmunities: DetailsConfigDialog,
		damageBonus: DamageBonusConfigDialog,
		damageImmunities: DetailsConfigDialog,
		damageResistances: DetailsConfigDialog,
		damageVulnerabilities: DetailsConfigDialog,
		exertionBonus: ExertionBonusConfigDialog,
		healingBonus: HealingBonusConfigDialog,
		hitPointsBonus: HitPointsBonusConfigDialog,
		health: HitPointsConfigDialog,
		initiative: InitiativeConfigDialog,
		initiativeBonus: InitiativeBonusConfigDialog,
		languages: DetailsConfigDialog,
		maneuverTraditions: DetailsConfigDialog,
		movement: MovementConfigDialog,
		movementBonus: MovementBonusConfigDialog,
		senses: SensesConfigDialog,
		sensesBonus: SensesBonusConfigDialog,
		size: DetailsConfigDialog,
		skill: SkillConfigDialog,
		skillBonus: SkillBonusConfigDialog,
		terrain: DetailsConfigDialog,
		tools: DetailsConfigDialog,
		types: DetailsConfigDialog,
		weapons: DetailsConfigDialog,
	};

	dialogs: ActorDialogs;

	// Managers
	declare BonusesManager: BonusesManager;

	declare HitDiceManager: HitDiceManager;

	declare grants: ActorGrantsManager;

	declare spellBooks: SpellBookManager;

	// Props
	/**
	 * Stores a lazy instaces of origin items
	 */
	_lazy: LazyActorRefs = {
		classes: undefined,
	};

	automationAvailable = false;

	/** A list of members in a party. Only available on parties */
	members: Creature[] = [];

	declare classAutomationFlags: Record<string, boolean>;
	declare levels: { character: number; classes: Record<string, number> };

	// Custom
	effectPhases: { beforeDerived: any[]; afterDerived: any[] };

	#subscribe: () => void;

	// *****************************************************************************************

	constructor(data, context) {
		super(data, context);

		this.dialogs ??= {
			abilities: {},
			bonuses: {},
			genericResources: {},
			skills: {},
			notes: {},
		};

		this.#subscribe = createSubscriber((update: any) => {
			const updateActorHook = Hooks.on('updateActor', (triggeringDocument: any, _, { diff }) => {
				if (diff === false) return;
				if (triggeringDocument._id === this.id) update();
			});

			const embeddedItemHooks = ['create', 'delete', 'update'].reduce(
				(hooks, hookType) => {
					// @ts-expect-error
					hooks[hookType] = Hooks.on(`${hookType}Item`, (triggeringDocument: any, _, { diff }) => {
						if (diff === false) return;

						if (triggeringDocument?.actor?._id === this.id) update();
					});

					return hooks;
				},
				{} as Record<string, number>,
			);

			const embeddedEffectHooks = ['create', 'delete', 'update'].reduce(
				(hooks, hookType) => {
					hooks[hookType] = Hooks.on(
						// @ts-expect-error
						`${hookType}ActiveEffect`,
						(triggeringDocument: any, _, { diff }) => {
							if (diff === false) return;

							if (triggeringDocument?.parent?._id === this.id) update();
						},
					);

					return hooks;
				},
				{} as Record<string, number>,
			);

			return () => {
				Hooks.off('updateActor', updateActorHook);
				Hooks.off('createItem', embeddedItemHooks.create);
				Hooks.off('deleteItem', embeddedItemHooks.delete);
				Hooks.off('updateItem', embeddedItemHooks.update);
				Hooks.off('createActiveEffect', embeddedEffectHooks.create);
				Hooks.off('deleteActiveEffect', embeddedEffectHooks.delete);
				Hooks.off('updateActiveEffect', embeddedEffectHooks.update);
			};
		});

		this.effectPhases = { beforeDerived: [], afterDerived: [] };
	}

	/** Gets a reactive instance of the actor */
	get reactive() {
		this.#subscribe();

		return this;
	}

	/** ================================================================= */
	// Type Helpers
	/** ================================================================= */

	/** Returns if the actor is a creature */
	isCreature(): this is Creature {
		return this.type === 'character' || this.type === 'npc';
	}

	isChar(): this is Actor.OfType<'character'> {
		return this.type === 'character';
	}

	isNPC(): this is Actor.OfType<'npc'> {
		return this.type === 'npc';
	}

	isParty(): this is Actor.OfType<'party'> {
		return this.type === 'party';
	}

	/** ================================================================= */
	// Getters
	/** ================================================================= */

	/** Get effects available on the actor */
	get actorEffects() {
		return this.effects.map((e) => e);
	}

	/** Get available spellslots on an actor */
	get availableSpellSlots(): string[] {
		if (!this.isCreature()) return [];

		return Object.entries(this.system.spellResources.slots ?? {}).reduce(
			(acc: string[], [level, slot]: [string, any]) => {
				if (slot.max > 0 && slot.current > 0) acc.push(level);
				return acc;
			},
			[],
		);
	}

	/** Check if an actor is bloodied */
	get isBloodied(): boolean {
		if (!this.isCreature()) return false;

		const { max, value } = this.system.attributes.hp;
		return (value / max) * 100 <= 50;
	}

	/** Get current schema version of the actor */
	get migrationVersion() {
		return this.system.migrationData.version;
	}

	/**
	 * An array of ActiveEffect instances which are present on the
	 * Actor which have a limited duration.
	 */
	// @ts-expect-error
	override get temporaryEffects() {
		const effects: ActiveEffect[] = [];

		for (const effect of this.allApplicableEffects()) {
			if (effect.active && (effect.isTemporary || effect?.system?.effectType === 'onUse')) {
				// @ts-expect-error
				effects.push(effect);
			}
		}

		return effects.sort((a, b) => a.name.localeCompare(b.name));
	}

	/** Get vision data for token use */
	get visionData() {
		if (!this.isCreature()) return undefined;
		const actor = this as Creature;

		const { senses } = actor.system.attributes;

		return {
			hasBlindsight: senses.blindsight.distance > 0,
			hasDarkvision: senses.darkvision.distance > 0,
			hasTremorsense: senses.tremorsense.distance > 0,
			hasTruesight: senses.truesight.distance > 0,
			senses,
		};
	}

	/** ---------------------------------- */
	// Getters (Creature)
	/** ---------------------------------- */

	/** Get coin data of a creature */
	get coins(): Record<string, number> {
		// @ts-expect-error
		return this.system.currency;
	}

	/** Get total wealth of Creature/ Party */
	get wealth(): { coins: number; wealth: number } {
		// Get Wealth for party
		if (this.isParty()) {
			const total = { coins: 0, wealth: 0 };
			this.members.forEach((a) => {
				const actorWealth = a.wealth;
				total.coins += actorWealth.coins;
				total.wealth += actorWealth.wealth;
			});

			return total;
		}

		const actor = this as Creature;

		const config = CONFIG.A5E.currencyToGold;

		const coins = Object.entries(actor.coins ?? {}).reduce((acc, [curr, val]) => {
			return acc + (config[curr]?.(val ?? 0) ?? 0);
		}, 0);

		const wealth = actor.itemTypes.object.reduce((acc, obj) => {
			if (obj.system.price.special) return acc;

			const denom = obj.system.price.denomination;
			const goldValue = config[denom]?.(obj.system.price.value ?? 0) ?? 0;
			return acc + goldValue;
		}, 0);

		return { coins, wealth };
	}

	/** ---------------------------------- */
	// Getters (Char)
	/** ---------------------------------- */

	/** Get classes on an actor */
	get classes() {
		if (this.type !== 'character') return undefined;

		if (this._lazy?.classes !== undefined) return this._lazy.classes;
		const classes = Object.fromEntries(
			this.itemTypes.class.map((cls) => [cls.slug, cls]),
		) as Record<string, Item.OfType<'class'>>;

		return classes;
	}

	/** Get what culture the actor has */
	get culture() {
		const cultures = this.itemTypes.culture;
		if (!cultures) return null;

		return cultures[0] as Item.OfType<'culture'>;
	}

	get heritage() {
		const heritages = this.itemTypes.heritage;
		if (!heritages) return null;

		return heritages[0] as Item.OfType<'heritage'>;
	}

	/** Gets the total supply from items and supply field */
	get totalSupply() {
		if (!this.isChar()) return 0;
		const actor = this as Actor.OfType<'character'>;

		const base = actor.system.supply ?? 0;
		const supplyCount = actor.items.reduce((acc, item) => {
			if (item.type !== 'object') return acc;
			if (item.system.supply && item.system.equippedState) {
				acc += item.system.quantity || 1;
			}

			return acc;
		}, 0);

		return base + supplyCount;
	}

	/** @deprecated  */
	get supply() {
		return this.totalSupply;
	}

	/** ---------------------------------- */
	// Getters (NPC)
	/** ---------------------------------- */
	get hitPointFormula() {
		if (this.type !== 'npc') return '';
		const actor = this as Actor.OfType<'npc'>;

		const { hitDice } = actor.system.attributes;
		// @ts-expect-error
		const { mod } = actor.system.abilities.con;

		let hitDiceCount = 0;
		const parts: string[] = [];

		// @ts-expect-error
		Object.entries(hitDice ?? {}).forEach(([dieSize, { total: diceQuantity }]) => {
			if (!diceQuantity) return;

			parts.push(`${diceQuantity}${dieSize}`);
			hitDiceCount += diceQuantity;
		});

		if (hitDiceCount === 0) return '';
		return `${parts.join(' + ')} + ${hitDiceCount * mod}`;
	}

	/** ---------------------------------- */
	// Getters (Party)
	/** ---------------------------------- */

	/** ================================================================= */
	// Generators
	/** ================================================================= */

	/** Get Applicable effects on the actor */
	override *allApplicableEffects() {
		for (const effect of this.effects) yield effect;

		for (const item of this.items) {
			for (const effect of item.effects) {
				if (effect.transfer || effect.system.effectType === 'passive') yield effect;
			}
		}
	}

	/** ================================================================= */
	// Data Preperation Methods
	/** ================================================================= */

	/**
	 * @inheritdoc
	 */
	protected override _initialize(options?: FDoc.InitializeOptions) {
		// Unset Managers
		this.BonusesManager = null!;
		this.HitDiceManager = null!;
		this.grants = null!;
		this.spellBooks = null!;

		if (this.type === 'character') {
			this.classAutomationFlags = {};
		}

		super._initialize(options);
	}

	/**
	 * Sets the order of when to prepare data.
	 */
	override prepareData() {
		// Clear cached values
		this._lazy = {
			classes: undefined,
		};

		// Identify which special statuses had been active
		const specialStatuses = new Map();
		for (const statusId of Object.values(CONFIG.specialStatusEffects)) {
			specialStatuses.set(statusId, this.statuses.has(statusId));
		}

		const isTypeData = this.system instanceof foundry.abstract.TypeDataModel;

		// @ts-expect-error
		if (isTypeData) this.system?.prepareBaseData();
		this.prepareBaseData();

		super.prepareEmbeddedDocuments();

		// @ts-expect-error
		if (isTypeData) this.system?.prepareDerivedData();
		this.prepareDerivedData();

		// Initialize the SpellBooks
		if (this.isCreature()) {
			this.spellBooks = new SpellBookManager(this);
			this.spellBooks.forEach((spellBook) => {
				spellBook.prepareBaseData();
			});
		}

		// Apply Derived effects after armor class data
		this.applyActiveEffects('final');
		if (this.isCreature()) this.prepareArmorClass();

		// Apply special statuses that changed to active tokens
		let tokens: Token[];
		for (const [statusId, wasActive] of specialStatuses) {
			const isActive = this.statuses.has(statusId);
			if (isActive === wasActive) continue;
			// @ts-expect-error
			tokens ??= this.getDependentTokens({ scenes: canvas.scene })
				.filter((t) => t.rendered)
				.map((t) => t.object);

			// @ts-expect-error
			for (const token of tokens) token._onApplyStatusEffect(statusId, isActive);
		}
	}

	/** ================================================================= */
	// Base Data Prep Methods
	/** ================================================================= */

	/**
	 * Prepare base data for the actor.
	 */
	override prepareBaseData() {
		super.prepareBaseData();
		this._clearData();

		// Call Sub Methods
		if (this.isCreature()) this.prepareCreatureBaseData();
		if (this.isParty()) this.preparePartyBaseData();
	}

	/** Prepares common base data for creatures */
	prepareCreatureBaseData(this: Creature) {
		// Register Managers
		this.BonusesManager = new BonusesManager(this);
		// @ts-expect-error
		this.grants = new ActorGrantsManager(this);

		// Add AC data to the actor.
		// @ts-expect-error
		this.system.attributes.ac.changes = {
			override: null,
			bonuses: { components: [], value: 0 },
		};

		// Call Sub Methods
		if (this.type === 'character') this.prepareCharBaseData();
		if (this.type === 'npc') this.prepareNPCBaseData();
	}

	prepareCharBaseData(this: Actor.OfType<'character'>) {
		if (this.type !== 'character') return;

		const automationAvailable = Object.keys(this.classes ?? {}).length > 0;
		this.automationAvailable = automationAvailable;

		this.classAutomationFlags = {
			classes: this.getFlag('a5e', 'automateClasses') ?? automationAvailable ?? false,
			hitDice: this.getFlag('a5e', 'automateHitDice') ?? automationAvailable ?? false,
			hitPoints: this.getFlag('a5e', 'automateHitPoints') ?? automationAvailable ?? false,
			spellResources: this.getFlag('a5e', 'automateSpellResources') ?? automationAvailable ?? false,
		};

		this.prepareLevelData();

		// Calculate the proficiency bonus for the character with a minimum value of 2.
		this.system.attributes.prof = Math.max(2, Math.floor((this.levels.character + 7) / 4));
	}

	prepareNPCBaseData(this: Actor.OfType<'npc'>) {}

	preparePartyBaseData(this: Actor.OfType<'party'>) {
		this.members = [...this.system.details.members]
			.map((m) => fromUuidSync(m))
			.filter((m) => m instanceof ActorA5E && m.isCreature())
			.sort((a, b) => a.name.localeCompare(b.name));
	}

	/** ---------------------------------- */
	//  Base Data Prep (Char)
	/** ---------------------------------- */

	/**
	 * Prepares detailed level data for the actor.
	 */
	prepareLevelData(this: Actor.OfType<'character'>) {
		const classes = this.items.filter((item) => item.type === 'class');

		if (!this.classAutomationFlags.classes) {
			this.levels = {
				character: this.system.details.level,
				classes: {},
			};

			return;
		}

		const levelData = Object.values(classes ?? {}).reduce(
			(acc, cls) => {
				const level = cls.system.classLevels;
				if (!level) return acc;

				acc.classes[cls.system.slug || cls.name.slugify({ strict: true })] = level;
				acc.character += level;
				return acc;
			},
			{ character: 0, classes: {} },
		);

		this.levels = levelData;
	}

	/** ================================================================= */
	// Derived Data Prep Methods
	/** ================================================================= */

	/**
	 * Prepares derived data for the actor.
	 */
	override prepareDerivedData() {
		super.prepareDerivedData();

		if (this.isCreature()) this.prepareCreatureDerivedData();
	}

	/** Prepares derived data for creatures */
	prepareCreatureDerivedData(this: Creature) {
		const actorData = this.system;

		// Add base bonuses for abilities
		Object.entries(actorData.abilities).forEach(([abilityKey, ability]) => {
			const value = getDeterministicBonus(
				[
					// @ts-expect-error
					ability.value,
					this.BonusesManager?.getAbilityBonusesFormula(abilityKey, 'base').trim(),
				]
					.filter(Boolean)
					.join(' + '),
			);

			// @ts-expect-error
			ability.value = value ?? ability.value;
		});

		// Calculate the base ability modifier for each ability score.
		Object.values(actorData.abilities).forEach((ability) => {
			// @ts-expect-error
			const baseMod = Math.floor((ability.value - 10) / 2);

			// @ts-expect-error
			ability.check.mod = baseMod;
			// @ts-expect-error
			ability.save.mod = baseMod + (ability.save.proficient ? actorData.attributes.prof : 0);
		});

		/**
		 * Calculate the deterministic bonuses for each ability score.
		 *
		 * IMPORTANT: This step cannot be combined into the previous forEach; otherwise, deterministic
		 *            bonuses will be unable to refer to modifiers from subsequent ability scores.
		 */
		Object.entries(actorData.abilities).forEach(([abilityKey, ability]) => {
			['check', 'save'].forEach((key) => {
				let deterministicBonus: number;

				try {
					deterministicBonus = getDeterministicBonus(
						[
							// @ts-expect-error
							ability[key].mod,
							// @ts-expect-error
							this.BonusesManager?.getAbilityBonusesFormula(abilityKey, key).trim(),
						]
							.filter(Boolean)
							.join(' + '),
						this.getRollData(),
					);
				} finally {
					// Fall back to the base ability mod if no bonus could be calculated.
					// @ts-expect-error
					ability[key].deterministicBonus = deterministicBonus ?? ability[key].mod;
				}
			});
		});

		try {
			actorData.attributes.maneuverDC = getDeterministicBonus(
				[
					8,
					actorData.attributes.prof,
					actorData.bonuses.maneuverDC,
					// @ts-expect-error
					Math.max(actorData.abilities.str.check.mod, actorData.abilities.dex.check.mod),
				].join(' + '),
				this.getRollData(),
			);
		} catch {
			// eslint-disable-next-line no-console
			console.error(`Failed to calculate a maneuver DC for ${this.name}`);
			// @ts-expect-error
			actorData.attributes.maneuverDC = null;
		}

		try {
			// @ts-expect-error
			actorData.attributes.spellDC = getDeterministicBonus(
				[
					8,
					actorData.attributes.prof,
					actorData.bonuses?.spellDC || 0,
					actorData.abilities[actorData.attributes.spellcasting || 'int'].check.mod,
				].join(' + '),
				this.getRollData(),
			);
		} catch {
			console.error(`Failed to calculate a spell DC for ${this.name}`);
			// @ts-expect-error
			actorData.attributes.spellDC = null;
		}

		this.prepareHitPointBonuses();
		this.prepareSkills();
		this.prepareMovement();
		this.prepareSenses();

		foundry.utils.setProperty(this, 'system.attributes.ac.changes', this.prepareArmorChanges());

		// Call Sub Methods
		if (this.type === 'character') this.prepareCharDerivedData();
		if (this.type === 'npc') this.prepareNPCDerivedData();
	}

	prepareCharDerivedData(this: Actor.OfType<'character'>) {
		// @ts-expect-error
		this.HitDiceManager = new HitDiceManager(this, this.classAutomationFlags.hitDice);

		const actorData = this.system;

		actorData.attributes.attunement.current = this.items.reduce((acc, curr) => {
			const { requiresAttunement, attuned } = curr.system;
			return requiresAttunement && attuned ? acc + 1 : acc;
		}, 0);

		// Update Hit Dice based on manager
		this.system.attributes.hitDice = foundry.utils.mergeObject(
			this.system.attributes.hitDice,
			this.HitDiceManager.bySize,
		);

		foundry.utils.setProperty(actorData, 'attributes.exertion.max', this.prepareMaxExertion());
		foundry.utils.setProperty(
			actorData,
			'attributes.favorPoints.max',
			// @ts-expect-error
			this.system.abilities.cha.mod,
		);

		this.prepareHitPoints();
		this.prepareSpellResources();
		this.prepareResources();
	}

	prepareNPCDerivedData(this: Actor.OfType<'npc'>) {
		// @ts-expect-error
		this.HitDiceManager = new HitDiceManager(this, false);

		const { baseMax: baseHP, bonus: bonusHP } = this.system.attributes.hp;
		this.system.attributes.hp.max = baseHP + bonusHP;

		this.prepareHitPointBonuses();
	}

	/** ---------------------------------- */
	//  Derived Data Prep (Creature)
	/** ---------------------------------- */

	prepareArmorClass(this: Creature) {
		// @ts-expect-error
		const changes = this.system.attributes.ac.changes ?? {};

		// Add Base to changes
		let name = 'Natural Armor';
		const baseAC = getDeterministicBonus(
			`${this.system.attributes.ac.baseFormula}` || '10 + @dex.mod',
			this.getRollData(),
		);

		// Check for complete override of AC
		const valueOverride = foundry.utils.getProperty(this.overrides, 'system.attributes.ac.value');
		if (valueOverride !== null && valueOverride !== undefined) {
			const effectOverride = [...this.allApplicableEffects()].findLast(
				(effect) =>
					effect.system.changes.some((change) => change.key.includes('ac.value')) &&
					!effect.isSuppressed,
			);

			const tempFinalAC = (changes.override?.value ?? baseAC) + changes.bonuses.value;
			foundry.utils.mergeObject(this.system.attributes.ac, {
				changes,
				value: Number.parseInt(tempFinalAC, 10) || 10,
			});

			const overrideChange = ActiveEffectA5E.applyChange(
				this,
				effectOverride?.system?.changes?.find?.((change) => change.key.includes('ac.value')),
				{ replacementData: this.getRollData(), modifyTarget: true },
			);

			const overrideValue = Object.values(overrideChange)?.[0] ?? valueOverride;

			name = effectOverride?.name ?? name;
			changes.override = {
				name,
				mode: CONFIG.A5E.ARMOR_MODES.OVERRIDE,
				value: overrideValue,
			};
			changes.bonuses = {
				components: [],
				value: 0,
			};
		}

		// Check for baseArmor override
		const overrideProperty = foundry.utils.getProperty(
			this.overrides,
			'system.attributes.ac.baseFormula',
		);
		if (overrideProperty && !valueOverride) {
			const effectOverride = this.actorEffects.findLast(
				(effect) =>
					effect.system.changes.some((change) => change.key.includes('ac.baseFormula')) &&
					!effect.isSuppressed,
			);

			name = effectOverride?.name ?? name;
			changes.override = {
				name,
				mode: CONFIG.A5E.ARMOR_MODES.OVERRIDE,
				value: baseAC,
			};
		}

		changes.override ??= {
			name: 'Natural Armor',
			mode: CONFIG.A5E.ARMOR_MODES.OVERRIDE,
			formula: this.system.attributes.ac.baseFormula,
			value: baseAC,
		};

		// Calculate the final AC value.
		const finalAC = (changes.override?.value ?? baseAC) + changes.bonuses.value;

		foundry.utils.mergeObject(this.system.attributes.ac, {
			changes,
			value: Number.parseInt(finalAC, 10) || 10,
		});
	}

	determineDefenseConfiguration(this: Creature) {
		// const currentStr = this.system.abilities.str.value;
		return this.items.reduce(
			(acc, item) => {
				if (item.system.equippedState !== CONFIG.A5E.EQUIPPED_STATES.EQUIPPED) return acc;

				const { formula } = item.system.ac ?? {};
				if (!formula) return acc;

				if (item.system.objectType === 'armor') acc.hasArmor = true;
				else if (item.system.objectType === 'shield') acc.hasShield = true;

				return acc;
			},
			{ hasArmor: false, hasShield: false },
		);
	}

	prepareArmorChanges(this: Creature) {
		// const currentStr = this.system.abilities.str.value;
		const { hasArmor, hasShield } = this.determineDefenseConfiguration();

		const changes = this.items.reduce(
			(acc, item) => {
				const { formula, mode, requiresUnarmored, requiresNoShield } = item.system.ac ?? {};
				if (!formula) return acc;

				if (item.type === 'feature' && mode === CONFIG.A5E.ARMOR_MODES.OVERRIDE && hasArmor)
					return acc;
				if ((requiresUnarmored && hasArmor) || (requiresNoShield && hasShield)) return acc;

				if (
					item.type === 'object' &&
					item.system.equippedState !== CONFIG.A5E.EQUIPPED_STATES.EQUIPPED
				)
					return acc;

				if (item.system.objectType === 'armor') {
					const isUnderArmor = item.system.materialProperties.includes('underarmor');
					if (isUnderArmor && acc.override) return acc;
				}

				const value = getDeterministicBonus(formula, this.getRollData()) ?? 0;
				const change = {
					name: item.name,
					id: item.uuid,
					mode,
					value,
				};

				// @ts-expect-error
				if (mode === CONFIG.A5E.ARMOR_MODES.OVERRIDE) acc.override = change;
				// @ts-expect-error
				else if (item.system.objectType === 'shield' && value > (acc.shield?.value ?? 0)) {
					// @ts-expect-error
					acc.shield = change;
					// @ts-expect-error
				} else acc.bonuses.push(change);

				return acc;
			},
			{ override: null, shield: null, bonuses: [] },
		);

		if (changes.shield) changes.bonuses.unshift(changes.shield);
		// @ts-expect-error
		delete changes.shield;

		// Bring reduced changes in line with the expected format
		const bonuses = changes.bonuses.reduce((acc, { value }) => acc + value, 0);
		// @ts-expect-error TODO: Fix this type error
		changes.bonuses = { components: changes.bonuses, value: bonuses };

		return changes;
	}

	/** Prepare hit point bonuses for the actor. */
	prepareHitPointBonuses(this: Creature) {
		const { max } = this.system.attributes.hp;

		const bonus = getDeterministicBonus(
			this.BonusesManager.getHitPointsBonusFormula(),
			this.getRollData(),
		);

		foundry.utils.setProperty(this, 'system.attributes.hp.max', (max || 0) + bonus);
	}

	/** Prepare skill data for the actor. */
	prepareSkills(this: Creature) {
		const actorData = this.system;
		const proficiencyBonus = actorData.attributes.prof;
		const jackOfAllTrades = this.flags?.a5e?.jackOfAllTrades;

		Object.values(actorData.skills).forEach((skill) => {
			if (skill.proficient === 2) skill.mod = proficiencyBonus * 2;
			else if (skill.proficient) skill.mod = proficiencyBonus;
			else if (jackOfAllTrades) skill.mod = Math.floor(proficiencyBonus / 2);
			else skill.mod = 0;

			if (skill.ability.startsWith('@attributes.spellcasting')) {
				skill.ability = actorData.attributes.spellcasting;
			}
		});

		// Prepare skill expertise die
		const grants = this.grants
			?.byType('expertiseDice')
			// @ts-expect-error
			.filter((g) => g.expertiseDiceData?.expertiseType === 'skill');

		Object.entries(actorData.skills).forEach(([key, skill]) => {
			const baseDie = skill.expertiseDice ?? 0;
			const expertiseDice = grants?.reduce((acc, grant) => {
				// @ts-expect-error
				const { expertiseCount, keys } = grant.expertiseDiceData;
				if (!keys.includes(key)) return acc;

				return Math.clamp(acc + Number(expertiseCount), 0, 5);
			}, baseDie);

			skill.expertiseDice = expertiseDice;
		});

		// Prepare skill mod
		Object.entries(actorData.skills).forEach(([key, skill]) => {
			const skillName = localize(CONFIG.A5E.skills[key]);

			let deterministicBonus = 0;

			try {
				deterministicBonus = getDeterministicBonus(
					[
						skill.mod,
						this.BonusesManager?.getSkillBonusesFormula(key, skill.ability, 'check', true),
					]
						.filter(Boolean)
						.join(' + '),
					this.getRollData(),
				);
			} catch {
				console.error(`Couldn't calculate a ${skillName} modifier for ${this.name}`);
			}

			skill.deterministicBonus = deterministicBonus ?? skill.mod;

			try {
				skill.passive = this._calculatePassiveScore(key, skill);
			} catch (e) {
				console.error(`Couldn't calculate a ${skillName} passive score for ${this.name}`);
				// @ts-expect-error
				skill.passive = null;
			}
		});
	}

	/**  Calculate passive score for this actor. */
	_calculatePassiveScore(skillKey: string, skill) {
		const rollData = this.getRollData();

		return getDeterministicBonus(
			[
				10,
				skill.mod,
				// @ts-expect-error
				rollData.abilities[skill.ability]?.check?.deterministicBonus ?? 0,
				this.BonusesManager?.getSkillBonusesFormula(skillKey, skill.ability, 'passive', false),
			]
				.filter(Boolean)
				.join(' + '),
			rollData,
		);
	}

	/** Prepare movement data taking into account any bonuses. */
	prepareMovement(this: Creature) {
		const { movement } = this.system.attributes;

		const movementKeys = Object.keys(movement);
		const deferApplication: string[] = [];

		// @ts-expect-error
		for (const [type, { distance }] of Object.entries(movement)) {
			const bonusFormula = this.BonusesManager?.getMovementBonusFormula(type);
			if (!bonusFormula) continue;

			if (movementKeys.some((k) => bonusFormula.includes(k))) {
				deferApplication.push(type);
				continue;
			}

			const bonus = getDeterministicBonus(bonusFormula, this.getRollData());
			if (!bonus) continue;
			this.system.attributes.movement[type].distance = distance + bonus;
		}

		// Apply deferred bonuses
		deferApplication.forEach((type) => {
			const bonusFormula = this.BonusesManager?.getMovementBonusFormula(type);
			if (!bonusFormula) return;

			const bonus = getDeterministicBonus(bonusFormula, this.getRollData());
			if (!bonus) return;
			this.system.attributes.movement[type].distance = movement[type].distance + bonus;
		});
	}

	/** Prepare senses data taking into account any bonuses.
	 */
	prepareSenses(this: Creature) {
		const { senses } = this.system.attributes;

		const sensesKeys = Object.keys(senses);
		const deferApplication: string[] = [];

		for (const [type, { distance }] of Object.entries(senses)) {
			const bonusFormula = this.BonusesManager?.getSensesBonusFormula(type);
			if (!bonusFormula) continue;

			if (bonusFormula === 'unlimited') {
				this.system.attributes.senses[type].distance = 0;
				this.system.attributes.senses[type].unit = 'unlimited';
				continue;
			}

			if (sensesKeys.some((k) => bonusFormula.includes(k))) {
				deferApplication.push(type);
				continue;
			}

			const bonus = getDeterministicBonus(bonusFormula, this.getRollData());
			if (!bonus) continue;
			this.system.attributes.senses[type].distance = distance + bonus;
		}

		// Apply deferred bonuses
		deferApplication.forEach((type) => {
			const bonusFormula = this.BonusesManager?.getSensesBonusFormula(type);
			if (!bonusFormula) return;

			const bonus = getDeterministicBonus(bonusFormula, this.getRollData());
			if (!bonus) return;
			this.system.attributes.senses[type].distance = senses[type].distance + bonus;
		});
	}

	/** ---------------------------------- */
	//  Derived Data Prep (Char)
	/** ---------------------------------- */

	/** Prepare the maximum exertion available to a char */
	prepareMaxExertion(this: Actor.OfType<'character'>) {
		const { max: baseMax } = this.system.attributes.exertion;
		if (!this.automationAvailable) return baseMax;

		let max = 0;

		// Get best pool type from actor grants
		// @ts-expect-error
		const pools = this.grants?.byType('exertion').reduce((acc, { exertionData }) => {
			if (!exertionData) return acc;
			if (exertionData.exertionType === 'pool') acc.push(exertionData.poolType);
			return acc;
		}, [] as string[]);

		if (pools.length === 0) max = baseMax;
		else if (pools.includes('doubleProf')) max = this.system.attributes.prof * 2;
		else if (pools.includes('prof')) max = this.system.attributes.prof;
		else max = baseMax;

		// Add bonuses
		const bonuses =
			getDeterministicBonus(this.BonusesManager?.getExertionBonusFormula(), this.getRollData()) ??
			0;

		return max + bonuses;
	}

	/** Prepare Hit Points for a char */
	prepareHitPoints(this: Actor.OfType<'character'>) {
		if (!this.classAutomationFlags.hitPoints) {
			const { baseMax: baseHP, bonus: bonusHP } = this.system.attributes.hp;
			this.system.attributes.hp.max = baseHP + bonusHP;
			this.prepareHitPointBonuses();
			return;
		}

		const { classes } = this;
		const bonusHP = this.system.attributes.hp.bonus ?? 0;
		const maxHP = Object.values(classes ?? {}).reduce((acc, cls) => acc + cls.maxHP, 0);
		// @ts-expect-error
		const conMod = (this.system.abilities.con.check.mod ?? 0) * this.levels.character;

		this.system.attributes.hp.max = maxHP + conMod + bonusHP;
		this.prepareHitPointBonuses();
	}

	/** Prepare Spell Resources for a char */
	prepareSpellResources(this: Actor.OfType<'character'>) {
		const actorData = this.system;
		const { classes } = this;
		const { spellResources } = actorData;

		// Handle no automation option
		if (!this.classAutomationFlags.spellResources) {
			// @ts-expect-error
			Object.entries(spellResources.slots).forEach(([level, { override }]) => {
				actorData.spellResources.slots[level].max = override || 0;
			});

			actorData.spellResources.points.max = spellResources.points.override || 0;
			// @ts-expect-error
			actorData.spellResources.inventions.max = spellResources.inventions.override || 0;
			// @ts-expect-error
			actorData.spellResources.artifactCharges.max = spellResources.artifactCharges.override || 0;

			return;
		}

		// Reset max values
		Object.entries(spellResources.slots).forEach(([level]) => {
			actorData.spellResources.slots[level].max = 0;
		});
		actorData.spellResources.points.max = 0;
		// @ts-expect-error
		actorData.spellResources.inventions.max = 0;
		// @ts-expect-error
		actorData.spellResources.artifactCharges.max = 0;

		const grantedResources = {
			slots: [] as Item.OfType<'class'>[],
			additionalSlots: [] as Item.OfType<'class'>[],
			points: [] as Item.OfType<'class'>[],
			inventions: [] as Item.OfType<'class'>[],
			artifactCharges: [] as Item.OfType<'class'>[],
		};

		Object.values(classes ?? {}).forEach((cls) => {
			const { progressionType, resource } = cls?.casting ?? {};
			if (!progressionType) return;

			if (progressionType === 'multiplier') grantedResources.slots.push(cls);
			else if (resource === 'artifactCharges') grantedResources.artifactCharges.push(cls);
			else if (resource === 'inventions') grantedResources.inventions.push(cls);
			else if (resource === 'points') grantedResources.points.push(cls);
			else if (resource === 'slots') grantedResources.additionalSlots.push(cls);
		});

		// Handle single typed classes
		if (grantedResources.slots.length === 1) {
			const cls = grantedResources.slots[0];
			const { slots: classSlots } = cls.casting!;

			Object.entries(classSlots ?? {}).forEach(([level, slotCount]) => {
				const { max, override } = actorData.spellResources.slots[level];
				actorData.spellResources.slots[level].max = override || (max || 0) + (slotCount || 0);
			});
		}

		if (grantedResources.points.length === 1) {
			const cls = grantedResources.points[0];
			const { points } = cls.casting!;
			const { max, override } = actorData.spellResources.points;

			actorData.spellResources.points.max = override || (max || 0) + (points || 0);
		}

		if (grantedResources.inventions.length === 1) {
			const cls = grantedResources.inventions[0];
			const { inventions } = cls.casting!;
			// @ts-expect-error
			const { max, override } = actorData.spellResources.inventions;

			// @ts-expect-error
			actorData.spellResources.inventions.max = override || (max || 0) + (inventions || 0);
		}

		if (grantedResources.artifactCharges.length === 1) {
			const cls = grantedResources.artifactCharges[0];
			const { charges } = cls.casting!;
			// @ts-expect-error
			const { max, override } = actorData.spellResources.artifactCharges;
			// @ts-expect-error
			actorData.spellResources.artifactCharges.max = override || (max || 0) + (charges || 0);
		}

		// Handle multi classed spellcasting for slots
		if (grantedResources.slots.length > 1) {
			const total = grantedResources.slots.reduce((acc, cls) => {
				const { classLevels } = cls;

				const progressionConfig = CONFIG.A5E.casterProgression[cls.casting!.casterType];
				if (!progressionConfig) return acc;

				let roundFunc = Math.floor;
				if (progressionConfig.roundUp && progressionConfig.roundUpMulti) roundFunc = Math.ceil;
				return acc + roundFunc(classLevels * progressionConfig.multiplier);
			}, 0);

			CONFIG.A5E.SPELL_SLOT_TABLE[total].forEach((slotCount, idx) => {
				const { max, override } = actorData.spellResources.slots[idx + 1];
				actorData.spellResources.slots[idx + 1].max = override || (max || 0) + (slotCount || 0);
			});
		}

		// Handle multi classed spellcasting for points
		if (grantedResources.points.length > 1) {
			// TODO: Class Documents - Based on Base reference table

			// Add mode handling
			grantedResources.points.forEach((cls) => {
				// TODO: Class Documents - Update to remove warlockA5E in the future
				const { points, multiclassMode } = cls.casting!;
				if (multiclassMode !== 'ADD') return;

				const { max, override } = actorData.spellResources.points;
				actorData.spellResources.points.max = override || (max || 0) + (points || 0);
			});
		}

		// Add additional spell slots
		grantedResources.additionalSlots.forEach((cls) => {
			const { slots } = cls.casting!;

			Object.entries(slots ?? {}).forEach(([level, slotCount]) => {
				const { max, override } = actorData.spellResources.slots[level];
				actorData.spellResources.slots[level].max = override || (max || 0) + (slotCount || 0);
			});
		});

		// Set max to 0 if not defined
		Object.values(actorData.spellResources.slots).forEach((slot: any) => {
			if (slot.max === undefined) slot.max = 0;
		});

		actorData.spellResources.points.max = spellResources.points.max ?? 0;
		// @ts-expect-error
		actorData.spellResources.inventions.max = spellResources.inventions.max ?? 0;
		// @ts-expect-error
		actorData.spellResources.artifactCharges.max = spellResources.artifactCharges.max ?? 0;

		// @ts-expect-error
		actorData.spellResources.maxSpellLevel = Object.values(classes).reduce((acc, cls) => {
			const { maxLevel } = cls?.casting ?? {};
			if (!maxLevel) return acc;

			acc[cls.slug] = maxLevel;
			return acc;
		}, {});
	}

	/** Prepare Resources for a char */
	prepareResources(this: Actor.OfType<'character'>) {
		const source = this._source.system.resources as any;

		const genericResources = foundry.utils.deepClone(source);
		delete genericResources.classResources;

		const classResourceData = source.classResources;

		const classResources = this.items.reduce((acc, i) => {
			if (!['class', 'archetype'].includes(i.type)) return acc;

			const resources = foundry.utils
				// @ts-expect-error
				.deepClone(i.resources.consumableResources)
				.filter((r) => r.displayOnCore);

			// @ts-expect-error
			const clsLevel = i.resources.level;

			resources.forEach((r) => {
				acc[r.slug] = {
					label: r.name,
					value: classResourceData[r.slug] ?? r.reference[clsLevel] ?? 0,
					max: r.reference[clsLevel] ?? 0,
					per: r.recovery,
					hideMax: false,
					recharge: {
						formula: '1d6',
						threshold: 6,
					},
				};
			});

			return acc;
		}, {});

		const resources = { ...genericResources, ...classResources };

		this.system.resources = resources;
	}

	/** ---------------------------------- */
	//  Derived Data Prep (NPC)
	/** ---------------------------------- */

	/** ---------------------------------- */
	//  Derived Data Prep (Party)
	/** ---------------------------------- */

	/** ================================================================= */
	// Apply Active Effects
	/** ================================================================= */

	/** Apply activeEffects to the actor with the phase 'applyAEs'. */
	override applyActiveEffects(phase: ActiveEffect.ChangePhase) {
		const ActiveEffect = foundry.documents.ActiveEffect.implementation;

		this._completedActiveEffectPhases.add(phase);

		const changes: any[] = [];
		const tokenChanges: any[] = [];

		const effectOptions =
			this.type === 'character'
				? game.a5e.activeEffects.options.character.allOptions
				: this.type === 'npc'
					? game.a5e.activeEffects.options.npc.allOptions
					: game.a5e.activeEffects.options.all.allOptions;

		for (const effect of this.allApplicableEffects()) {
			if (!effect.active) continue;

			for (const change of effect.system.changes) {
				if (change.key === '') continue;
				// Phase check
				const effectConfig = effectOptions[change.key];
				let registeredPhase = change.phase;
				if (effectConfig) {
					registeredPhase = CONFIG.A5E.ACTIVE_EFFECT_PHASES[effectConfig.phase] ?? change.phase;
				}

				if (registeredPhase !== phase) continue;

				const copy = foundry.utils.deepClone(change);
				// @ts-expect-error
				copy.effect = effect;

				// Keep Token changes separate for later application
				if (copy.key?.startsWith('@token.')) {
					copy.key = copy.key.slice(7);
					tokenChanges.push(copy);
				} else {
					changes.push(copy);
				}
			}

			if (phase === 'initial') {
				const statuses = effect.getStatuses();
				for (const statusId of statuses) this.statuses.add(statusId);
				effect.statuses = statuses;
			}
		}

		generateExpandedChanges(changes);
		changes.sort((a, b) => a.priority - b.priority);
		this.tokenActiveEffectChanges[phase] = tokenChanges;

		// Apply all changes
		const overrides = {};
		const replacementData = this.getRollData() ?? {};

		// TODO: Figure out why this fails on token npc
		// this.overrides ??= {};

		for (const change of changes) {
			// TODO: Adds support for `@original`
			const result = ActiveEffect.applyChange(this, change, {
				replacementData,
			});
			if (foundry.utils.isPlainObject(result)) Object.assign(overrides, result);
		}

		foundry.utils.mergeObject(this.overrides, foundry.utils.expandObject(overrides));
	}

	/** ================================================================= */
	// Data Update Helpers
	/** ================================================================= */

	/** Apply Multiple damages at ones */
	async applyBulkDamage(this: Creature, damageRolls) {
		const updates = {};
		const { value, temp } = this.system.attributes.hp;

		const totalDamage = damageRolls.reduce(
			(cumulativeDamage, [damage]) => cumulativeDamage + Math.floor(damage),
			0,
		);

		if (temp) {
			updates['system.attributes.hp'] = {
				temp: Math.clamp(temp - totalDamage, 0, temp),
				value: Math.clamp(value + temp - totalDamage, 0, value),
			};
		} else {
			updates['system.attributes.hp.value'] = Math.clamp(value - totalDamage, 0, value);
		}

		if (game.settings.get('a5e', 'enableCascadingDamageAndHealing')) {
			const delayDelta = game.settings.get('a5e', 'cascadingDamageAndHealingDelay') as number;
			let delay = 0;

			damageRolls.forEach(([damage, damageType]) => {
				setTimeout(async () => {
					await displayCascadingNumbers(this, 'damage', `-${damage}`, damageType);
				}, delay);

				delay += delayDelta;
			});
		}

		// @ts-expect-error
		Hooks.callAll('a5e.actorDamaged', this, {
			prevHp: { value, temp },
			damageRolls,
		});
		return this.update(updates);
	}

	/**
	 * Apply a certain amount of damage to the health pool for Actor, prioritizing temporary hp.
	 * Negative damage values will have no effect.
	 */
	async applyDamage(this: Creature, damage: number, damageType: string | null = null) {
		const updates: Record<string, any> = {};
		const { value, temp } = this.system.attributes.hp;
		damage = Math.floor(damage);

		if (temp) {
			updates['system.attributes.hp'] = {
				temp: Math.clamp(temp - damage, 0, temp),
				value: Math.clamp(value + temp - damage, 0, value),
			};
		} else {
			updates['system.attributes.hp.value'] = Math.clamp(value - damage, 0, value);
		}

		if (game.settings.get('a5e', 'enableCascadingDamageAndHealing')) {
			displayCascadingNumbers(this, 'damage', `-${damage}`, damageType);
		}

		// @ts-expect-error
		Hooks.callAll('a5e.actorDamaged', this, {
			prevHp: { value, temp },
			damage,
			damageType,
		});
		return this.update(updates);
	}

	/** Apply Multiple healing at ones */
	async applyBulkHealing(this: Creature, healingRolls) {
		const updates: Record<string, any> = {};
		const { value, max, temp } = this.system.attributes.hp;
		let showCascadingTemp = true;

		const { healing: healingTotal, temp: tempTotal } = healingRolls.reduce(
			(totalHealing, [healing, healingType]) => {
				if (healingType === 'temporaryHealing') totalHealing.temp += healing;
				else totalHealing.healing += healing;

				return totalHealing;
			},
			{ healing: 0, temp: 0 },
		);

		if (tempTotal && tempTotal <= temp) {
			ui.notifications.warn('A5E.ActionWarningTempHpNotOverwritten', {
				localize: true,
			});
			showCascadingTemp = false;
		} else {
			updates['system.attributes.hp.temp'] = tempTotal;
		}

		updates['system.attributes.hp.value'] = Math.clamp(value + healingTotal, value, max);

		if (game.settings.get('a5e', 'enableCascadingDamageAndHealing')) {
			const delayDelta = game.settings.get('a5e', 'cascadingDamageAndHealingDelay');
			let delay = 0;

			healingRolls.forEach(([healing, healingType]) => {
				if (!showCascadingTemp && healingType === 'temporaryHealing') return;

				setTimeout(async () => {
					await displayCascadingNumbers(this, 'healing', `+${healing}`, healingType);
				}, delay);

				delay += delayDelta;
			});
		}

		// @ts-expect-error
		Hooks.callAll('a5e.actorHealed', this, {
			prevHp: { value, temp },
			healingRolls,
		});
		return this.update(updates);
	}

	/**
	 * Apply a certain amount of healing to the health pool for Actor. Temporary healing can be set
	 * using a flag in the options object.
	 *
	 * When dealing with temporary hp, providing a value below the current temp hp of the target will
	 * trigger a warning and abort the update of the actor.
	 *
	 * Negative healing value are ignored.
	 */
	async applyHealing(this: Creature, healing: number, healingType?: string) {
		const updates = {};
		const { value, max, temp } = this.system.attributes.hp;
		// eslint-disable-next-line no-param-reassign
		healing = Math.floor(healing);

		if (healingType === 'temporaryHealing') {
			if (healing <= temp) {
				ui.notifications.warn('A5E.ActionWarningTempHpNotOverwritten', {
					localize: true,
				});
				return this;
			}

			updates['system.attributes.hp.temp'] = healing;
		} else {
			updates['system.attributes.hp.value'] = Math.clamp(value + healing, value, max);
		}

		if (game.settings.get('a5e', 'enableCascadingDamageAndHealing')) {
			displayCascadingNumbers(this, 'healing', `+${healing}`, healingType);
		}

		// @ts-expect-error
		Hooks.callAll('a5e.actorHealed', this, {
			prevHp: { value, temp },
			healing,
			healingType,
		});
		return this.update(updates);
	}

	/** ================================================================= */
	// Roll Data
	/** ================================================================= */

	/** @inheritdoc */
	override getRollData(item: BaseItemA5e | null = null) {
		const data = { ...super.getRollData() };

		// Call Sub Modules
		if (this.isCreature()) this.getCreatureRollData(data, item);

		return data;
	}

	/** ---------------------------------- */
	//  Roll Data (Creature)
	/** ---------------------------------- */

	/** Get Creature Roll Data */
	getCreatureRollData(this: Creature, data: Record<string, any>, item: BaseItemA5e | null = null) {
		const { abilities, skills } = this.system;

		data.prof = this.system.attributes.prof || 0;

		// Add a shortcut for abilities.<ability>.check.mod, abilities.<ability>.mod, and <ability>.mod
		Object.entries(abilities).reduce((acc, [key, ability]) => {
			acc.abilities ??= {};
			// @ts-expect-error
			acc.abilities[key] = { ...ability, mod: ability.check.mod };
			// @ts-expect-error
			acc[key] = { ...ability, mod: ability.check.mod };

			return acc;
		}, data);

		// Add similar shortcuts for skills
		Object.entries(skills).reduce((acc, [key, skill]) => {
			acc.skills ??= {};
			acc.skills[key] = skill;
			acc[key] = skill;

			return acc;
		}, data);

		data.finesse = {
			mod: Math.max(data.dex.mod, data.str.mod),
		};

		if (this.type === 'character') data.level = this.system.details.level;

		data.maneuverDC = this.system.attributes.maneuverDC;

		// Add item rollData
		if (item) {
			data.item = item.getRollData();
		}

		if (item && item.type === 'spell') {
			const spellBook = this.spellBooks?.get(item.system.spellBook!);
			if (spellBook) {
				data.spell = { mod: spellBook.stats.mod };
				data.spellcasting = { mod: spellBook.stats.mod };
				data.spellDC = spellBook.stats.dc;
			}
		}

		if (!data.spell || !data.spellDC) {
			data.spell = { mod: this._calculateSpellcastingMod() };
			data.spellcasting = { mod: data.spell.mod };
			// @ts-expect-error
			data.spellDC = this.system.attributes.spellDC;
		}

		// Inject target data
		const targets = [...game.user.targets];
		if (targets.length !== 1) return data;

		const target = targets[0]?.actor;
		if (target && target.uuid !== this.uuid) data.target = target.getRollData();

		// Call Sub Modules
		if (this.type === 'character') this.getCharRollData(data, item);

		return data;
	}

	/** Get Spellcasting modifier for char */
	_calculateSpellcastingMod(this: Creature) {
		const { abilities, attributes } = this.system;
		const spellcastingAbility = attributes.spellcasting || 'int';

		return abilities[spellcastingAbility].check.mod;
	}

	/** ---------------------------------- */
	//  Roll Data (Char)
	/** ---------------------------------- */

	/** Get Char Roll Data */
	getCharRollData(
		this: Actor.OfType<'character'>,
		data: Record<string, any>,
		item: BaseItemA5e | null = null,
	) {
		data.level = this.levels?.character ?? data.level ?? this.system.details.level;

		const resources = {};

		data.classes = Object.entries(this.classes ?? {}).reduce((acc, [slug, cls]) => {
			const classData = cls.getRollData()?.actorTransfer ?? {};
			acc[slug] = classData;

			Object.assign(resources, classData.resources);

			return acc;
		}, {});

		data.classResources = resources;

		return data;
	}

	/** ---------------------------------- */
	//  Roll Data (NPC)
	/** ---------------------------------- */

	/** ---------------------------------- */
	//  Roll Data (Party)
	/** ---------------------------------- */

	/** ================================================================= */
	// Resources Reset Handlers
	/** ================================================================= */

	/** ---------------------------------- */
	// Resources Reset Handlers (Creature)
	/** ---------------------------------- */

	/** Trigger Rest for Creatures */
	async triggerRest(this: Creature, restOptions = {} as RestManager.Data) {
		let restData = restOptions;

		if (foundry.utils.isEmpty(restOptions)) {
			const title = localize('A5E.rest.configurationPrompt', {
				name: this.name,
			});
			const dialog = new GenericConfigDialog(this, title, RestDialog);
			await dialog.render(true);
			restData = await dialog?.promise;
		}

		if (!restData) return;
		const restManger = new RestManager(this, restData);

		await restManger.rest();
	}

	/** Update Death Saving Data for Creatures */
	async updateDeathSavingThrowFigures(this: Creature, roll: D20Roll) {
		const { death, fatigue, strife } = this.system.attributes;
		const { success, failure } = death;
		const d20Result = roll.dice[0].total!;

		const updates: Record<string, any> = {
			'system.attributes.death': { success, failure },
		};

		if (d20Result === 1) {
			if (game.settings.get('a5e', '5eStyleDeathSaves')) {
				updates['system.attributes.death'].failure += 2;
			} else {
				updates['system.attributes.death'].failure += 1;
				updates['system.attributes.fatigue'] = fatigue + 1;
				updates['system.attributes.strife'] = strife + 1;
			}
		} else if (d20Result === 20) updates['system.attributes.hp.value'] = 1;
		else if (d20Result < (this.getFlag('a5e', 'deathSaveThreshold') || 10))
			updates['system.attributes.death'].failure += 1;
		else updates['system.attributes.death'].success += 1;

		await this.update(updates);
	}

	// TODO: Types - Narrow resource type
	/** Recharge a generic resource given it's id */
	async rechargeGenericResource(this: Creature, resource: string) {
		if (!this.system.resources[resource]) return;

		// eslint-disable-next-line max-len
		const max = getDeterministicBonus(this.system.resources[resource].max, this.getRollData()) ?? 0;
		const current = this.system.resources[resource].value;
		const formula = this.system.resources[resource]?.recharge?.formula || '1d6';
		const threshold = this.system.resources[resource]?.recharge?.threshold || 6;
		const rechargeType = this.system.resources[resource]?.recharge?.rechargeType || 'custom';
		const rechargeAmount = this.system.resources[resource]?.recharge?.rechargeAmount || '1';
		const updatePath = `system.resources.${resource}.value`;

		// Recharge Roll
		const rechargeRoll = await new Roll(formula, this.getRollData()).evaluate();

		// TODO: Chat cards - Make the message prettier
		rechargeRoll.toMessage();

		if (rechargeRoll.total < threshold) return;

		if (rechargeType === 'min') await this.update({ [updatePath]: 0 });
		else if (rechargeType === 'max') await this.update({ [updatePath]: max });
		else {
			const rechargeAmountRoll = await new Roll(rechargeAmount, this.getRollData()).evaluate();

			// TODO: Add the roll back in when the custom recharge amount config is added.
			// rechargeAmountRoll.toMessage();

			await this.update({
				[updatePath]: Math.min(max, current + rechargeAmountRoll.total),
			});
		}
	}

	/** ---------------------------------- */
	// Resources Reset Handlers (Char)
	/** ---------------------------------- */

	/** Recover exertion for chars using hitDice */
	async recoverExertionUsingHitDice(this: Actor.OfType<'character'>) {
		const { current, max } = this.system.attributes.exertion;

		// @ts-expect-error
		const [lowestAvailableHitDie] = Object.entries(this.system.attributes.hitDice ?? {}).find(
			// @ts-expect-error
			([, { current: c, total: t }]) => c > 0 && t > 0,
		);

		if (!lowestAvailableHitDie) {
			ui.notifications.warn(`${this.name} has no hit dice remaining.`);
			return;
		}

		const roll = new Roll('1d4');

		// TODO: Chat Cards - Make the message prettier
		await roll.toMessage();
		const newExertion = Math.min((current ?? 0) + (roll.total ?? 0), max);
		const newHitDieCount = this.system.attributes.hitDice[lowestAvailableHitDie].current - 1;

		await this.update({
			// @ts-expect-error
			'system.attributes': {
				'exertion.current': newExertion,
				[`hitDice.${lowestAvailableHitDie}.current`]: newHitDieCount,
			},
		});
	}

	/** Recover psionic points for chars using hitDice */
	async recoverPsionicPointsUsingHitDice(this: Actor.OfType<'character'>) {
		const { current, max } = this.system.spellResources.points;

		const dieData = Object.entries(this.system.attributes.hitDice ?? {}).find(
			// @ts-expect-error
			([, { current: c, total: t }]) => c > 0 && t > 0,
		);

		if (!dieData) {
			ui.notifications.warn(`${this.name} has no hit dice remaining.`);
			return;
		}

		const [die] = dieData;
		const roll = new Roll(`1${die}`);

		// TODO: Chat Cards - Make the message prettier
		await roll.toMessage();

		//@ts-expect-error
		const newPsionicPoints = Math.min((current ?? 0) + (roll.total ?? 0), max);
		this.HitDiceManager.consumeHitDice({ [die]: 1 });

		this.update({
			// @ts-expect-error
			'system.spellResources.points.current': newPsionicPoints,
		});
	}

	/** ---------------------------------- */
	// Resources Reset Handlers (NPC)
	/** ---------------------------------- */

	/** ---------------------------------- */
	// Resources Reset Handlers (Party)
	/** ---------------------------------- */
	async triggerLongRest(this: Actor.OfType<'party'>, restOptions = {} as RestManager.Data) {
		if (!this.isParty()) return;

		let restData = restOptions;
		if (foundry.utils.isEmpty(restOptions)) {
			const title = localize('A5E.rest.configurationPrompt', {
				name: this.name,
			});
			const dialog = new GenericConfigDialog(this, title, RestDialog);
			await dialog.render(true);
			restData = await dialog?.promise;
		}

		const members = this.members;
		await Promise.all(
			members.map(async (a) => {
				a.triggerRest(restData);
			}),
		);
	}

	/** ================================================================= */
	// Sheet Toggles
	/** ================================================================= */

	/** ---------------------------------- */
	// Sheet Toggles (Char)
	/** ---------------------------------- */

	/** Toggle Inspiration for a char */
	toggleInspiration(this: Actor.OfType<'character'>) {
		const currentState = this.system.attributes.inspiration;
		// @ts-expect-error
		this.update({ 'system.attributes.inspiration': !currentState });

		if (currentState) {
			// @ts-expect-error
			Hooks.callAll('a5e.inspirationUsed', this);
		} else {
			// @ts-expect-error
			Hooks.callAll('a5e.inspirationGained', this);
		}
	}

	/** ---------------------------------- */
	// Sheet Toggles (NPC)
	/** ---------------------------------- */

	/** Toggle Elite for a char */
	toggleElite() {
		// @ts-expect-error
		this.update({ 'system.details.elite': !this.system.details.elite });
	}

	/** ---------------------------------- */
	// Sheet Toggles (Party)
	/** ---------------------------------- */

	/** ================================================================= */
	// Roll Handlers
	/** ================================================================= */

	/** ---------------------------------- */
	// Roll Handlers (Creature)
	/** ---------------------------------- */

	/**
	 * Rolls an ability check for a given skill. A dialog is presented to the user so that they can
	 * perform choose the size of the expertise die to use for the check.
	 */
	async rollAbilityCheck(
		this: Creature,
		abilityKey: string,
		options: AbilityCheckRollOptions = {},
	) {
		let dialogData: any;

		if (options.skipRollDialog) dialogData = this.getDefaultAbilityCheckData(abilityKey, options);
		else dialogData = await this.#showAbilityCheckPrompt(abilityKey, options);

		if (!dialogData) return null;

		const { expertiseDie, rollFormula, rollMode, visibilityMode } = dialogData;

		const rollPreparationManager = new RollPreparationManager({
			actor: this,
			rolls: [
				{
					ability: abilityKey,
					// @ts-expect-error
					expertiseDie,
					rollFormula,
					rollMode,
					type: 'abilityCheck',
				},
			],
		});

		const rolls = await rollPreparationManager.prepareRolls();

		const chatData = {
			author: game.user?.id,
			// @ts-expect-error
			speaker: ChatMessage.getSpeaker({ actor: this }),
			sound: CONFIG.sounds.dice,
			// @ts-expect-error
			rolls: rolls.map(({ roll }) => roll),
			// @ts-expect-error
			rollMode: visibilityMode ?? game.settings.get('core', 'messageMode'),
			system: {
				actorId: this.uuid,
				actorName: this.name,
				img: this.token?.texture.src ?? this.img,
				// @ts-expect-error
				rollData: rolls.map(({ roll, ...rollData }) => rollData),
				rollType: 'abilityCheck',
			},
			type: 'roll',
		};

		const hookData = {
			abilityKey,
			expertiseDie,
			rollFormula,
			rollMode,
		};

		// @ts-expect-error
		Hooks.callAll('a5e.rollAbilityCheck', this, hookData, rolls);

		// @ts-expect-error
		const finalRollMode = visibilityMode ?? game.settings.get('core', 'messageMode');
		if (finalRollMode === 'gm') {
			const gmUsers = game.users.filter((u) => u.isGM).map((u) => u.id);
			// @ts-expect-error
			chatData.whisper = [...gmUsers, game.user.id];
		}

		// @ts-expect-error
		ChatMessage.applyMode(chatData, finalRollMode);
		// @ts-expect-error
		const chatCard = await ChatMessage.create(chatData);
		return chatCard;
	}

	getDefaultAbilityCheckData(
		this: Creature,
		abilityKey: string,
		options: AbilityCheckRollOptions = {},
	) {
		const defaultRollMode = options?.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;

		const ability = this.system.abilities[abilityKey].check;
		const expertiseDie = RollOverrideManager.resolveExpertiseDie(ability).value;

		const rollMode = RollOverrideManager.resolveRollMode(ability, defaultRollMode).value;

		const rollFormula = getRollFormula(this, {
			ability: abilityKey,
			expertiseDie,
			rollMode,
			situationalMods: options.situationalMods,
			selectedAbilityBonuses: this.BonusesManager?.getDefaultSelections('abilities', {
				abilityKey,
				abilityType: 'check',
			}),
			type: 'abilityCheck',
		});

		return {
			expertiseDie,
			rollFormula,
			rollMode,
			visibilityMode: options.visibilityMode ?? null,
		};
	}

	async #showAbilityCheckPrompt(
		this: Creature,
		abilityKey: string,
		rollOptions: AbilityCheckRollOptions = {},
		dialogOptions = {},
	) {
		const title = localize('A5E.abilities.headings.checkPromptTitle', {
			name: this.name,
			ability: localize(CONFIG.A5E.abilities[abilityKey]),
		});

		const dialog = new GenericConfigDialog(
			this,
			title,
			AbilityCheckRollDialog,
			{ abilityKey, options: rollOptions },
			dialogOptions,
		);

		await dialog.render(true);
		const dialogData = await dialog.promise;

		return dialogData;
	}

	async rollDeathSavingThrow(this: Creature, options: SavingThrowRollOptions = {}) {
		options.saveType = 'death';
		options.expertiseDice ??= 0;
		options.visibilityMode ??= 'gm';

		if (game.settings.get('a5e', 'blindDeathSaves')) {
			options.visibilityMode = 'blind';
		}

		this.rollSavingThrow(undefined, options);
	}

	async rollHitDice(this: Creature, dieSize: string | null = null, quantity = 1, heal = true) {
		const chatCard = await this.HitDiceManager?.rollHitDice(dieSize, quantity, heal);
		return chatCard;
	}

	async rollSavingThrow(this: Creature, abilityKey?: string, options: SavingThrowRollOptions = {}) {
		let dialogData: any;

		if (options.skipRollDialog) dialogData = this.getDefaultSavingThrowData(abilityKey, options);
		else dialogData = await this.#showSavingThrowPrompt(abilityKey, options);

		if (dialogData === null) return null;

		const { expertiseDie, rollFormula, rollMode, saveType, visibilityMode } = dialogData;

		const rollPreparationManager = new RollPreparationManager({
			actor: this,
			rolls: [
				{
					// @ts-expect-error
					ability: abilityKey,
					expertiseDie,
					rollFormula,
					rollMode,
					saveType,
					type: 'savingThrow',
				},
			],
		});

		const rolls = await rollPreparationManager.prepareRolls();

		const chatData = {
			author: game.user?.id,
			// @ts-expect-error
			speaker: ChatMessage.getSpeaker({ actor: this }),
			sound: CONFIG.sounds.dice,
			// @ts-expect-error
			rolls: rolls.map(({ roll }) => roll),
			// @ts-expect-error
			rollMode: visibilityMode ?? game.settings.get('core', 'messageMode'),
			system: {
				actorId: this.uuid,
				actorName: this.name,
				img: this.token?.texture.src ?? this.img,
				// @ts-expect-error
				rollData: rolls.map(({ roll, ...rollData }) => rollData),
				rollType: 'savingThrow',
			},
			type: 'roll',
		};

		const hookData = {
			abilityKey,
			expertiseDie,
			rollFormula,
			rollMode,
		};

		if (options?.saveType === 'death') {
			// @ts-expect-error
			Hooks.callAll('a5e.rollDeathSavingThrow', this, hookData, rolls);
			// @ts-expect-error
			this.updateDeathSavingThrowFigures(rolls.map(({ roll }) => roll)[0]);
		} else {
			// @ts-expect-error
			Hooks.callAll('a5e.rollSavingThrow', this, hookData, rolls);
		}

		// @ts-expect-error
		const finalRollMode = visibilityMode ?? game.settings.get('core', 'messageMode');
		if (finalRollMode === 'gm') {
			const gmUsers = game.users.filter((u) => u.isGM).map((u) => u.id);
			// @ts-expect-error
			chatData.whisper = [...gmUsers, game.user.id];
		}

		// @ts-expect-error
		ChatMessage.applyMode(chatData, visibilityMode ?? game.settings.get('core', 'messageMode'));
		// @ts-expect-error
		const chatCard = await ChatMessage.create(chatData);
		return chatCard;
	}

	getDefaultSavingThrowData(
		this: Creature,
		abilityKey: string | undefined,
		options: SavingThrowRollOptions = {},
	) {
		const defaultRollMode = options?.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;

		const src = abilityKey ? this.system.abilities[abilityKey].save : this.system.rolls.death;

		const rollMode = RollOverrideManager.resolveRollMode(src, defaultRollMode).value;
		const expertiseDie = RollOverrideManager.resolveExpertiseDie(src).value;

		const rollFormula = getRollFormula(this, {
			ability: abilityKey,
			expertiseDie,
			rollMode,
			saveType: options.saveType,
			situationalMods: options.situationalMods,
			selectedAbilityBonuses: this.BonusesManager?.getDefaultSelections('abilities', {
				abilityKey,
				abilityType: 'save',
			}),
			type: 'savingThrow',
		});

		return {
			expertiseDie,
			rollMode,
			rollFormula,
			visibilityMode: options.visibilityMode ?? null,
		};
	}

	async #showSavingThrowPrompt(
		this: Creature,
		abilityKey: string | undefined,
		rollOptions: SavingThrowRollOptions = {},
		dialogOptions: Record<string, any> = {},
	) {
		let title: string;

		if (rollOptions.saveType === 'death') {
			title = localize('A5E.DeathSavingThrowPromptTitle', { name: this.name });
		} else {
			title = localize('A5E.rollLabels.prompts.savingThrowPromptTitle', {
				name: this.name,
				ability: localize(CONFIG.A5E.abilities[abilityKey!]),
			});
		}

		const dialog = new GenericConfigDialog(
			this,
			title,
			SavingThrowRollDialog,
			{ abilityKey, options: rollOptions },
			dialogOptions,
		);

		await dialog.render(true);
		const dialogData = await dialog.promise;

		return dialogData;
	}

	/**
	 * Rolls a skill check for a given skill. A dialog is presented to the user so that they can
	 * perform additional configuration, such as choosing an ability score for the check.
	 */
	async rollSkillCheck(this: Creature, skillKey: string, options: SkillCheckRollOptions = {}) {
		let dialogData: any;

		options.expertiseDice ??= 0;

		if (options.skipRollDialog) dialogData = this.getDefaultSkillCheckData(skillKey, options);
		else dialogData = await this.#showSkillCheckPrompt(skillKey, options);

		if (!dialogData) return null;

		const { abilityKey, expertiseDie, rollFormula, rollMode, visibilityMode } = dialogData;

		const rollPreparationManager = new RollPreparationManager({
			actor: this,
			rolls: [
				{
					ability: abilityKey,
					// @ts-expect-error
					expertiseDie,
					rollFormula,
					rollMode,
					skill: skillKey,
					type: 'skillCheck',
				},
			],
		});

		const rolls = await rollPreparationManager.prepareRolls();

		const chatData = {
			author: game.user?.id,
			// @ts-expect-error
			speaker: ChatMessage.getSpeaker({ actor: this }),
			sound: CONFIG.sounds.dice,
			// @ts-expect-error
			rolls: rolls.map(({ roll }) => roll),
			// @ts-expect-error
			rollMode: visibilityMode ?? game.settings.get('core', 'messageMode'),
			system: {
				actorId: this.uuid,
				actorName: this.name,
				img: this.token?.texture.src ?? this.img,
				// @ts-expect-error
				rollData: rolls.map(({ roll, ...rollData }) => rollData),
				rollType: 'skillCheck',
			},
			type: 'roll',
		};

		const hookData = {
			abilityKey,
			expertiseDie,
			rollFormula,
			rollMode,
			skillKey,
		};

		// @ts-expect-error
		Hooks.callAll('a5e.rollSkillCheck', this, hookData, rolls);

		// @ts-expect-error
		const finalRollMode = visibilityMode ?? game.settings.get('core', 'messageMode');
		if (finalRollMode === 'gm') {
			const gmUsers = game.users.filter((u) => u.isGM).map((u) => u.id);
			// @ts-expect-error
			chatData.whisper = [...gmUsers, game.user.id];
		}

		// @ts-expect-error
		ChatMessage.applyMode(chatData, visibilityMode ?? game.settings.get('core', 'messageMode'));
		// @ts-expect-error
		const chatCard = await ChatMessage.create(chatData);
		return chatCard;
	}

	getDefaultSkillCheckData(this: Creature, skillKey: string, options: SkillCheckRollOptions = {}) {
		const skill = this.system.skills[skillKey];
		const abilityKey = options?.abilityKey ?? skill.ability;
		const ability = this.system.abilities[abilityKey]?.check;
		const defaultRollMode = options?.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;
		const defaultExpertiseDie = options?.expertiseDice ?? 0;

		const others = [] as any[];
		if (ability) others.push({ type: 'ability', src: ability });
		if (defaultExpertiseDie && options.speciality) {
			others.push({
				type: 'speciality',
				src: {
					expertiseDice: defaultExpertiseDie || 0,
					expertiseDieSources: { override: null, sources: [options.speciality] },
				},
			});
		}

		const expertiseDie = RollOverrideManager.resolveExpertiseDie(skill, { others }).value;

		const rollMode = RollOverrideManager.resolveRollMode(skill, defaultRollMode, {
			others: [{ type: 'ability', src: ability }],
		}).value;

		const rollFormula = getRollFormula(this, {
			ability: abilityKey,
			expertiseDie,
			minRoll: options.minRoll ?? skill.minRoll,
			// @ts-expect-error
			proficient: skill.proficient,
			type: 'skillCheck',
			rollMode,
			skill: skillKey,
			selectedAbilityBonuses: this.BonusesManager?.getDefaultSelections('abilities', {
				abilityKey,
				abilityType: 'check',
			}),
			selectedSkillBonuses: this.BonusesManager?.getDefaultSelections('skills', {
				skillKey,
				abilityKey,
			}),
			situationalMods: options.situationalMods,
		});

		return {
			abilityKey,
			rollMode,
			expertiseDie,
			rollFormula,
			visibilityMode: options.visibilityMode ?? null,
		};
	}

	async #showSkillCheckPrompt(
		this: Creature,
		skillKey: string,
		rollOptions: SkillCheckRollOptions = {},
		dialogOptions = {},
	) {
		const title = localize('A5E.skillLabels.checks.promptTitle', {
			name: this.name,
			skill: localize(CONFIG.A5E.skills[skillKey]),
		});

		const dialog = new GenericConfigDialog(
			this,
			title,
			SkillCheckRollDialog,
			{ skillKey, options: rollOptions },
			dialogOptions,
		);

		await dialog.render(true);
		const dialogData = await dialog.promise;

		return dialogData;
	}

	async createConcentrationCheckCard(this: Creature, damage: number) {
		const dc = Math.clamp(Math.floor(damage / 2), 10, 30);

		let content = `${this.name} has taken ${damage} damage. `;
		content += 'Please roll a concentration saving throw. <br />';
		content += `[[/save ability="con" type="concentration" dc="${dc}"]]`;

		const chatData = {
			author: game.user?.id,
			flavor: this.name,
			// @ts-expect-error
			speaker: ChatMessage.getSpeaker({ actor: this }),
			style: CONST.CHAT_MESSAGE_STYLES.OTHER,
			sound: CONFIG.sounds.notification,
			content,
		};

		await ChatMessage.create(chatData);
	}

	/** ================================================================= */
	// Config Handlers
	/** ================================================================= */
	addBonus(this: Creature, type = 'damage') {
		const bonuses = foundry.utils.duplicate(this._source.system.bonuses[type] ?? {});

		if (!Object.keys(CONFIG.A5E.bonusTypes)?.includes(type)) return;

		this.update({
			[`system.bonuses.${type}`]: {
				...bonuses,
				[foundry.utils.randomID()]: {},
			},
		});
	}

	#configure(this: Creature, key, title, data, options) {
		if (!this.isOwner) return;

		const component = this.#configDialogMap[key];
		let dialog: GenericConfigDialog;

		if (key === 'ability') dialog = this.dialogs.abilities[data.abilityKey];
		else if (key === 'skill') dialog = this.dialogs.skills[data.skillKey];
		else if (Object.values(CONFIG.A5E.bonusDialogKeys).includes(key)) {
			dialog = this.dialogs.bonuses[data.bonusID];
		} else dialog = this.dialogs[key];

		if (!dialog) {
			dialog = new GenericConfigDialog(this, title, component, data, options);

			if (key === 'ability') this.dialogs.abilities[data.abilityKey] = dialog;
			else if (key === 'skill') this.dialogs.skills[data.skillKey] = dialog;
			else if (Object.values(CONFIG.A5E.bonusDialogKeys).includes(key)) {
				this.dialogs.bonuses[data.bonusID] = dialog;
			} else this.dialogs[key] = dialog;
		}

		dialog?.render(true);
	}

	configureAbilityScore(this: Creature, data: Record<string, any> = {}, options = {}) {
		const title = localize('A5E.abilities.headings.checkPromptTitle', {
			name: this.name,
			ability: localize(CONFIG.A5E.abilities[data.abilityKey]),
		});

		this.#configure('ability', title, data, options);
	}

	configureAlignment(this: Creature, data: Record<string, any> = {}, options = {}) {
		const title = localize('A5E.traits.headings.configurationPrompt', {
			name: this.name,
		});

		data.heading ??= 'A5E.traits.headings.alignments';
		data.propertyKey ??= 'system.traits.alignment';
		data.configObject ??= CONFIG.A5E.alignments;
		data.type ??= 'alignment';

		this.#configure('alignment', title, data, options);
	}

	configureArmorClass(this: Creature, data: Record<string, any> = {}, options = {}) {
		const title = localize('A5E.armorClass.headings.acConfigurationPrompt', {
			name: this.name,
		});
		this.#configure('armorClass', title, data, options);
	}

	configureArmorProficiencies(this: Creature, data: Record<string, any> = {}, options = {}) {
		const title = localize('A5E.armorClass.headings.proficienciesConfigurationPrompt', {
			name: this.name,
		});

		data.heading ??= 'A5E.armorClass.headings.proficiencies';
		data.propertyKey ??= 'system.proficiencies.armor';
		data.configObject ??= CONFIG.A5E.armor;
		data.type ??= 'armorTypes';

		this.#configure('armor', title, data, options);
	}

	configureConditionImmunities(this: Creature, data: Record<string, any> = {}, options = {}) {
		const title = localize('A5E.conditions.immunitiesConfigurationPrompt', {
			name: this.name,
		});

		data.heading ??= 'A5E.conditions.immunities';
		data.configObject ??= CONFIG.A5E.conditions;
		data.propertyKey ??= 'system.traits.conditionImmunities';
		data.type ??= 'conditionImmunities';

		this.#configure('conditionImmunities', title, data, options);
	}

	configureCreatureTypes(this: Creature, data: Record<string, any> = {}, options = {}) {
		const title = localize('A5E.details.creature.headings.typesConfigurationPrompt', {
			name: this.name,
		});

		data.heading ??= 'A5E.details.creature.labels.types';
		data.configObject ??= CONFIG.A5E.creatureTypes;
		data.propertyKey ??= 'system.details.creatureTypes';
		data.type ??= 'creatureTypes';

		this.#configure('types', title, data, options);
	}

	configureBonus(this: Creature, bonusID: string, type = 'damage') {
		const dialogKey = CONFIG.A5E.bonusDialogKeys[type];
		if (!dialogKey) return;

		const dialogName = `${this.name} ${localize(CONFIG.A5E.bonusLabels[type]?.dialogName ?? type)}`;
		this.#configure(dialogKey, dialogName, { bonusID }, {});
	}

	configureCreatureTerrains(this: Creature, data: Record<string, any> = {}, options = {}) {
		data.heading ??= 'A5E.CreatureTerrainsLabel';
		data.configObject ??= CONFIG.A5E.terrainTypes;
		data.propertyKey ??= 'system.details.terrain';
		data.type ??= 'creatureTerrains';

		this.#configure('terrain', `${this.name}: Configure Creature Terrains`, data, options);
	}

	configureDamageImmunities(this: Creature, data: Record<string, any> = {}, options = {}) {
		const title = localize('A5E.traits.headings.damage.immunitiesConfigurationPrompt', {
			name: this.name,
		});

		data.heading ??= 'A5E.damage.headings.typePlural';
		data.configObject ??= CONFIG.A5E.damageTypes;
		data.propertyKey ??= 'system.traits.damageImmunities';
		data.type ??= 'damageImmunities';

		this.#configure('damageImmunities', title, data, options);
	}

	configureDamageResistances(this: Creature, data: Record<string, any> = {}, options = {}) {
		const title = localize('A5E.traits.headings.damage.resistancesConfigurationPrompt', {
			name: this.name,
		});

		data.heading ??= 'A5E.damage.headings.typePlural';
		data.configObject ??= CONFIG.A5E.damageTypes;
		data.propertyKey ??= 'system.traits.damageResistances';
		data.type ??= 'damageResistances';

		this.#configure('damageResistances', title, data, options);
	}

	configureDamageVulnerabilities(this: Creature, data: Record<string, any> = {}, options = {}) {
		const title = localize('A5E.traits.headings.damage.vulnerabilitiesConfigurationPrompt', {
			name: this.name,
		});

		data.heading ??= 'A5E.damage.headings.typePlural';
		data.configObject ??= CONFIG.A5E.damageTypes;
		data.propertyKey ??= 'system.traits.damageVulnerabilities';
		data.type ??= 'damageVulnerabilities';

		this.#configure('damageVulnerabilities', title, data, options);
	}

	configureHealth(
		this: Creature,
		data: Record<string, any> = {},
		options: Record<string, any> = {},
	) {
		const title = localize('A5E.hitPoints.configurationPrompt', {
			name: this.name,
		});
		options.width ??= 380;
		this.#configure('health', title, data, options);
	}

	configureInitiative(
		this: Creature,
		data: Record<string, any> = {},
		options: Record<string, any> = {},
	) {
		const title = localize('A5E.initiative.configurationPrompt', {
			name: this.name,
		});
		this.#configure('initiative', title, data, {
			...options,
			width: options.width ?? 432,
		});
	}

	configureLanguages(this: Creature, data: Record<string, any> = {}, options = {}) {
		const title = localize('A5E.details.languagesConfigurationPrompt', {
			name: this.name,
		});

		data.heading ??= 'A5E.details.languages';
		data.configObject ??= CONFIG.A5E.languages;
		data.propertyKey ??= 'system.proficiencies.languages';
		data.type ??= 'languages';

		this.#configure('languages', title, data, options);
	}

	configureMovement(this: Creature, data: Record<string, any> = {}, options = {}) {
		const title = localize('A5E.details.movement.configurationPrompt', {
			name: this.name,
		});
		this.#configure('movement', title, data, options);
	}

	configureManeuverTraditions(this: Creature, data: Record<string, any> = {}, options = {}) {
		const title = localize('A5E.maneuvers.headings.configurationPrompt', {
			name: this.name,
		});

		data.heading ??= 'A5E.maneuvers.headings.traditionPlural';
		data.configObject ??= CONFIG.A5E.maneuverTraditions;
		data.propertyKey ??= 'system.proficiencies.traditions';
		data.type ??= 'maneuverTraditions';

		this.#configure('maneuverTraditions', title, data, options);
	}

	configureSenses(this: Creature, data: Record<string, any> = {}, options = {}) {
		const title = localize('A5E.senses.configurationPrompt', {
			name: this.name,
		});
		this.#configure('senses', title, data, options);
	}

	configureSizeCategory(this: Creature, data: Record<string, any> = {}, options = {}) {
		const title = localize('A5E.traits.size.categoryConfigurationPrompt', {
			name: this.name,
		});

		data.heading ??= 'A5E.traits.size.category';
		data.configObject ??= CONFIG.A5E.actorSizes;
		data.propertyKey ??= 'system.traits.size';
		data.type ??= 'size';

		this.#configure('size', title, data, options);
	}

	configureSkill(this: Creature, data: Record<string, any> = {}, options = { width: 440 }) {
		const title = localize('A5E.bonuses.labels.skillConfigurationPrompt', {
			name: this.name,
			skill: localize(CONFIG.A5E.skills[data.skillKey]),
		});

		this.#configure('skill', title, data, options);
	}

	configureToolProficiencies(this: Creature, data: Record<string, any> = {}, options = {}) {
		const title = localize('A5E.tools.proficienciesConfigurationPrompt', {
			name: this.name,
		});

		data.heading ??= 'A5E.ToolProficiencies';
		data.configObject ??= CONFIG.A5E.tools;
		data.propertyKey ??= 'system.proficiencies.tools';
		data.type ??= 'tools';

		this.#configure('tools', title, data, options);
	}

	configureWeaponProficiencies(this: Creature, data: Record<string, any> = {}, options = {}) {
		const title = localize('A5E.weapons.proficienciesConfigurationPrompt', {
			name: this.name,
		});

		data.heading ??= 'A5E.WeaponPlural';
		data.configObject ??= CONFIG.A5E.weapons;
		data.propertyKey ??= 'system.proficiencies.weapons';
		data.type ??= 'weapons';

		this.#configure('weapons', title, data, options);
	}

	async deleteBonus(this: Creature, id: string, type = 'damage') {
		// Close dialog
		const dialog = this.dialogs.bonuses[id];
		await dialog?.close();
		delete this.dialogs.bonuses[id];

		await this.update({
			[`system.bonuses.${type}`]: {
				[`${id}`]: _del,
			},
		});
	}

	duplicateBonus(this: Creature, id: string, type = 'damage') {
		let defaultLabel: string;
		const bonuses = foundry.utils.duplicate(this._source.system.bonuses[type] ?? {});

		if (foundry.utils.isEmpty(bonuses)) return;

		const newBonus = foundry.utils.duplicate(this.system.bonuses[type][id]);

		if (type === 'damage') defaultLabel = localize('A5E.NewDamageBonus');
		else if (type === 'healing') defaultLabel = localize('A5E.NewHealingBonus');
		else defaultLabel = 'New Bonus';

		newBonus.label = `${newBonus.label || defaultLabel} (Copy)`;

		this.update({
			[`system.bonuses.${type}`]: {
				...bonuses,
				[foundry.utils.randomID()]: newBonus,
			},
		});
	}

	/** ================================================================= */
	// Token Handlers
	/** ================================================================= */
	override async modifyTokenAttribute(
		attribute: string,
		value: number,
		isDelta: boolean,
		isBar: boolean,
	): Promise<this | undefined> {
		if (attribute === 'attributes.hp') {
			const hp = foundry.utils.getProperty(this.system, attribute);
			// @ts-expect-error
			const hpPool = hp.value + hp.temp;
			const delta = hpPool - value;

			if (isDelta) {
				// @ts-expect-error
				return value <= 0 ? this.applyDamage(-1 * value) : this.applyHealing(value);
			}

			// @ts-expect-error
			return delta <= 0 ? this.applyHealing(-1 * delta) : this.applyDamage(delta);
		}

		return super.modifyTokenAttribute(attribute, value, isDelta, isBar);
	}

	/** ================================================================= */
	// Misc Handlers
	/** ================================================================= */

	/** ---------------------------------- */
	// Misc Handlers (Char)
	/** ---------------------------------- */

	/** Fix nested uuids in a grant */
	async _fixNestedUuids(this: Actor.OfType<'character'>) {
		const actorData = this.toObject();
		let modified = false;

		function fixNestedUuids(obj) {
			if (typeof obj !== 'object' || obj === null) return;

			for (const key in obj) {
				const value = obj[key];

				// Check if this is the problematic structure: {uuid: {uuid: "...", ...}, ...}
				if (key === 'uuid' && typeof value === 'object' && value !== null) {
					if (value.uuid && typeof value.uuid === 'string') {
						const innerUuid = value.uuid;
						const limitedReselection = value.limitedReselection;
						const selectionLimit = value.selectionLimit;

						obj.uuid = innerUuid;

						if (obj.limitedReselection === undefined && limitedReselection !== undefined) {
							obj.limitedReselection = limitedReselection;
						}
						if (obj.selectionLimit === undefined && selectionLimit !== undefined) {
							obj.selectionLimit = selectionLimit;
						}

						modified = true;
					}
				} else if (typeof value === 'object') {
					// Recursively check nested objects
					fixNestedUuids(value);
				}
			}
		}

		fixNestedUuids(actorData);

		if (modified) {
			await this.update(actorData);
			console.log(`A5e | Fixed nested UUIDs for actor: ${this.name}`);
		}
	}

	/** ---------------------------------- */
	// Misc Handlers (Party)
	/** ---------------------------------- */

	/** Distribute coins on a party */
	async distributeCoins(this: Actor.OfType<'party'>) {
		if (!this.isParty()) return;

		const config = CONFIG.A5E.currencyToCopper;
		const coins = this.system.currency;
		const members = this.members;
		const count = members.length;
		const totalCopper = Object.entries(coins ?? {}).reduce((acc, [curr, value]) => {
			if (curr === 'cr') return acc;
			return acc + (config[curr]?.(value ?? 0) ?? 0);
		}, 0);

		const share: Record<string, number> = {
			cr: coins.cr ? Math.trunc(coins.cr / count) : 0,
		};

		let remaining = Math.floor(totalCopper / count);

		if (remaining === 0 && share.cr === 0) {
			ui.notifications.warn('Nothing to Share');
			return;
		}

		const remainder = totalCopper % count;

		Object.keys(CONFIG.A5E.currencyDenominations ?? {})
			.reverse()
			.forEach((denom) => {
				// Don't share credits and electrum
				if (['cr', 'ep'].includes(denom)) return;

				const amount = Math.floor(remaining / config[denom](1));
				remaining %= config[denom](1);

				share[denom] = amount;
			});

		remaining += remainder;

		console.log(share, remaining);

		// Update actors
		const partyUpdates = Object.entries(this.system.currency ?? {}).reduce(
			(acc, [denom, val]) => {
				if (denom === 'cp') {
					acc[denom] = remaining;
					return acc;
				}

				acc[denom] = 0;
				return acc;
			},
			{} as Record<string, number>,
		);

		await Promise.all([
			// @ts-expect-error
			this.update({ 'system.currency': partyUpdates }),
			...members.map(async (a) => {
				const owns = a.system.currency;
				Object.entries(share ?? {}).forEach(([denom, val]) => {
					if (!val) return;
					owns[denom] ??= 0;
					owns[denom] += val;
				});

				// @ts-expect-error
				return a.update({ 'system.currency': owns });
			}),
		]);

		// Create Chat Message
		const distributedTo = members
			.map((a) => a.name)
			.join(', ')
			.trim();

		const coinString = Object.entries(share)
			.reduce((acc, [denom, val]) => {
				if (!val) return acc;
				acc.push(`${val.toLocaleString()}${denom}`);
				return acc;
			}, [] as string[])
			.join(', ')
			.trim();

		let message = '<strong>Distributed Coins:</strong> <br />';
		message += `<strong>Amount:</strong> ${coinString} <br />`;
		message += `<strong>To:</strong> ${distributedTo} <br />`;

		ChatMessage.create({
			author: game.user.id,
			style: CONST.CHAT_MESSAGE_STYLES.OTHER,
			content: message,
		});
	}

	async distributeXP(this: Actor.OfType<'party'>, xp: number) {
		if (!this.isParty()) return;

		const members = this.members;
		const count = members.length;

		const awarded = Math.floor(xp / count);

		await Promise.all(
			members.map(async (a) => {
				// @ts-expect-error
				return a.update({ 'system.details.xp': awarded + a.system.details.xp });
			}),
		);

		const distributedTo = members
			.map((a) => a.name)
			.join(', ')
			.trim();

		let message = '<strong>Distributed XP:</strong> <br />';
		message += `<strong>Amount:</strong> ${awarded} <br />`;
		message += `<strong>To:</strong> ${distributedTo} <br />`;

		ChatMessage.create({
			author: game.user.id,
			style: CONST.CHAT_MESSAGE_STYLES.OTHER,
			content: message,
		});
	}

	/** Remove a member from the party */
	async removeMember(this: Actor.OfType<'party'>, uuid: string) {
		if (!this.isParty()) return;

		const members = this.system.details.members;
		members.delete(uuid);

		// @ts-expect-error
		await this.update({ 'system.details.members': [...members] });
	}

	/** ================================================================= */
	// Functionality Patches
	/** ================================================================= */
	// @ts-expect-error
	async toggleStatusEffect(
		statusId: string,
		options: { active?: boolean; overlay?: boolean; updates?: any } = {
			active: true,
			overlay: false,
			updates: {},
		},
	) {
		const { active, overlay = false } = options;

		const status = CONFIG.statusEffects.find((e) => e.id === statusId);
		if (!status)
			throw new Error(`Invalid status ID "${statusId}" provided to Actor#toggleStatusEffect`);

		const existing: string[] = [];
		const existingEffects: ActiveEffect[] = [];

		// Find the effect with the static _id of the status effect
		if (status._id) {
			const effect = this.effects.get(status._id as string);
			if (effect && effect.id) {
				existing.push(effect.id);
				// @ts-expect-error
				existingEffects.push(effect);
			}
		}

		// If no static _id, find all single-status effects that have this status
		else {
			for (const effect of this.effects) {
				const { statuses } = effect;
				if (statuses.size === 1 && statuses.has(status.id) && effect.id) {
					// @ts-expect-error
					existingEffects.push(effect);
					existing.push(effect.id);
				}
			}
		}

		// Handle multi-leveled effects
		if (['corruption', 'fatigue', 'exhaustion', 'inebriated', 'strife'].includes(statusId)) {
			const delta = active ? 1 : -1;
			const currLevel = this.system.attributes[statusId];
			const maxLevel = CONFIG.A5E.multiLevelConditionsMaxLevel[statusId] ?? 7;
			if (delta === 1 && currLevel >= maxLevel) return undefined;
			if (delta === -1 && currLevel <= 0) return undefined;

			const changeKey =
				statusId === 'fatigue' && game.settings.get('a5e', 'replaceFatigueAndStrife')
					? 'exhaustion'
					: statusId;

			const changes = Object.entries(CONFIG.A5E.multiLevelConditions[changeKey] ?? {}).reduce(
				(acc, [level, change]) => {
					if (level > currLevel + delta) return acc;
					// @ts-expect-error
					acc.push(...change);
					return acc;
				},
				[] as any[],
			);

			// Update actor values
			const actorValue = active ? Math.min(currLevel + 1, maxLevel) : Math.max(currLevel - 1, 0);

			this.update(
				{
					[`system.attributes.${statusId}`]: actorValue,
				},
				// @ts-expect-error
				{ fromCondition: true },
			);

			// Delete Existing effect
			if (existing.length && currLevel === 1 && !active) {
				await this.deleteEmbeddedDocuments('ActiveEffect', existing);
				return false;
			}

			// Update the existing effect
			if (existing.length && currLevel > 0) {
				const effect = existingEffects[0];
				// @ts-expect-error
				const doc = await effect.update({ 'system.changes': changes });
				return doc;
			}

			// Create a new effect
			if (active) {
				const effect = await ActiveEffect.implementation.fromStatusEffect(statusId);
				effect.updateSource({
					'system.changes': changes,
					'system.effectType': 'condition',
					...options.updates,
				});
				return ActiveEffect.implementation.create(effect, {
					parent: this,
					keepId: true,
				});
			}
		}

		// Remove the existing effects unless the status effect is forced active
		if (existing.length) {
			if (active) return true;
			await this.deleteEmbeddedDocuments('ActiveEffect', existing);
			return false;
		}

		// Create a new effect unless the status effect is forced inactive
		if (!active && active !== undefined) return undefined;
		const effect = await ActiveEffect.implementation.fromStatusEffect(statusId);
		effect.updateSource({ 'system.effectType': 'condition', ...options.updates });
		// @ts-expect-error
		if (overlay) effect.updateSource({ 'flags.core.overlay': true });
		return ActiveEffect.implementation.create(effect, {
			parent: this,
			keepId: true,
		});
	}

	/** ================================================================= */
	// Document Update Hooks
	/** ================================================================= */

	/** ---------------------------------- */
	// Pre Create
	/** ---------------------------------- */

	/** @inheritdoc */
	override async _preCreate(...[data, options, user]: Parameters<Actor['_preCreate']>) {
		await super._preCreate(data, options, user);

		// Add schema version
		const version: number = MigrationRunnerBase.LATEST_MIGRATION_VERSION;
		const docVersion = this.system.migrationData?.version;

		if (!docVersion) {
			this.updateSource({
				// @ts-expect-error
				'system.migrationData': {
					version,
					type: 'Actor',
				},
			});
		} else if (docVersion < version) {
			// Handle document migration
			await handleDocumentImportMigration(this);
		}

		// Call Sub Methods
		if (this.isCreature()) this._preCreateCreature(data, options, user);
		if (this.isParty()) this._preCreateParty(data, options, user);
	}

	/** ---------------------------------- */
	// Pre Create (Creature)
	/** ---------------------------------- */
	async _preCreateCreature(
		this: Creature,
		...[data, options, user]: Parameters<Actor['_preCreate']>
	) {
		if (!['character', 'npc'].includes(this.type)) return;

		// Call Sub Methods
		if (this.isChar()) this._preCreateChar(data, options, user);
		if (this.isNPC()) this._preCreateNPC(data, options, user);
	}

	/** ---------------------------------- */
	// Pre Create (Char)
	/** ---------------------------------- */
	async _preCreateChar(
		this: Actor.OfType<'character'>,
		...[data, options, user]: Parameters<Actor['_preCreate']>
	) {
		const prototypeToken = { vision: true, actorLink: true, disposition: 1 };
		// @ts-expect-error
		this.updateSource({ prototypeToken });
	}

	/** ---------------------------------- */
	// Pre Create (NPC)
	/** ---------------------------------- */
	async _preCreateNPC(
		this: Actor.OfType<'npc'>,
		...[data, options, user]: Parameters<Actor['_preCreate']>
	) {}

	/** ---------------------------------- */
	// Pre Create (Party)
	/** ---------------------------------- */
	async _preCreateParty(
		this: Actor.OfType<'party'>,
		...[data, options, user]: Parameters<Actor['_preCreate']>
	) {
		// Update prototype token
		const prototypeToken = { actorLink: true, disposition: 1 };
		// @ts-expect-error
		this.updateSource({ prototypeToken });

		// Update ownership
		// @ts-expect-error
		this.updateSource({ 'ownership.default': 2 });
	}

	/** ---------------------------------- */
	// Pre Update
	/** ---------------------------------- */

	/** @inheritdoc */
	override async _preUpdate(...[changed, options, user]: Parameters<Actor['_preUpdate']>) {
		// This should happen before super takes place
		if (['character', 'npc'].includes('this.type')) {
			// @ts-expect-error
			if (!options.fromCondition) {
				automateMultiLevelConditions(this, foundry.utils.deepClone(changed), user.id);
			}
		}

		await super._preUpdate(changed, options, user);

		// Call Sub Modules
		if (this.isCreature()) this._preUpdateCreature(changed, options, user);
		if (this.isParty()) this._preUpdateParty(changed, options, user);
	}

	/** ---------------------------------- */
	// Pre Create (Creature)
	/** ---------------------------------- */
	async _preUpdateCreature(
		this: Creature,
		...[changed, options, user]: Parameters<Actor['_preUpdate']>
	) {
		// If hp drops below 0, set the value to 0.
		if ((foundry.utils.getProperty(changed, 'system.attributes.hp.value') as number) < 0) {
			foundry.utils.setProperty(changed, 'system.attributes.hp.value', 0);
		}

		// If temp hp drops to or below 0, set the value to 0.
		if ((foundry.utils.getProperty(changed, 'system.attributes.hp.temp') as number) <= 0) {
			foundry.utils.setProperty(changed, 'system.attributes.hp.temp', 0);
		}

		// Reset death save counters
		const isUnconscious = this.system.attributes.hp.value === 0;
		const willRegainConsciousness =
			(foundry.utils.getProperty(changed, 'system.attributes.hp.value') as number) > 0;

		if (isUnconscious && willRegainConsciousness) {
			foundry.utils.setProperty(changed, 'system.attributes.death.success', 0);
			foundry.utils.setProperty(changed, 'system.attributes.death.failure', 0);
		}

		// Update prototype token sizes to reflect the actor's token size
		const automateTokenSize =
			this.flags?.a5e?.automatePrototypeTokenSize ??
			game.settings.get('a5e', 'automatePrototypeTokenSize') ??
			true;

		if (automateTokenSize) {
			if (foundry.utils.getProperty(changed, 'system.traits.size')) {
				// @ts-expect-error
				const newSize = changed?.system?.traits?.size;

				// If titanic token is already larger than 5, don't change it
				if (newSize !== 'titan' || (this.prototypeToken.width ?? 1) < 5) {
					foundry.utils.setProperty(
						changed,
						'prototypeToken.height',
						CONFIG.A5E.tokenDimensions[newSize],
					);
					foundry.utils.setProperty(
						changed,
						'prototypeToken.width',
						CONFIG.A5E.tokenDimensions[newSize],
					);
				}
			}
		}

		// Concentration Check Automation
		const isConcentrating = this.statuses.has('concentration');
		const hp = foundry.utils.getProperty(changed, 'system.attributes.hp.value') as number;
		// TODO: Respect Limit
		if (isConcentrating && this.system.attributes.hp.value > hp) {
			this.createConcentrationCheckCard(this.system.attributes.hp.value - hp);
		}
	}

	/** ---------------------------------- */
	// Pre Create (Char)
	/** ---------------------------------- */
	async _preUpdateChar(
		this: Actor.OfType<'character'>,
		...[changed, options, user]: Parameters<Actor['_preUpdate']>
	) {}

	/** ---------------------------------- */
	// Pre Create (NPC)
	/** ---------------------------------- */
	async _preUpdateNPC(
		this: Actor.OfType<'npc'>,
		...[changed, options, user]: Parameters<Actor['_preUpdate']>
	) {}

	/** ---------------------------------- */
	// Pre Create (Party)
	/** ---------------------------------- */
	async _preUpdateParty(
		this: Actor.OfType<'party'>,
		...[changed, options, user]: Parameters<Actor['_preUpdate']>
	) {}

	/** ---------------------------------- */
	// On Create
	/** ---------------------------------- */
	override _onCreate(...[data, options, userId]: Parameters<Actor['_onCreate']>) {
		super._onCreate(data, options, userId);

		// Call Sub Methods
		if (this.isCreature()) this._onCreateCreature(data, options, userId);
		if (this.isParty()) this._onCreateParty(data, options, userId);
	}

	/** ---------------------------------- */
	// On Create (Creature)
	/** ---------------------------------- */
	_onCreateCreature(this: Creature, ...[data, options, userId]: Parameters<Actor['_onCreate']>) {
		if (!['character', 'npc'].includes(this.type)) return;

		// Call Sub Methods
		if (this.isChar()) this._onCreateChar(data, options, userId);
		if (this.isNPC()) this._onCreateNPC(data, options, userId);
	}

	/** ---------------------------------- */
	// On Create (Char)
	/** ---------------------------------- */
	_onCreateChar(
		this: Actor.OfType<'character'>,
		...[data, options, userId]: Parameters<Actor['_onCreate']>
	) {
		if (game.user.id !== userId) return;
		this._fixNestedUuids();
	}

	/** ---------------------------------- */
	// On Create (NPC)
	/** ---------------------------------- */
	_onCreateNPC(
		this: Actor.OfType<'npc'>,
		...[data, options, userId]: Parameters<Actor['_onCreate']>
	) {}

	/** ---------------------------------- */
	// On Create (Party)
	/** ---------------------------------- */
	_onCreateParty(
		this: Actor.OfType<'party'>,
		...[data, options, userId]: Parameters<Actor['_onCreate']>
	) {}

	/** ---------------------------------- */
	// On Update
	/** ---------------------------------- */
	/** @inheritdoc */
	override _onUpdate(...[changed, options, userId]: Parameters<Actor['_onUpdate']>) {
		super._onUpdate(changed, options, userId);

		// Call Sub Modules
		if (this.isCreature()) this._onUpdateCreature(changed, options, userId);
		if (this.isParty()) this._onUpdateParty(changed, options, userId);
	}

	/** ---------------------------------- */
	// On Update (Creature)
	/** ---------------------------------- */
	_onUpdateCreature(this: Creature, ...[changed, options, userId]: Parameters<Actor['_onUpdate']>) {
		const applyBloodied = game.settings.get('a5e', 'automateBloodiedApplication') ?? true;
		const applyUnconscious = game.settings.get('a5e', 'automateUnconsciousApplication') ?? true;
		if (applyBloodied) automateHpConditions(this, changed, userId, 'bloodied');
		if (applyUnconscious) automateHpConditions(this, changed, userId, 'unconscious');

		// Call Sub Methods
		if (this.isChar()) this._onUpdateChar(changed, options, userId);
		if (this.isNPC()) this._onUpdateNPC(changed, options, userId);
	}

	/** ---------------------------------- */
	// On Update (Char)
	/** ---------------------------------- */
	_onUpdateChar(
		this: Actor.OfType<'character'>,
		...[changed, options, userId]: Parameters<Actor['_onUpdate']>
	) {}

	/** ---------------------------------- */
	// On Update (NPC)
	/** ---------------------------------- */
	_onUpdateNPC(
		this: Actor.OfType<'npc'>,
		...[changed, options, userId]: Parameters<Actor['_onUpdate']>
	) {}

	/** ---------------------------------- */
	// On Update (Party)
	/** ---------------------------------- */
	_onUpdateParty(
		this: Actor.OfType<'party'>,
		...[changed, options, userId]: Parameters<Actor['_onUpdate']>
	) {}
}

export type A5EChar = ActorA5E<'character'>;
export type A5ENPC = ActorA5E<'npc'>;
export type A5EParty = ActorA5E<'party'>;

export { ActorA5E };
