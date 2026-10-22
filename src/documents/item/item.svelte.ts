import { createSubscriber } from 'svelte/reactivity';
import { ActionsManager } from '#managers/ActionsManager.ts';
import { ContainerManager } from '#managers/ContainerManager.ts';
import { ItemGrantsManager } from '#managers/ItemGrantsManager.ts';
import { RollStateManager } from '#managers/RollStateManager.ts';
import type { Action } from '#types/action.d.ts';
import { localize } from '#utils/localization/localize.ts';
import { getSummaryData } from '#utils/summaries/getSummaryData.ts';
import ActionSelectionDialog from '#view/dialogs/action/ActionSelectionDialog.svelte';
import { ActionActivationDialog } from '#view/dialogs/initializers/ActionActivationDialog.svelte.ts';
import { GenericConfigDialog } from '#view/dialogs/initializers/GenericConfigDialog.svelte.ts';
import type { AttackRollData } from '../../dataModels/item/actions/ActionRollsDataModel.ts';
import { getDeterministicBonus } from '../../dice/getDeterministicBonus.ts';
import { handleDocumentImportMigration } from '../../migration/handlers/handleDocumentMigration.ts';
import { MigrationRunnerBase } from '../../migration/runner/base.ts';
import type { ActionActivationOptions, ClassCastingData } from './data.ts';

import FDoc = foundry.abstract.Document;

import ClassResourceManager from '#managers/ClassResourceManager.ts';

// *****************************************************************************************

declare module 'fvtt-types/configuration' {
	interface DocumentClassConfig {
		Item: typeof ItemA5E<Item.SubType>;
	}

	interface ConfiguredItem<SubType extends Item.SubType> {
		document: ItemA5E<SubType>;
	}
}

// *****************************************************************************************

/**
 * Override and extend the basic Item implementation.
 * @extends {Item}
 */
class ItemA5E<SubType extends Item.SubType = Item.SubType> extends Item<SubType> {
	/** Manager in charge of actions on the item */
	declare actions: ActionsManager;

	/** Casting data for classes and archetypes */
	declare casting: ClassCastingData | null;

	/** Manager in charge of container items on a container */
	declare containerItems: ContainerManager | null;

	/** Manager in charge of grants on an item */
	declare grants: SubType extends 'feature' ? ItemGrantsManager : null;

	/** Manager in charge of class resources */
	declare resources: SubType extends 'archetype' | 'class' ? ClassResourceManager : null;

	dialogs: {
		actions: Record<string, any>;
		areaScaling: Record<string, any>;
		rollScaling: Record<string, any>;
		targetScaling: Record<string, any>;
	};

	#subscribe: () => void;

	// *****************************************************************************************

	constructor(data, context) {
		super(data, context);

		this.dialogs ??= {
			actions: {},
			areaScaling: {},
			rollScaling: {},
			targetScaling: {},
		};

		this.#subscribe = createSubscriber((update) => {
			const updateItemHook = Hooks.on('updateItem', (triggeringDocument, _, { diff }) => {
				if (diff === false) return;

				if (triggeringDocument._id === this.id) update();
			});

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
				Hooks.off('updateItem', updateItemHook);
				Hooks.off('createActiveEffect', embeddedEffectHooks.create);
				Hooks.off('deleteActiveEffect', embeddedEffectHooks.delete);
				Hooks.off('updateActiveEffect', embeddedEffectHooks.update);
			};
		});
	}

	/** Gets a reactive instance of the actor */
	get reactive() {
		this.#subscribe();

		return this;
	}

	/** ================================================================= */
	// Type Helpers
	/** ================================================================= */

	/** Narrows down items to items that support actions */
	isActionItem(): this is ActionItem {
		return (
			this.type === 'feature' ||
			this.type === 'hacking' ||
			this.type === 'interaction' ||
			this.type === 'maneuver' ||
			this.type === 'object' ||
			this.type === 'spell'
		);
	}

	/** Narrows down type of items that are origin items */
	isOriginItem(): this is OriginItem {
		return (
			this.type === 'archetype' ||
			this.type === 'background' ||
			this.type === 'class' ||
			this.type === 'culture' ||
			this.type === 'destiny' ||
			this.type === 'heritage'
		);
	}

	/** Narrows down type to a certain item subtype */
	isType<SubType extends Item.SubType = Item.SubType>(type: SubType): this is Item.OfType<SubType> {
		// @ts-expect-error
		return this.type === type;
	}

	/** ================================================================= */
	// Getters
	/** ================================================================= */

	/** ---------------------------------- */
	//  Generic
	/** ---------------------------------- */

	/** Get source id for this document if available */
	get sourceId(): string | null {
		return this._stats.compendiumSource || null;
	}

	/** Returns the identifier for this class. TODO: This needs to be global soon */
	get slug() {
		return this.system.slug || this.name.slugify({ strict: true });
	}

	/** ---------------------------------- */
	//  Getters (Archetype / Class)
	/** ---------------------------------- */

	/** Get parent class for this archetype. TODO: Move to data model */
	get class(): Item.OfType<'class'> | null {
		if (!this.actor) return null;

		if (this.isType('archetype')) {
			if (!this.system.class) {
				ui.notifications?.error('Archetype is missing a class reference.');
			}

			const slug = this.system.class;
			const cls = this.actor.itemTypes.class.find((i) => i.slug === slug);
			return cls || null;
		}

		return null;
	}

	/** Get class levels for this archetype or class. */
	get classLevels(): number {
		if (this.isType('class')) return this.system.classLevels;
		if (this.isType('archetype')) {
			const cls = this.class;
			if (!cls) return 0;

			return cls.system.classLevels;
		}

		return 0;
	}

	/** ---------------------------------- */
	//  Getters (Archetype)
	/** ---------------------------------- */

	/** ---------------------------------- */
	//  Getters (Class)
	/** ---------------------------------- */

	/** Gets hp associated with each level as a string. TODO: Move to Data model*/
	get associatedLevels(): string[] {
		if (this.isType('class')) {
			const { levels } = this.system.hp;
			return Object.entries(levels ?? {}).reduce((acc, [level, value]) => {
				if (!value) return acc;
				acc.push(level);
				return acc;
			}, [] as string[]);
		}

		return [] as string[];
	}

	/** Gets the selected archetype for this class if any */
	get archetype(): Item.OfType<'archetype'> | null {
		if (!this.actor) return null;

		if (this.isType('class')) {
			const { slug } = this;

			const cls = this.actor.itemTypes.archetype.find((i) => i.system.class === slug);
			return cls || null;
		}

		return null;
	}

	/** Gets Average Hp for this class. TODO: Move to data model */
	get averageHP(): number {
		if (this.isType('class')) {
			return Math.floor(this.hitDice.size / 2) + 1;
		}

		return 0;
	}

	/** Get hit dice data for this class. TODO: Move to data model */
	get hitDice() {
		if (this.isType('class')) {
			return {
				current: this.totalHitDice - this.system.hp.hitDiceUsed,
				total: this.totalHitDice,
				size: this.system.hp.hitDiceSize,
			};
		}

		return {
			current: 0,
			total: 0,
			size: 0,
		};
	}

	/** Checks if this class is the starting class for this actor. TODO: Move to data model */
	get isStartingClass(): boolean {
		if (this.isType('class')) {
			if (!this.actor) return false;
			return this.actor.system.classes?.startingClass === this.slug;
		}

		return false;
	}

	/** Gets the max hp for the actor. TODO: Move to data model */
	get maxHP() {
		if (this.isType('class')) return this.prepareMaxHitPoints();
		return 0;
	}

	/** Returns the total hit dice this class grants. TODO: Move to data model */
	get totalHitDice() {
		if (this.isType('class')) return this.classLevels;
		return 0;
	}

	/** ---------------------------------- */
	//  Getters (Object)
	/** ---------------------------------- */

	/** Get the container of this object */
	get container(): Item.OfType<'object'> | null {
		if (this.isType('object')) {
			if (!this.system.containerId) return null;
			if (this.actor) return this.actor.items.get(this.system.containerId) ?? null;
			if (this.pack) return game.packs.get(this.pack)?.getDocument(this.system.containerId) ?? null;
			return (game.items.get(this.system.containerId) as Item.OfType<'object'>) ?? null;
		}

		return null;
	}

	/** Get names of the items in a container as a string. This is a helper for our sheet reducer */
	get containerItemNames() {
		if (!this.containerItems) return '';

		const names = this.containerItems.allItems.map((i) => i.name);
		return names.join(', ');
	}

	/** Get direct children of this container */
	get contents(): Item.OfType<'object'>[] {
		if (this.isType('object')) {
			if (this.system.objectType !== 'container') return [] as Item.OfType<'object'>[];

			return (this.containerItems?.items ?? []) as Item.OfType<'object'>[];
		}

		return [] as Item.OfType<'object'>[];
	}

	/** Gets weight of object */
	get weight(): number {
		if (this.isType('object')) {
			if (this.system.objectType === 'container') {
				const w = this.containerItems?.weight ?? 0;
				return w + (this.system.weight ?? 0);
			} else return this.system.weight ?? 0;
		}

		return 0;
	}

	/** ---------------------------------- */
	//  Getters (Spell)
	/** ---------------------------------- */

	/** Get the spellbook associated with this spell */
	get spellBook() {
		if (this.isType('spell')) {
			return this.system.spellBook;
		}

		return '';
	}

	/** ================================================================= */
	// Initialize
	/** ================================================================= */
	protected override _initialize(options?: FDoc.InitializeOptions) {
		// Unset Managers
		this.actions = null!;
		this.containerItems = null;
		this.grants = null as this['grants'];

		super._initialize(options);
	}

	/** ================================================================= */
	// Prepare Base Data
	/** ================================================================= */

	/** @inheritdoc */
	override prepareBaseData() {
		super.prepareBaseData();

		// Set up managers
		this.actions = new ActionsManager(this);
		if (this.isType('feature')) this.grants = new ItemGrantsManager(this) as this['grants'];

		// Call Sub Methods
		if (this.isType('object')) this.prepareObjectBaseData();
		if (this.isOriginItem()) this.prepareOriginBaseData();
	}

	/** ---------------------------------- */
	//  Base Data Prep (Object)
	/** ---------------------------------- */

	/** Prepares base data for objects */
	prepareObjectBaseData(this: Item.OfType<'object'>) {
		if (this.system.objectType === 'container') {
			this.containerItems = new ContainerManager(this);
		}
	}

	/** ---------------------------------- */
	//  Base Data Prep (Origin)
	/** ---------------------------------- */

	/** Prepares base data for origin items */
	prepareOriginBaseData(this: OriginItem) {
		this.grants = new ItemGrantsManager(this) as this['grants'];

		// Call Sub methods
		if (this.isType('archetype')) this.prepareArchetypeBaseData();
		if (this.isType('class')) this.prepareClassBaseData();
	}

	/** ---------------------------------- */
	//  Base Data Prep (Archetype)
	/** ---------------------------------- */
	prepareArchetypeBaseData(this: Item.OfType<'archetype'>) {
		this.casting = this.prepareCasterData();
		this.resources = new ClassResourceManager(this);
	}

	/** ---------------------------------- */
	//  Base Data Prep (Class)
	/** ---------------------------------- */

	/** Prepares base data for class items */
	prepareClassBaseData(this: Item.OfType<'class'>) {
		this.resources = new ClassResourceManager(this);
		this.casting = this.prepareCasterData();
	}

	/** Prepare Caster Data for this class. TODO: Move to data model */
	prepareCasterData(this: Item.OfType<'class'> | Item.OfType<'archetype'>) {
		const { casterType } = this.system.spellcasting;
		if (!casterType || casterType === 'none' || !this.classLevels) {
			return this.archetype?.casting ?? null;
		}

		const progressionConfig = CONFIG.A5E.casterProgression[casterType] ?? null;
		if (!progressionConfig) return null;

		const { type, config, resource, multiplier, roundUp, multiclassMode } = progressionConfig;

		const data: ClassCastingData = {
			casterType,
			resource,
			progressionType: type,
		};

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

	/** Prepare Max Hit Points for this class. TODO: Move to data model */
	prepareMaxHitPoints(this: Item.OfType<'class'>) {
		const { levels } = this.system.hp;

		const actor = this.actor;
		const maxLevel = actor ? actor.levels.character : 20;

		return Object.entries(levels ?? {}).reduce((acc, [level, value]) => {
			if (!value || level > maxLevel) return acc;
			return acc + (value as number);
		}, 0);
	}

	/** ================================================================= */
	// Prepare Derived Data
	/** ================================================================= */

	/** @inheritdoc */
	override prepareDerivedData() {
		super.prepareDerivedData();

		// Prepare Actions Derived Data
		this.actions.prepareDerivedData();

		if (['object', 'feature'].includes(this.type)) this.prepareArmorData();

		// Call Sub Methods
	}

	/** Prepare Armor Data for this item */
	prepareArmorData(this: Item.OfType<'object'> | Item.OfType<'feature'>) {
		const itemData = this.system;

		// Calculate AC formula
		const { baseFormula, maxDex } = itemData.ac ?? {};
		if (!baseFormula) return;

		let formula = baseFormula;
		if (maxDex && maxDex > 0) {
			formula = baseFormula.replaceAll(
				/@dex\.mod|@abilities\.dex\.mod/gm,
				`min(@dex.mod, ${maxDex})`,
			);
		}

		if (this.isType('object')) {
			if (this.system?.damagedState === CONFIG.A5E.DAMAGED_STATES.BROKEN) {
				if (this.system?.objectType === 'armor') {
					formula = `10 + max(floor((${formula} - 10) / 2), 1)`;
				} else formula = `max(floor((${formula}) / 2), 1)`;
			}
		}

		foundry.utils.setProperty(this, 'system.ac.formula', formula);
	}

	/** ================================================================= */
	// Prepare Duplicate Data
	/** ================================================================= */

	/** @inheritdoc */
	async duplicateItem() {
		const owningActor = this.actor;

		// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
		let create: boolean | void = true;

		const newItem = foundry.utils.deepClone(this);
		newItem.name = `${newItem.name} (Copy)`;

		if (this.isType('object')) create = await this.duplicateObject(newItem);

		if (create === false) return;

		if (owningActor) owningActor.createEmbeddedDocuments('Item', [newItem]);
		else Item.createDocuments([newItem]);
	}

	/** ---------------------------------- */
	// Object
	/** ---------------------------------- */
	/** Duplicate data for objects */
	async duplicateObject(this: Item.OfType<'object'>, newItem: Item.OfType<'object'>) {
		newItem.system.containerId = '';

		// This is done here because we don't want to call super
		if (this.system.objectType === 'container') {
			if (!this.actor) return true;

			await ContainerManager.createContainerOnActor(this.actor, newItem);
			return false;
		}
	}

	// *****************************************************************************************

	/** ================================================================= */
	// Activation Methods
	/** ================================================================= */

	/**
	 * A handler for activating an item. An actionId can be passed to this method to use a specific
	 * action defined on the item. If there are no actions defined, this method defaults to
	 * outputting the item's description.
	 *
	 * This method accepts an options object to further customize the activation process.
	 *
	 * @param actionId - The action id
	 * @param options
	 * @returns
	 */
	async activate(actionId: string | null, options: ActionActivationOptions = {}) {
		// Do not allow an item to activate if it not attached to an actor or if the user does
		// not have owner permissions for the actor.
		if (!this.actor?.isOwner) return;

		if (this.actor?.getFlag('a5e', 'automaticallyExecuteAvailableMacros') ?? true) {
			options.executeMacro ??= this.system.macro.trim().length > 0 || this.actions.hasMacro;
		}

		if (!this.actions || this.actions.count === 0) {
			// If no actions are defined, default to outputting just the item description.
			this.shareItemDescription(null, options);
		} else if (this.actions.count === 1) {
			// If there is a single defined action, use that action.
			this.#activateAction(this.actions.first!.id, options);
		} else if (actionId) {
			// If an action is provided, use the provided action
			this.#activateAction(actionId, options);
		} else {
			// If no action id was provided, and there is more then one action defined for the item,
			// show a dialog window so that the user can select an appropriate action.
			const dialog = new GenericConfigDialog(
				this,
				`${this.name}: Select Action`,
				ActionSelectionDialog,
			);
			await dialog.render(true);

			const promise = await dialog.promise;

			// If no selection is made, cancel the activation.
			if (!promise?.actionId) return;

			this.#activateAction(promise.actionId, options);
		}
	}

	/** Share the item description of an item to chat */
	async shareItemDescription(action: Action | null, options: Record<string, any>) {
		const chatData = {
			author: (game as Game).user?.id,
			speaker: ChatMessage.getSpeaker({ actor: this.actor }),
			system: {
				actorId: this.actor?.uuid,
				actorName: this.name,
				actionName: action?.name,
				img: action?.img ?? this.img,
				itemId: this.uuid,
				actionDescription: action?.descriptionOutputs?.includes('action')
					? await foundry.applications.ux.TextEditor.enrichHTML(action.description, {
							secrets: this.isOwner,
							relativeTo: this,
							rollData: this?.actor?.getRollData(this) ?? {},
						})
					: null,
				itemDescription:
					(action?.descriptionOutputs?.includes('item') ?? true)
						? await foundry.applications.ux.TextEditor.enrichHTML(this.system.description, {
								secrets: this.isOwner,
								relativeTo: this,
								rollData: this?.actor?.getRollData(this) ?? {},
							})
						: null,
				unidentifiedDescription:
					(action?.descriptionOutputs?.includes('item') ?? true)
						? // @ts-expect-error
							await foundry.applications.ux.TextEditor.enrichHTML(
								this.system.unidentifiedDescription,
								{
									secrets: this.isOwner,
									relativeTo: this,
									rollData: this?.actor?.getRollData(this) ?? {},
								},
							)
						: null,
				summaryData: getSummaryData(this, action, {
					hideSpellClasses: true,
					hideSpellComponents: true,
					hideSpellLevel: true,
				}),
			},
			type: 'item',
		};

		// @ts-expect-error
		ChatMessage.applyMode(chatData, game.settings.get('core', 'messageMode'));
		const chatCard = ChatMessage.create(chatData);

		// Execute Macro
		if (options.executeMacro) {
			// @ts-expect-error
			if (!(this.system.macro?.trim().length > 0)) {
				ui.notifications?.error(`There is no macro configured for ${this.name}.`);
				return chatCard;
			}

			try {
				// @ts-expect-error
				const { macro } = this.system;

				const AsyncFunction = async function _() {}.constructor;
				AsyncFunction('actor', 'item', 'options', macro)(this.actor, this, { options });
			} catch (err) {
				ui.notifications?.error(
					`Could not execute the macro for ${this.name}. See the browser console for more details.`,
				);
				console.error(err);
			}
		}

		Hooks.callAll('a5e.itemActivate', this, { action });
		return chatCard;
	}

	// TODO: Find out where this is being used.
	async showActionActivationDialog(actionId: string, action?: Action) {
		if (!foundry.utils.isEmpty(action?.rolls) || !foundry.utils.isEmpty(action?.prompts)) {
			return true;
		}

		// Check if consumers need a dialog
		const consumerTypes = new Set(
			Object.values(action?.consumers ?? {}).map((c) => c.type),
		) as Set<string>;

		if (consumerTypes.intersects(CONFIG.A5E.configurableConsumers)) {
			return true;
		}

		return false;
	}

	async #activateAction(actionId: string, options: ActionActivationOptions = {}) {
		let activationData: any;
		const action = this.actions.get(actionId)!;

		const rollStateManager = new RollStateManager(this, actionId, options);
		const rollState = rollStateManager.state;
		options.rollState = rollState;

		if (options.skipRollDialog) {
			activationData = this.#getDefaultActionActivationData(actionId, options);
		} else {
			activationData = await this.#showActionActivationPrompt(actionId, options);
		}

		if (!activationData) return null;

		const { prompts, rolls, shapeData } = await rollStateManager.startWorkflow(activationData);

		// TODO: Move the rest of this to workflow
		const chatData = {
			author: game.user?.id,
			flavor: action.name ? `${this.name}: ${action.name}` : this.name,
			speaker: ChatMessage.getSpeaker({ actor: this.actor }),
			style: CONST.CHAT_MESSAGE_STYLES.OTHER,
			sound: CONFIG.sounds.dice,
			rolls: rolls.map(({ roll }) => roll),
			rollMode: activationData.visibilityMode ?? game.settings.get('core', 'messageMode'),
			system: {
				actionName: action.name,
				actionId,
				actorName: this.name,
				actorId: this.actor?.uuid,
				img: action.img ?? this.img ?? 'icons/svg/item-bag.svg',
				itemId: this.uuid,
				// @ts-expect-error
				castingLevel: activationData.consumers?.spell?.level ?? this.system.level ?? null,
				actionDescription: action?.descriptionOutputs?.includes('action')
					? await foundry.applications.ux.TextEditor.enrichHTML(action.description, {
							secrets: this.isOwner,
							relativeTo: this,
							rollData: this?.actor?.getRollData(this) ?? {},
						})
					: null,
				itemDescription:
					(action?.descriptionOutputs?.includes('item') ?? true)
						? await foundry.applications.ux.TextEditor.enrichHTML(this.system.description, {
								secrets: this.isOwner,
								relativeTo: this,
								rollData: this?.actor?.getRollData(this) ?? {},
							})
						: null,
				unidentifiedDescription:
					(action?.descriptionOutputs?.includes('item') ?? true)
						? await foundry.applications.ux.TextEditor.enrichHTML(
								this.system.unidentifiedDescription,
								{
									secrets: this.isOwner,
									relativeTo: this,
									rollData: this?.actor?.getRollData(this) ?? {},
								},
							)
						: null,
				effects: activationData.effects ?? [],
				prompts: prompts,
				rollData: rolls.map(({ roll, ...rollData }) => rollData),
				shapeData: shapeData,
				summaryData: getSummaryData(this, action, {
					hideAttunementData: true,
					hideCraftingComponents: true,
					hidePrice: true,
					hideRarity: true,
					hideSpellClasses: true,
					hideSpellComponents: true,
					hideSpellLevel: true,
				}),
			},
			type: 'item',
		};

		ChatMessage.applyMode(
			chatData,
			activationData.visibilityMode ?? game.settings.get('core', 'messageMode'),
		);
		const chatCard = await ChatMessage.create(chatData);

		Hooks.callAll('a5e.itemActivate', this, {
			actionId,
			action,
			dialog: activationData,
			// @ts-expect-error
			macro: this.system.macro,
			options,
			rolls,
		});

		// Trigger Macros
		if (options.executeMacro) {
			// Execute System Macro
			// @ts-expect-error
			if (this.system.macro?.trim().length > 0) {
				try {
					// @ts-expect-error
					const { macro } = this.system;

					const AsyncFunction = async function _() {}.constructor;
					AsyncFunction('actor', 'item', 'options', macro)(this.actor, this, { options });
				} catch (err) {
					ui.notifications?.error(
						`Could not execute the macro for ${this.name}. See the browser console for more details.`,
					);
					console.error(err);
				}
			}

			// Execute Action Macro
			if (action.macro.trim().length > 0) {
				try {
					const { macro } = action;

					const AsyncFunction = async function _() {}.constructor;
					AsyncFunction(
						'actor',
						'item',
						'options',
						macro,
					)(this.actor, this, {
						actionId,
						action,
						options,
						rolls,
					});
				} catch (err) {
					ui.notifications?.error(
						`Could not execute the macro for ${this.name}. See the browser console for more details.`,
					);
					console.error(err);
				}
			}
		}

		return chatCard;
	}

	async #showActionActivationPrompt(actionId: string, options: ActionActivationOptions) {
		const dialog = new ActionActivationDialog({
			actionId,
			options,
			actorDocument: this.actor,
			itemDocument: this,
		});

		dialog.render(true);
		return dialog.promise;
	}

	#getDefaultActionActivationData(actionId: string, options: ActionActivationOptions) {
		const action = this.actions.get(actionId);
		if (!action) return null;

		const rollState = options.rollState!;

		const attack = this.#getDefaultAttackRollData(rollState.attackRoll, options);
		const consumptionData = this.#getDefaultConsumerData(options);
		const effects = rollState.config.defaults.effects;
		const { damageBonuses, healingBonuses } = rollState.config.defaults;

		return {
			attack,
			consumptionData,
			effects,
			selectedDamageBonuses: damageBonuses,
			selectedHealingBonuses: healingBonuses,
			selectedConsumers: rollState.config.defaults.consumers,
			selectedRolls: rollState.config.defaults.rolls,
			selectedPrompts: rollState.config.defaults.prompts,
		};
	}

	#getDefaultAttackRollData(
		attackRoll: RollStateManager.state['attackRoll'],
		options: ActionActivationOptions,
	) {
		if (!attackRoll) return {};

		const { actor } = this;
		if (!actor) return {};

		const rollState = options.rollState!;
		const parts = rollState.config.attackRoll!;

		return {
			...(attackRoll as AttackRollData),
			expertiseDie: parts.expertiseDie,
			rollMode: parts.rollMode,
			formula: parts.formula.rollFormula,
			terms: parts.formula.terms,
		} as RollStateManager.ActionDialogData['attack'];
	}

	#getDefaultConsumerData(options: ActionActivationOptions) {
		const rollState = options.rollState!;
		const consumers = rollState.consumers;

		let actionUses = {};
		if (consumers.actionUses) {
			actionUses = consumers.actionUses.getActivationData(
				this.actor!,
				this as ActionItem,
			).actionUsesData;
		}

		let itemUses = {};
		if (consumers.itemUses) {
			itemUses = consumers.itemUses.getActivationData(this.actor!, this as ActionItem).itemUsesData;
		}

		let hitDice = {};
		if (consumers.hitDice) {
			hitDice = consumers.hitDice.getActivationData(this.actor!);
		}

		const resources = {};
		if (consumers.resource?.length) {
			consumers.resource.forEach((consumer) => {
				resources[consumer.id] = consumer.getActivationData(this.actor!).usesData;
			});
		}

		let spell = {};
		if (consumers.spell) {
			spell = consumers.spell.getActivationData(this.actor!, this as ActionItem).spellData;
			console.log(spell);
		}

		return {
			actionUses,
			hitDice,
			itemUses,
			resources,
			spell,
		};
	}

	// *****************************************************************************************

	/** ================================================================= */
	// Revitalize
	/** ================================================================= */

	/** Update the current item with a copy of what is in the compendium */
	async revitalize(options: RevitalizeOptions = {}): Promise<Record<string, any> | null> {
		if (!options.skipDialog) {
			// Confirmation Dialog
			const confirm = await foundry.applications.api.DialogV2.confirm({
				// @ts-expect-error
				window: { title: `Confirm Revitalize - ${this.name}` },
				content: '<p>Confirm updating item from compendium source?</p>',
				modal: true,
			});

			if (!confirm) return null;
		}

		options.notify ??= true;
		options.update ??= true;
		options.updateImg ??= true;
		options.updateEffects ??= true;
		options.updateName ??= true;

		const { sourceId } = this;

		// TODO: Revitalize - Try to find source

		if (!sourceId) {
			if (options.notify !== false) {
				ui.notifications?.error('Cannot revitalize an item without a source ID.');
			}

			return null;
		}

		if (this.uuid === sourceId) {
			if (options.notify !== false) {
				ui.notifications?.error('Cannot revitalize an item that is already the source.');
			}

			return null;
		}

		if (!sourceId.startsWith('Compendium.')) {
			if (options.notify !== false) {
				ui.notifications?.error('Cannot revitalize an item that is not from a compendium.');
			}

			return null;
		}

		const currentData = this.toObject();
		const compendiumData = ((await fromUuid(sourceId)) as Item.Implementation | null)?.toObject();

		if (!compendiumData) {
			if (options.notify !== false) {
				ui.notifications?.error('Unable to find source.');
			}
			return null;
		}

		if (currentData.type !== compendiumData.type) {
			if (options.notify !== false) {
				ui.notifications?.error('Cannot revitalize an item with a different type.');
			}

			return null;
		}

		const updates: Record<string, any> = {
			name: options.updateName ? compendiumData.name : currentData.name,
			img: options.updateImg ? compendiumData.img : currentData.img,
			system: foundry.utils.deepClone(compendiumData.system),
			_stats: { compendiumSource: sourceId },
		};

		// TODO: Revitalize - Add support for grants
		// Don't update grants
		// @ts-expect-error
		if (this.system?.grants) updates.system.grants = this.system.grants;

		// Ignore favorite state
		updates.system.favorite = this.system.favorite;

		// Ignore current uses
		// @ts-expect-error
		if (this.system.uses?.max) {
			// @ts-expect-error
			updates.system.uses.value = this.system.uses.value;
		}

		// Don't update some properties for archetypes
		if (this.type === 'archetype') {
			updates.system.spellcasting.ability.base = this.system.spellcasting.ability.base;
		}

		// Don't update some properties for classes
		if (this.type === 'class') {
			updates.system.classLevels = this.system.classLevels;
			updates.system.hp = this.system.hp;
			updates.system.spellcasting.ability.base = this.system.spellcasting.ability.base;
		}

		// Don't update some properties for objects
		if (this.type === 'object') {
			// Ignore container data
			updates.system.containerId = this.system.containerId;
			updates.system.items = this.system.items;

			// Ignore states
			updates.system.damagedState = this.system.damagedState;
			updates.system.equippedState = this.system.equippedState;
			updates.system.unidentified = this.system.unidentified;

			// Ignore proficiency
			updates.system.proficient = this.system.proficient;

			// Ignore quantity
			updates.system.quantity = this.system.quantity;
		}

		// Don't update some properties for spells
		if (this.type === 'spell') {
			updates.system.spellBook = this.system.spellBook;
		}

		// TODO: Don't update some action properties
		if (compendiumData.system.actions) {
			// @ts-expect-error
			const currentActions = this.system.actions;
			const compendiaActions = compendiumData.system.actions;

			const updatedActions = Object.entries(compendiaActions).reduce((acc, [actionId, action]) => {
				const updatedAction = foundry.utils.deepClone(action) as Record<string, any>;

				const existing = currentActions[actionId];

				if (!existing) {
					acc[actionId] = updatedAction;
					return acc;
				}

				// Ignore current action uses
				// @ts-expect-error
				if (action.uses?.value) {
					foundry.utils.setProperty(updatedAction, 'uses.value', existing.uses?.value);
				}

				acc[actionId] = updatedAction;
				return acc;
			}, {});

			updates.system.actions = updatedActions;
		}

		// Update effects
		if (options.updateEffects) {
			const currentEffects = [...this.effects];
			// @ts-expect-error
			const compendiaEffects = [...compendiumData.effects] as ActiveEffect[];

			const updatedEffects = compendiaEffects.reduce((acc, effect) => {
				const updatedEffect = foundry.utils.deepClone(effect);

				const existing = currentEffects.find((e) => e._id === effect._id);
				if (!existing) {
					acc.push(updatedEffect);
					return acc;
				}

				// Ignore flags
				updatedEffect.flags = existing.flags;

				acc.push(updatedEffect);
				return acc;
			}, [] as ActiveEffect[]);

			updates.effects = updatedEffects;
		}

		if (options.update) {
			await this.update(updates, { diff: false, recursive: false });
		}

		if (options.notify !== false) ui.notifications?.info('Item revitalized.');

		return updates;
	}

	// *****************************************************************************************

	/** ================================================================= */
	// Helper Methods
	/** ================================================================= */

	/** ---------------------------------- */
	//  Helper Methods (Base)
	/** ---------------------------------- */

	/** Render the sheet of an item for configuration */
	async configureItem() {
		await this.sheet?.render({ force: true });
	}

	/** Toggle the favorite property on this item */
	async toggleFavorite() {
		if (!this.actor) return;

		await this.update({
			'system.favorite': !this.system.favorite,
		});
	}

	/** ---------------------------------- */
	//  Helper Methods (Action Item)
	/** ---------------------------------- */

	/** Recharge an item */
	async recharge(actionId: string, state = false) {
		if (state || !this.actor) return;
		let max = getDeterministicBonus(this.system.uses.max, this.actor.getRollData(this)) ?? 0;
		let current = this.system.uses.value;
		let formula = this.system.uses.recharge.formula || '1d6';
		let threshold = this.system.uses.recharge.threshold ?? 6;
		// @ts-expect-error
		let rechargeType = this.system.uses.recharge?.rechargeType || 'custom';
		// @ts-expect-error
		let rechargeAmount = this.system.uses.recharge?.rechargeAmount || '1';
		let updatePath = 'system.uses.value';

		if (actionId) {
			const action = this.actions.get(actionId);

			max = getDeterministicBonus(action?.uses?.max ?? '', this.actor.getRollData(this)) ?? 0;
			current = action?.uses?.value ?? 0;
			formula = action?.uses?.recharge?.formula || '1d6';
			threshold = action?.uses?.recharge?.threshold ?? 6;
			// @ts-expect-error
			rechargeType = action?.uses?.recharge?.rechargeType || 'custom';
			// @ts-expect-error
			rechargeAmount = action?.uses?.recharge?.rechargeAmount || '1';
			updatePath = `system.actions.${actionId}.uses.value`;
		}

		// Recharge Roll
		const rechargeRoll = await new Roll(formula, this.actor.getRollData(this)).evaluate();

		// TODO: Chat Cards - Make the message prettier
		rechargeRoll.toMessage();

		if (rechargeRoll.total < threshold) return;

		if (rechargeType === 'min') await this.update({ [updatePath]: 0 });
		else if (rechargeType === 'max') await this.update({ [updatePath]: max });
		else {
			const rechargeAmountRoll = await new Roll(
				rechargeAmount,
				this.actor.getRollData(this),
			).evaluate();

			// TODO: Add the roll back in when the custom recharge amount config is added.
			// rechargeAmountRoll.toMessage();

			await this.update({
				[updatePath]: Math.min(max, current + rechargeAmountRoll.total),
			});
		}
	}

	async rollCountdown(actionId?: string) {
		if (!this.actor) return;

		const uses = actionId ? this.actions.get(actionId)?.uses : (this.system as any).uses;
		const current = uses?.value ?? 0;
		if (current <= 0) return;

		const size = uses?.countdown?.size ?? 6;
		const threshold = uses?.countdown?.threshold ?? 6;
		const updatePath = actionId ? `system.actions.${actionId}.uses.value` : 'system.uses.value';

		const countdownRoll = await new Roll(
			`${current}d${size}`,
			this.actor.getRollData(this),
		).evaluate();

		countdownRoll.toMessage();

		const removed = countdownRoll.dice
			.flatMap((die) => die.results)
			.filter((result) => result.active && result.result >= threshold).length;

		if (!removed) return;

		await this.update({ [updatePath]: Math.max(0, current - removed) });
	}

	/** ---------------------------------- */
	//  Helper Methods (Object)
	/** ---------------------------------- */

	/** ================================================================= */
	//  Toggles
	/** ================================================================= */

	/** ---------------------------------- */
	//  Toggles (Object)
	/** ---------------------------------- */

	/** Toggles Attunement on an object */
	async toggleAttunement(this: Item.OfType<'object'>) {
		await this.update({
			'system.attuned': !this.system.attuned,
		});
	}

	/** Toggles Damaged State on an object */
	async toggleDamagedState(this: Item.OfType<'object'>) {
		const currentState = this.system.damagedState;
		const newState = (currentState + 1) % 3;

		await this.update({
			'system.damagedState': newState,
		});
	}

	/** Toggles Equipped State on an object, Only works if the item is on an actor*/
	async toggleEquippedState(this: Item.OfType<'object'>) {
		if (!this.actor) return;

		const EQUIPPED_STATES = CONFIG.A5E.EQUIPPED_STATES;
		const objectType = this.system.objectType;

		const currentState = this.system.equippedState;
		let newState = (currentState + 1) % 3;

		// Prevent multiple armors being equipped
		if (newState === EQUIPPED_STATES.EQUIPPED && objectType === 'armor') {
			const { hasArmor, hasUnderArmor } = this.actor.itemTypes.object.reduce(
				(acc, item) => {
					if (item.system.objectType !== 'armor') return acc;
					if (item.system.equippedState !== EQUIPPED_STATES.EQUIPPED) return acc;

					const isUnderArmor = item.system.materialProperties.includes('underarmor');

					if (isUnderArmor) acc.hasUnderArmor = true;
					else acc.hasArmor = true;

					return acc;
				},
				{
					hasArmor: false,
					hasUnderArmor: false,
				},
			);

			const isUnderArmor = this.system.materialProperties.includes('underarmor');
			if (isUnderArmor && hasUnderArmor) newState = EQUIPPED_STATES.NOT_CARRIED;
			else if (!isUnderArmor && hasArmor) newState = EQUIPPED_STATES.NOT_CARRIED;

			// Warn User
			if (newState === EQUIPPED_STATES.NOT_CARRIED) {
				ui.notifications.warn(_loc('A5E.armorClass.armorAlreadyEquipped'));
			}
		}

		if (newState === EQUIPPED_STATES.EQUIPPED && objectType === 'shield') {
			const shields = this.actor.itemTypes.object.filter(
				(i) =>
					i.system.equippedState === EQUIPPED_STATES.EQUIPPED && i.system.objectType === 'shield',
			);

			if (shields.length >= 2) newState = EQUIPPED_STATES.EQUIPPED;
			if (newState === EQUIPPED_STATES.EQUIPPED) {
				ui.notifications.warn(_loc('A5E.armorClass.shieldAlreadyEquipped'));
			}
		}

		await this.update({
			'system.equippedState': newState,
		});
	}

	/** Toggles identified state of an object */
	async toggleUnidentified(this: Item.OfType<'object'>) {
		await this.update({
			'system.unidentified': !this.system.unidentified,
		});
	}

	/** ---------------------------------- */
	//  Toggles (Spell)
	/** ---------------------------------- */

	/** Toggles Prepared status on a spell */
	async togglePrepared(this: Item.OfType<'spell'>) {
		if (!this.isType('spell') || !this.actor) return;

		const currentState = this.system.prepared;
		const newState = (currentState + 1) % 3;

		await this.update({
			'system.prepared': newState,
		});
	}

	/** ================================================================= */
	// Roll Data
	/** ================================================================= */

	/** @inheritdoc */
	override getRollData() {
		const data = { ...super.getRollData() };

		// Call sub methods
		if (this.isOriginItem()) this.getOriginRollData(data);

		return data;
	}

	/** ---------------------------------- */
	// Roll Data (Origin)
	/** ---------------------------------- */
	getOriginRollData(this: OriginItem, data: Record<string, any>) {
		// Call sub methods
		if (this.isType('archetype')) this.getArchetypeRollData(data);
		if (this.isType('class')) this.getClassRollData(data);

		return data;
	}

	/** ---------------------------------- */
	// Roll Data (Archetype)
	/** ---------------------------------- */
	/** Gets roll data for an archetype Item */
	getArchetypeRollData(this: Item.OfType<'archetype'>, data: Record<string, any>) {
		const resources = this.resources?.rollData ?? {};

		data.actorTransfer = {
			resources,
			...resources,
		};

		return data;
	}

	/** ---------------------------------- */
	// Roll Data (Class)
	/** ---------------------------------- */
	/** Gets roll data for a class Item */
	getClassRollData(this: Item.OfType<'class'>, data: Record<string, any>) {
		const resources = this.resources?.rollData ?? {};

		const { archetype } = this;
		if (archetype) {
			const subResources = archetype.resources?.rollData ?? {};
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

	/** ================================================================= */
	// Document Update Hooks
	/** ================================================================= */

	/** ---------------------------------- */
	// Pre Create
	/** ---------------------------------- */

	/** @inheritdoc */
	override async _preCreate(...[data, options, user]: Parameters<Item['_preCreate']>) {
		// Perform migration if needed
		const version = MigrationRunnerBase.LATEST_MIGRATION_VERSION;
		const docVersion = this.system.migrationData?.version;

		if (!docVersion) {
			this.updateSource({
				// @ts-expect-error
				'this.system.migrationData': {
					version,
					type: 'Item',
				},
			});
		} else if (docVersion < version) {
			await handleDocumentImportMigration(this);
		}

		// biome-ignore lint/suspicious/noConfusingVoidType: <This can be void>
		let create: boolean | void = true;

		// Call sub methods
		if (this.isType('feature')) create = await this._preCreateFeature(data, options, user);
		if (this.isType('spell')) create = await this._preCreateSpell(data, options, user);
		if (this.isOriginItem()) create = await this._preCreateOrigin(data, options, user);

		if (create === false) return false;
		await super._preCreate(data, options, user);
	}

	/** ---------------------------------- */
	// Pre Create (Feature)
	/** ---------------------------------- */
	async _preCreateFeature(
		this: Item.OfType<'feature'>,
		...[data, options, user]: Parameters<Item['_preCreate']>
	) {
		if (user.id !== game.userId) return;

		if (this.system.featureType === 'driverFeature') {
			if (this.actor && !this.actor.isVehicle()) {
				ui.notifications.warn(localize('A5E.vehicle.driverFeatureWarning'));
				return false;
			}
		}

		// Apply grants if any
		if (this.parent?.documentName === 'Actor' && this.parent.isChar()) {
			const actor = this.parent;
			options.keepId = true;
			// @ts-expect-error
			if (!options.noGrant) actor.grants.createInitialGrants(this, true);
		}
	}

	/** ---------------------------------- */
	// Pre Create (Spell)
	/** ---------------------------------- */

	/** Pre Create data for a spell. This must return true if item is to be created */
	async _preCreateSpell(
		this: Item.OfType<'spell'>,
		...[data, options, user]: Parameters<Item['_preCreate']>
	) {
		if (!this.system?.spellBook && this.parent?.documentName === 'Actor') {
			ui.notifications.error('You must select a spell book to create a spell.');
			return false;
		}
	}

	/** ---------------------------------- */
	// Pre Create (Origin)
	/** ---------------------------------- */

	/** Pre Create data for an origin Item. This must return true if item is to be created */
	async _preCreateOrigin(
		this: OriginItem,
		...[data, options, user]: Parameters<Item['_preCreate']>
	) {
		let create: boolean | void = true;

		// Call sub methods
		if (this.isType('class')) create = await this._preCreateClass(data, options, user);

		if (create === false) return false;
		if (user.id !== game.userId) return;

		// Apply grants if any
		if (this.actor) {
			const actor = this.actor;

			// Keep id of the original document
			options.keepId = true;
			// @ts-expect-error
			if (!options.noGrant) await actor.grants.createInitialGrants(this, true);
		}
	}

	/** ---------------------------------- */
	// Pre Create (Class)
	/** ---------------------------------- */

	/** Pre Create data for a class Item. This must return true if item is to be created */
	async _preCreateClass(
		this: Item.OfType<'class'>,
		...[data, options, user]: Parameters<Item['_preCreate']>
	) {
		foundry.utils.setProperty(data, 'system.classLevels', 1);
		foundry.utils.setProperty(data, 'system.hp.hitDiceUsed', 0);

		// Reset hp rolls
		Array.from({ length: 19 }, (_, i) => i + 2).forEach((level) => {
			foundry.utils.setProperty(data, `system.hp.levels.${level}`, 0);
		});

		if (this.parent?.documentName === 'Actor') {
			const actor = this.parent;
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
				existing.update({
					'system.classLevels': Math.min(existing.system.classLevels + 1, 20),
				});
				return false;
			}
		}

		this.updateSource(data);
	}

	/** ---------------------------------- */
	// Pre Update
	/** ---------------------------------- */

	/** @inheritdoc */
	override async _preUpdate(...[data, options, user]: Parameters<Item['_preUpdate']>) {
		// biome-ignore lint/suspicious/noConfusingVoidType: <This can be void>
		let update: boolean | void = false;

		// Call sub methods
		if (this.isType('feature')) update = await this._preUpdateFeature(data, options, user);
		if (this.isType('object')) update = await this._preUpdateObject(data, options, user);
		if (this.isOriginItem()) update = await this._preUpdateOrigin(data, options, user);

		if (update === false) return false;
		await super._preUpdate(data, options, user);
	}

	/** ---------------------------------- */
	// Pre Update (Feature)
	/** ---------------------------------- */

	/** Pre Update for objects */
	async _preUpdateFeature(
		this: Item.OfType<'feature'>,
		...[data, options, user]: Parameters<Item['_preUpdate']>
	) {
		if (foundry.utils.getProperty(data, 'system.featureType') === 'driverFeature') {
			if (this.actor && !this.actor.isVehicle()) {
				ui.notifications.warn(localize('A5E.vehicle.driverFeatureWarning'));
				return false;
			}
		}
	}

	/** ---------------------------------- */
	// Pre Update (Object)
	/** ---------------------------------- */

	/** Pre Update for objects */
	async _preUpdateObject(
		this: Item.OfType<'object'>,
		...[data, options, user]: Parameters<Item['_preUpdate']>
	) {
		// Containers
		if (
			foundry.utils.getProperty(data, 'system.objectType') &&
			this.system.objectType === 'container'
		) {
			const updates: Record<string, any> = {};
			const children = Object.entries(this.system.items ?? {});

			for await (const [key, item] of children) {
				updates[`system.items.${key}`] = _del;

				const child = await fromUuid<Item.OfType<'object'>>(item.uuid);
				if (!child) continue;

				await child.update({ 'system.containerId': '' });
			}

			await this.update(updates);
		}
	}

	/** ---------------------------------- */
	// Pre Update (Origin)
	/** ---------------------------------- */

	/** Pre Update for objects */

	async _preUpdateOrigin(
		this: OriginItem,
		...[data, options, user]: Parameters<Item['_preUpdate']>
	) {
		let update: boolean | void = true;

		// Call sub methods
		if (this.isType('class')) update = await this._preUpdateClass(data, options, user);

		return update;
	}

	/** ---------------------------------- */
	// Pre Update (Class)
	/** ---------------------------------- */

	/** Pre Update for objects */
	async _preUpdateClass(
		this: Item.OfType<'class'>,
		...[data, options, user]: Parameters<Item['_preUpdate']>
	) {
		const keys = Object.keys(foundry.utils.flattenObject(data));
		if (keys.includes('system.hp.hitDiceSize') && (this.isStartingClass || !this.parent)) {
			const size = foundry.utils.getProperty(data, 'system.hp.hitDiceSize');
			// @ts-expect-error
			await this.updateSource({ 'system.hp.levels.1': size });
		}

		if (
			keys.includes('system.slug') &&
			this.isStartingClass &&
			this.parent?.documentName === 'Actor'
		) {
			const slug = foundry.utils.getProperty(data, 'system.slug');
			this.parent.update({ 'system.classes.startingClass': slug });
		}

		// Clamp hitDice used
		if (keys.includes('system.hp.hitDiceUsed')) {
			const used = foundry.utils.getProperty(data, 'system.hp.hitDiceUsed') as number;
			const max = this.totalHitDice;
			data.system.hp.hitDiceUsed = Math.clamp(used, 0, max);
		}

		if (this.parent?.documentName === 'Actor' && keys.includes('system.classLevels')) {
			const actor = this.parent;
			const currentLevel = this.system.classLevels;
			const newLevel = foundry.utils.getProperty(data, 'system.classLevels');
			// @ts-expect-error
			const result = await actor.grants.createLeveledGrants(currentLevel, newLevel, this);
			if (!result) return false;
		}
	}

	/** ---------------------------------- */
	// On Create
	/** ---------------------------------- */

	/** @inheritdoc */
	override _onCreate(...[data, options, userId]: Parameters<Item['_onCreate']>) {
		super._onCreate(data, options, userId);

		if (userId === game.userId) {
			// Update effect origins
			const effects = this.effects.contents;
			const updateArr = effects.map((effect) => ({
				_id: effect._id,
				origin: this.uuid,
			}));

			this.updateEmbeddedDocuments('ActiveEffect', updateArr);
		}

		// Call sub methods
		if (this.isType('object')) this._onCreateObject(data, options, userId);
		if (this.isOriginItem()) this._onCreateOrigin(data, options, userId);
	}

	/** ---------------------------------- */
	// On Create (Object)
	/** ---------------------------------- */

	/** On Create for objects */
	async _onCreateObject(
		this: Item.OfType<'object'>,
		...[data, options, userId]: Parameters<Item['_onCreate']>
	) {
		if (userId !== game.userId) return;

		if (this.system.objectType === 'container') {
			if (this.parent?.documentName === 'Actor') {
				if (this.system.contentsOnly) {
					await ContainerManager.unpackContainerOnActor(this.parent, this);
				} else {
					await ContainerManager.createContainerOnActor(this.parent, this);
				}
			} else if (this.pack) {
				// Do Nothing
			} else {
				await ContainerManager.createContainerOnSidebar(this);
			}
		}

		const updates: Record<string, any> = {};

		// Clean container Id on object creation
		const container = await fromUuid<Item.OfType<'object'>>(this.system.containerId);
		if (!container) updates['system.containerId'] = '';

		// Update quality and quantity consumers to set themselves as target
		const actions = Object.entries(this.system.actions ?? {});
		actions.forEach(([actionId, action]) => {
			const consumers = Object.entries(action.consumers ?? {});
			consumers.forEach(([consumerId, consumer]) => {
				if (consumer.type !== 'quality' && consumer.type !== 'quantity') return;
				updates[`system.actions.${actionId}.consumers.${consumerId}.itemId`] = this._id;
			});
		});

		await this.update(updates);
	}

	/** ---------------------------------- */
	// On Create (Origin)
	/** ---------------------------------- */

	/** On Create for origin items */
	async _onCreateOrigin(
		this: OriginItem,
		...[data, options, userId]: Parameters<Item['_onCreate']>
	) {
		// Call Sub Methods
		if (this.isType('class')) this._onCreateClass(data, options, userId);
	}

	/** ---------------------------------- */
	// On Create (Class)
	/** ---------------------------------- */

	/** On Create for class items */
	async _onCreateClass(
		this: Item.OfType<'class'>,
		...[data, options, userId]: Parameters<Item['_onCreate']>
	) {
		// Update class resource values
		if (this.actor) {
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

	/** ---------------------------------- */
	// On Delete
	/** ---------------------------------- */

	/** @inheritdoc */
	override _onDelete(...[options, userId]: Parameters<Item['_onDelete']>) {
		super._onDelete(options, userId);

		// Call sub methods
		if (this.isType('feature')) this._onDeleteFeature(options, userId);
		if (this.isType('object')) this._onDeleteObject(options, userId);

		if (this.isOriginItem()) this._onDeleteOrigin(options, userId);
	}

	/** ---------------------------------- */
	// On Delete (Feature)
	/** ---------------------------------- */

	/** On Delete for objects */
	async _onDeleteFeature(
		this: Item.OfType<'feature'>,
		...[options, userId]: Parameters<Item['_onDelete']>
	) {
		if (this.parent?.documentName === 'Actor') {
			const actor = this.parent;
			await actor.grants?.removeGrantsByItem(this);
		}
	}

	/** ---------------------------------- */
	// On Delete (Object)
	/** ---------------------------------- */

	/** On Delete for objects */
	async _onDeleteObject(
		this: Item.OfType<'object'>,
		...[options, userId]: Parameters<Item['_onDelete']>
	) {
		if (userId !== game.userId) return;

		// Clean up items if container is deleted
		if (this.parent?.documentName === 'Actor' && this.system.objectType === 'container') {
			const items = Object.values(this.system.items ?? {}).map(({ uuid }) =>
				fromUuidSync<Item.OfType<'object'>>(uuid),
			);

			const updates = items
				.filter((i) => !!i && i.parent?.id === this.parent.id)
				.map((i) => ({ _id: i?.id, 'system.containerId': '' }));

			if (updates.length > 0) {
				await this.parent?.updateEmbeddedDocuments('Item', updates);
			}
		}

		// Clean up container if item is deleted
		const container = await fromUuid<Item.OfType<'object'>>(this.system.containerId);
		if (container) await container?.containerItems?.delete(this.uuid!);
	}

	/** ---------------------------------- */
	// On Delete (Origin)
	/** ---------------------------------- */

	/** On Delete for origin items */
	async _onDeleteOrigin(this: OriginItem, ...[options, userId]: Parameters<Item['_onDelete']>) {
		if (this.parent?.documentName === 'Actor') {
			const actor = this.parent;
			await actor.grants?.removeGrantsByItem(this);
		}

		// Call Sub Methods
		if (this.isType('class')) this._onDeleteClass(options, userId);
	}

	/** ---------------------------------- */
	// On Delete (Class)
	/** ---------------------------------- */

	/** On Delete for class items */
	async _onDeleteClass(
		this: Item.OfType<'class'>,
		...[options, userId]: Parameters<Item['_onDelete']>
	) {
		if (this.isStartingClass && this.parent?.documentName === 'Actor') {
			const actor = this.parent;
			actor.update({ 'system.classes.startingClass': '' });
		}

		if (this.actor) {
			// Delete associated archetype
			const { archetype } = this;
			if (archetype) archetype.delete();

			// Delete actor resource data
			const resourceData = this.resources.consumableResources.reduce((acc, r) => {
				acc[`${r.slug}`] = _del;
				return acc;
			}, {});

			this.actor?.update({ 'system.resources.classResources': resourceData });
		}
	}
}

export { ItemA5E };
