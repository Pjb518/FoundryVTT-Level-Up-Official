import { ActionsManager } from '#managers/ActionsManager.ts';
import { ContainerManager } from '#managers/ContainerManager.ts';
import { ItemGrantsManager } from '#managers/ItemGrantsManager.ts';
import { RollStateManager } from '#managers/RollStateManager.ts';
import type { Action } from '#types/action.d.ts';
import { getSummaryData } from '#utils/summaries/getSummaryData.ts';
import ActionSelectionDialog from '#view/dialogs/action/ActionSelectionDialog.svelte';
import { ActionActivationDialog } from '#view/dialogs/initializers/ActionActivationDialog.svelte.ts';
import { GenericConfigDialog } from '#view/dialogs/initializers/GenericConfigDialog.svelte.ts';
import type { AttackRollData } from '../../dataModels/item/actions/ActionRollsDataModel.ts';
import { getDeterministicBonus } from '../../dice/getDeterministicBonus.ts';
import { BaseItemA5e } from './base.svelte.ts';
import type { ActionActivationOptions } from './data.ts';

// *****************************************************************************************

/**
 * Override and extend the basic Item implementation.
 * @extends {Item}
 */
class ItemA5e<
	SubType extends Item.SubType = 'interaction' | 'feature' | 'object' | 'spell',
> extends BaseItemA5e<SubType> {
	/** Manager in charge of actions on the item */
	declare actions: ActionsManager;

	/** Manager in charge of container items on a container */
	declare containerItems: ContainerManager | null;

	/** Manager in charge of grants on an item */
	declare grants: SubType extends 'feature' ? ItemGrantsManager : null;

	/** ================================================================= */
	// Type Helpers
	/** ================================================================= */

	/** ================================================================= */
	// Getters
	/** ================================================================= */

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
	protected override _initialize(options?: Record<string, unknown>) {
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
	override async duplicateItem() {
		if (this.isType('object')) {
			// This is done here because we don't want to call super
			if (this.system.objectType === 'container') {
				if (!this.actor) return null;

				const container = await ContainerManager.createContainerOnActor(this.actor, this);
				return container;
			}

			this.duplicateObject();
		}

		super.duplicateItem();
	}

	/** ---------------------------------- */
	// Object
	/** ---------------------------------- */
	/** Duplicate data for objects */
	async duplicateObject(this: Item.OfType<'object'>) {}

	// *****************************************************************************************

	/**
   * A handler for activating an item. An actionId can be passed to this method to use a specific
   * action defined on the item. If there are no actions defined, this method defaults to
   * outputting the item's description.
   *
  //  * This method accepts an options object to further customize the activation process.
   *
   * @param actionId - The action id
   * @param options
   * @returns
   */
	override async activate(actionId: string | null, options: ActionActivationOptions = {}) {
		// Do not allow an item to activate if it not attached to an actor or if the user does
		// not have owner permissions for the actor.
		if (!this.actor?.isOwner) return;

		if (this.actor?.getFlag('a5e', 'automaticallyExecuteAvailableMacros') ?? true) {
			// @ts-expect-error
			options.executeMacro ??= this.system.macro.trim().length > 0 || this.actions.hasMacro;
		}

		if (this.actions.count === 0) {
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
			actionUses = consumers.actionUses.getActivationData(this.actor!, this as ItemA5e);
		}

		let itemUses = {};
		if (consumers.itemUses) {
			itemUses = consumers.itemUses.getActivationData(this.actor!, this as ItemA5e);
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
			spell = consumers.spell.getActivationData(this.actor!, this as ItemA5e).spellData;
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

	/** ================================================================= */
	// Helper Methods
	/** ================================================================= */

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
	// Document Update Hooks
	/** ================================================================= */

	/** ---------------------------------- */
	// Pre Create
	/** ---------------------------------- */

	/** @inheritdoc */
	override async _preCreate(...[data, options, user]: Parameters<Item['_preCreate']>) {
		if (this.isType('feature')) await this._preCreateFeature(data, options, user);

		await super._preCreate(data, options, user);

		// Call sub methods
		if (this.isType('spell')) await this._preCreateSpell(data, options, user);
	}

	/** ---------------------------------- */
	// Pre Create (Feature)
	/** ---------------------------------- */
	async _preCreateFeature(
		this: Item.OfType<'feature'>,
		...[data, options, user]: Parameters<Item['_preCreate']>
	) {
		if (user.id !== game.userId) return;

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
	// Pre Update
	/** ---------------------------------- */

	/** @inheritdoc */
	override async _preUpdate(...[data, options, user]: Parameters<Item['_preUpdate']>) {
		await super._preUpdate(data, options, user);

		// Call sub methods
		if (this.isType('object')) await this._preUpdateObject(data, options, user);
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
	// On Create
	/** ---------------------------------- */

	/** @inheritdoc */
	override _onCreate(...[data, options, userId]: Parameters<Item['_onCreate']>) {
		super._onCreate(data, options, userId);

		// Call sub methods
		if (this.isType('object')) this._onCreateObject(data, options, userId);
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
	// On Delete
	/** ---------------------------------- */

	/** @inheritdoc */
	override _onDelete(...[options, userId]: Parameters<Item['_onDelete']>) {
		super._onDelete(options, userId);

		// Call sub methods
		if (this.isType('feature')) this._onDeleteFeature(options, userId);
		if (this.isType('object')) this._onDeleteObject(options, userId);
	}

	/** ---------------------------------- */
	// On Delete (Feature)
	/** ---------------------------------- */

	/** On Delete for objects */
	async _onDeleteFeature(
		this: Item.OfType<'object'>,
		...[options, userId]: Parameters<Item['_onDelete']>
	) {
		if (this.parent?.documentName === 'Actor') {
			const actor = this.parent;
			await actor.grants.removeGrantsByItem(this);
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
}

export { ItemA5e };
