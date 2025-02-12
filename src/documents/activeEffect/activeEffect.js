/* eslint-disable no-param-reassign */
import { localize } from '#runtime/util/i18n';

import castType from '../../utils/castType';
import evaluateConditional from './utils/evaluateConditional';
import getCorrectedTypeValueFromKey from './utils/getCorrectedTypeValueFromKey';
import getDeterministicBonus from '../../dice/getDeterministicBonus';

/**
 * Add system-specific logic to the base ActiveEffect Class
 */
export default class ActiveEffectA5e extends ActiveEffect {
	// -------------------------------------------------------
	//  Static Properties
	// -------------------------------------------------------
	static FALLBACK_IMG = 'icons/svg/hazard.svg';

	static PHASES = ['applyAEs', 'afterDerived'];

	static ITEM_TYPES = ['passive', 'onUse'];

	// -------------------------------------------------------
	//  Getters
	// -------------------------------------------------------
	/**
	 * @returns {Boolean}
	 */
	get isSuppressed() {
		if (this.disabled || !['Actor', 'ActorDelta', 'Token'].includes(this.parent.documentName))
			return true;

		if (this.system.effectType === 'onUse') return false;

		const { parentItem } = this;
		if (!parentItem || parentItem?.type !== 'object') return false;

		return parentItem?.system?.equippedState !== CONFIG.A5E.EQUIPPED_STATES.EQUIPPED;
	}

	get parentItem() {
		if (!(this.parent instanceof Actor)) return null;

		const idRegex = /Item\.([a-zA-Z0-9]+)/;
		const itemId = this.origin?.match(idRegex)?.[1];

		if (!itemId) return null;
		return this.parent.items.get(itemId);
	}

	get isLocked() {
		if (!['Actor', 'ActorDelta', 'Token'].includes(this.parent.documentName)) return true;

		if (this.system.effectType === 'onUse') return false;

		const { parentItem } = this;
		if (!parentItem || parentItem?.type !== 'object') return false;

		return parentItem?.system?.equippedState !== CONFIG.A5E.EQUIPPED_STATES.EQUIPPED;
	}

	// -------------------------------------------------------
	//  Class Methods
	// -------------------------------------------------------
	/**
	 * @inheritdoc
	 */
	apply(document, _change, phase = 'applyAEs') {
		// eslint-disable-next-line no-constant-binary-expression
		if (this.isSuppressed) return null;

		const change = foundry.utils.deepClone(_change);
		change.key = change.key.replace('@token.', '');

		// Resolve/Validate Data
		if (phase === 'applyAEs') {
			const val = foundry.utils.deepClone(change.value).replace('@original', '');

			const resValue = Roll.replaceFormulaData(val, document.getRollData(), { missing: null });
			if (resValue.includes('null')) return null;
		}

		// Determine types
		const current = getCorrectedTypeValueFromKey(document, change.key) ?? null;
		if (change.mode !== CONFIG.A5E.ACTIVE_EFFECT_MODES.CUSTOM) {
			change.value = change.value.replace('@original', current);
		}

		const targetType = foundry.utils.getType(current);
		const delta = castType(this.#convertToDeterministicBonus(document, change), targetType);

		const newValue = this.#getNewValue(document, current, change, delta);
		const changes = { [change.key]: newValue };

		// Apply all changes to the Actor data
		foundry.utils.mergeObject(document, changes);
		return changes;
	}

	/**
	 * Returns the new value that should be applied to the actor.
	 * @param {*} current
	 * @param {*} change
	 */
	#getNewValue(document, current, change, delta) {
		const MODES = CONFIG.A5E.ACTIVE_EFFECT_MODES;
		const { mode } = change;

		if (mode === MODES.ADD) return this.#addOrSubtractValues(current, delta);

		if (mode === MODES.MULTIPLY) {
			if (!(typeof delta === 'number' && (typeof current === 'number' || current === undefined)))
				return current;
			return Math.trunc((current ?? 0) * delta);
		}

		if ([MODES.SUBTRACT, MODES.REMOVE].includes(mode)) {
			const addedChange =
				(typeof current === 'number' || current === undefined) && typeof delta === 'number'
					? -1 * delta
					: delta;

			return this.#addOrSubtractValues(current, addedChange, true);
		}

		if (mode === MODES.DOWNGRADE) {
			if (!(typeof delta === 'number' && (typeof current === 'number' || current === undefined)))
				return current;
			return Math.min(current ?? 0, delta);
		}

		if (mode === MODES.UPGRADE) {
			if (!(typeof delta === 'number' && (typeof current === 'number' || current === undefined)))
				return current;
			return Math.max(current ?? 0, delta);
		}

		if (mode === MODES.OVERRIDE) {
			// TODO: AE Rework - Add support for objects
			return delta;
		}

		if (mode === MODES.CUSTOM) {
			return this.#applyCustom(current, delta, change);
		}

		if (mode === MODES.CONDITIONAL) {
			return this.#applyConditional(document, current, change);
		}

		return current;
	}

	#addOrSubtractValues(current, delta, isSubtract = false) {
		const isNumericAddition =
			typeof delta === 'number' &&
			(typeof current === 'number' || [undefined, null].includes(current));
		const isArrayAdd = Array.isArray(current) && delta instanceof Array;
		const isSetAdd = current instanceof Set && delta instanceof Set;

		if (isNumericAddition) {
			return (current ?? 0) + delta;
		}

		if (isArrayAdd) {
			if (isSubtract) return current.filter((e) => !delta.includes(e));
			return [...new Set([...current, ...delta])];
		}

		if (isSetAdd) {
			if (isSubtract) return current.difference(delta);
			return current.union(delta);
		}

		if (!current.length) return delta;
		if (isSubtract) return `${current} - ${delta}`;
		return `${current} + ${delta}`;
	}

	#applyCustom(current, delta, change) {
		if (!change.key.startsWith('flags.a5e.effects')) return null;

		let newKey = '';
		delta = delta || '';

		// TODO: Refactor - Move to own utility function
		switch (change.key) {
			case 'flags.a5e.effects.damageResistances.all':
			case 'flags.a5e.effects.damageVulnerabilities.all':
			case 'flags.a5e.effects.damageImmunities.all':
				newKey = `system.traits.${change.key.split('.').at(-2)}`;
				delta = Object.keys(CONFIG.A5E.damageTypes);
				break;
			case 'flags.a5e.effects.conditionImmunities.all':
				newKey = `system.traits.${change.key.split('.').at(-2)}`;
				delta = Object.keys(CONFIG.A5E.conditions);
				break;
			default:
				// Case for adding custom bonuses
				if (change.key.startsWith('flags.a5e.effects.bonuses')) {
					const parts = change.key.split('.');
					const type = parts.at(-1);
					newKey = `system.bonuses.${type}.${foundry.utils.randomID()}`;
					break;
				}
				break;
		}

		change.key = newKey;
		return delta;
	}

	#applyConditional(document, current, change) {
		let obj;
		try {
			obj = JSON.parse(change.value);
			if (typeof obj !== 'object') return current;
		} catch (e) {
			return current;
		}

		let positiveValue = `${obj.positiveValue}`;
		let negativeValue = `${obj.negativeValue}`;

		const compareValue = getDeterministicBonus(obj.comparisonValue ?? '0', document.getRollData());
		const operator = obj.comparisonOperator ?? '==';
		positiveValue = getDeterministicBonus(positiveValue ?? '0', document.getRollData());
		negativeValue = getDeterministicBonus(negativeValue ?? '0', document.getRollData());

		return evaluateConditional(current, operator, compareValue, positiveValue, negativeValue);
	}

	/**
	 *
	 * @param {import("../actor/actor").default| import("../item").default} document
	 * @param {*} change
	 * @param {*} delta
	 */
	#convertToDeterministicBonus(document, change) {
		const isActor = document.documentName === 'Actor';
		const isItem = document.documentName === 'Item';

		if (change.mode === CONFIG.A5E.ACTIVE_EFFECT_MODES.CONDITIONAL) return 0;

		try {
			if (isActor) {
				const targetField = game.a5e.activeEffects.options[document.type].allOptions[change.key];
				if (typeof targetField.sampleValue !== 'number') return change.value;

				return getDeterministicBonus(change.value ?? 0, document.getRollData()) ?? change.value;
			}

			if (isItem && document.parent?.documentName === 'Actor') {
				return (
					getDeterministicBonus(change.value ?? 0, document.parent?.getRollData()) ?? change.value
				);
			}
		} catch (e) {
			// TODO: UX Upgrades - Handle invalid roll formula ui side to make sure it's always correct.
			// Invalid roll formula is handled in UI.
			return change.value;
		}

		return change.value;
	}

	// -------------------------------------------------------
	//  CRUD Methods
	// -------------------------------------------------------
	_onCreate(data, options, userId) {
		super._onCreate(data, options, userId);
		this.#updateCanvas();
		if (this.parent?.documentName === 'Item') return;

		this.#handleSubConditions(data, userId, true);
	}

	_preUpdate(data, options, userId) {
		// Update parent effect
		this._preUpdateParentEffect(data, options, userId);

		// Update status effects
		this._preUpdateStatusEffects(data, options, userId);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_preUpdateParentEffect(data, options, userId) {
		if (!(this.parent?.parent instanceof Actor)) return;
		const actor = this.parent.parent;

		if (this.system.effectType !== 'passive') return;
		const parentEffect = actor.effects.contents.find((e) => this.equals(e));
		if (!parentEffect) return;
		const parentUpdateData = foundry.utils.deepClone(data);
		delete parentUpdateData._id;
		parentEffect.update(parentUpdateData);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_preUpdateStatusEffects(data, options, userId) {
		const changes = data.changes ?? [];
		const statuses = new Set();
		changes.forEach((change) => {
			if (change.key !== 'flags.a5e.effects.statusConditions') return;
			let values;
			try {
				values = JSON.parse(change.value);
				if (!Array.isArray(values)) return;
			} catch (e) {
				return;
			}

			values.forEach((value) => {
				const statusEffect = CONFIG.statusEffects.find((e) => e.id === value);
				if (!statusEffect) return;
				statuses.add(statusEffect.id);
			});
		});

		if (!statuses.size) return;
		data.statuses = Array.from(statuses);
	}

	_onUpdate(data, options, userId) {
		super._onUpdate(data, options, userId);
		this.#updateCanvas();

		if (!(this.parent?.parent instanceof Actor)) return;
		const actor = this.parent.parent;

		actor.effectPhases = null;
		actor.reset();
	}

	/**
	 * Updates the canvas perception and lights if token effect has changed.
	 * @param {Object} data
	 */
	#updateCanvas() {
		// TODO: Move to related update on token document
		if (this.parent?.documentName !== 'Actor') return;

		const changeKeys = this.changes?.map((c) => c.key) ?? [];
		if (!changeKeys.some((k) => k.startsWith('@token'))) return;

		// Reset tokens
		if (foundry.utils.getProperty(this.parent, 'prototypeToken.actorLink') ?? true) {
			const tokens = this.parent.getActiveTokens().map((t) => t.document);
			if (!tokens.length) return;
			tokens.forEach((t) => {
				t?.reset();
				t?.object?.draw();
			});
		} else {
			if (!this.parent.token) return;
			this.parent.token.reset();
			this.parent.token.object.draw();
		}

		const updateLighting = changeKeys.some((k) => k.startsWith('@token.light'));

		if (updateLighting) {
			canvas.perception.update({ initializeLighting: updateLighting }, true);
		}
	}

	_onDelete(options, userId) {
		super._onDelete(options, userId);
		this.#updateCanvas();

		if (this.parent?.documentName !== 'Actor') return;

		this.parent.effectPhases = null;
		this.parent.reset();
		this.#handleSubConditions({}, userId, false);
	}

	async #handleSubConditions(data, userId, active) {
		if (game.user.id !== userId) return;

		const statuses = data.statuses ?? [...(this?.statuses ?? [])];
		const subConditions = new Set();

		statuses.forEach((statusId) => {
			const statusEffect = CONFIG.statusEffects.find((e) => e.id === statusId);
			if (!statusEffect) return;

			subConditions.add(...(statusEffect?.statuses ?? []));
		});

		if (!subConditions.size) return;
		const actor = this.parent;
		if (!actor) return;

		subConditions.forEach(async (c) => {
			const effect = CONFIG.statusEffects.find((e) => e.id === c);
			if (!effect) return;

			const newEffect = await actor.toggleStatusEffect(effect.id, { active });
			if (!newEffect) return;

			newEffect.update({ 'flags.a5e.source': statuses[0] });
		});
	}

	async duplicateEffect(actionId = null) {
		const owningDocument = this.parent;
		const newEffect = foundry.utils.duplicate(this);
		newEffect.name = `${localize(newEffect.name)} (Copy)`;

		if (!owningDocument) return;

		const effects = await owningDocument.createEmbeddedDocuments('ActiveEffect', [newEffect]);

		// Handle action update
		if (owningDocument?.documentName === 'Item' && actionId) {
			const action = owningDocument.actions.get(actionId);
			owningDocument.update({
				[`system.actions.${actionId}.effects`]: [[...action.effects], ...effects.map((e) => e.id)],
			});
		}
	}

	// -------------------------------------------------------
	//  Custom API
	// -------------------------------------------------------
	async toggleActiveState() {
		await this.update({ disabled: !this.disabled });
	}

	/**
	 * Transfer effect to another document
	 */
	transferEffect(document) {
		if (!['Actor', 'ActorDelta', 'Token'].includes(document.documentName)) {
			ui.notifications.error(
				`Document of type ${document.documentName} is not supported by this operation.`,
			);
		}

		const effectData = foundry.utils.deepClone(this);
		effectData.origin = this.parent.uuid;

		// Check if effect already exists
		const effects =
			document.documentName === 'Token'
				? document.actor.effects.contents
				: document.effects.contents;

		// eslint-disable-next-line no-restricted-syntax
		for (const effect of effects) {
			if (this.equals(effect)) {
				effect.update({ disabled: false });
				return;
			}
		}

		document.createEmbeddedDocuments('ActiveEffect', [effectData]);
	}

	equals(other) {
		const e1 = foundry.utils.deepClone(this.toObject());
		const e2 = foundry.utils.deepClone(other.toObject());

		delete e1._id;
		delete e2._id;

		delete e1.disabled;
		delete e2.disabled;

		delete e1.duration;
		delete e2.duration;

		delete e1.flags?.a5e?.sort;
		delete e2.flags?.a5e?.sort;

		delete e1.flags?.a5e?.actionId;
		delete e2.flags?.a5e?.actionId;

		e1.changes.forEach((c) => delete c.priority);
		e2.changes.forEach((c) => delete c.priority);

		return foundry.utils.objectsEqual(e1, e2);
	}

	// -------------------------------------------------------
	//  Static Methods
	// -------------------------------------------------------
	static generateExpandedEffects(applyObjects) {
		const expandedApplyObjects = [];
		const removalKeys = [];

		applyObjects.forEach(({ change, effect }) => {
			if (!CONFIG.A5E.EXPANDED_EFFECTS.has(change.key)) return;

			if (change.key === 'flags.a5e.effects.movement.allDistances') {
				const movementTypes = Object.keys(CONFIG.A5E.movement);
				movementTypes.forEach((movementType) => {
					const expandedChange = foundry.utils.deepClone(change);
					expandedChange.key = `system.attributes.movement.${movementType}.distance`;
					expandedApplyObjects.push({ effect, change: expandedChange });
					removalKeys.push(change.key);
				});
			}

			if (change.key === 'flags.a5e.effects.movements.allUnits') {
				const movementTypes = Object.keys(CONFIG.A5E.movement);
				movementTypes.forEach((movementType) => {
					const expandedChange = foundry.utils.deepClone(change);
					expandedChange.key = `system.attributes.movement.${movementType}.unit`;
					expandedApplyObjects.push({ effect, change: expandedChange });
					removalKeys.push(change.key);
				});
			}

			if (change.key === 'flags.a5e.effects.senses.allSenses') {
				const senses = Object.keys(CONFIG.A5E.senses);
				senses.forEach((sense) => {
					const expandedChange = foundry.utils.deepClone(change);
					expandedChange.key = `system.attributes.senses.${sense}.value`;
					expandedApplyObjects.push({ effect, change: expandedChange });
					removalKeys.push(change.key);
				});
			}

			if (change.key === 'flags.a5e.effects.senses.allUnits') {
				const senses = Object.keys(CONFIG.A5E.senses);
				senses.forEach((sense) => {
					const expandedChange = foundry.utils.deepClone(change);
					expandedChange.key = `system.attributes.senses.${sense}.unit`;
					expandedApplyObjects.push({ effect, change: expandedChange });
					removalKeys.push(change.key);
				});
			}

			if (change.key === 'system.attributes.spellDC') {
				const spellBookIds = Object.keys(effect.parent?.system?.spellBooks ?? {});
				spellBookIds.forEach((spellBookId) => {
					const expandedChange = foundry.utils.deepClone(change);
					expandedChange.key = `system.spellBooks.${spellBookId}.stats.dc`;
					expandedApplyObjects.push({ effect, change: expandedChange });
				});
			}
		});

		removalKeys.forEach((key) => {
			const idx = applyObjects.findIndex((e) => e.change.key === key);
			if (idx !== -1) applyObjects.splice(idx, 1);
		});

		applyObjects.push(...expandedApplyObjects);
	}

	/**
	 *
	 * @param {} document
	 * @param {Array<ActiveEffectA5e>} effects
	 * @param {() => boolean} predicate
	 */
	static applyEffects(document, effects, currentPhase, nextPhase, predicate = () => true) {
		const overrides = {};

		// Get apply data
		const applyObjects = effects.flatMap((effect) => {
			if (effect.disabled || effect.isSuppressed) return [];

			// Add status effects to actor list
			if (document.documentName !== 'Token') {
				effect.statuses.forEach((statusId) => document.statuses.add(statusId));
			}

			return effect._source.changes.filter(predicate).map((change) => {
				const originalPriority = change.priority ?? 0;
				change.priority = originalPriority ?? change.mode * 10;
				return { effect, change };
			});
		});

		// Add support for expanded effects
		this.generateExpandedEffects(applyObjects);

		if (currentPhase === 'afterDerived')
			applyObjects.push(...(document.effectPhases?.[currentPhase] ?? []));
		applyObjects.sort((a, b) => (a.change.priority ?? 0) - (b.change.priority ?? 0));

		// Apply changes to calling document
		applyObjects.forEach((applyObject) => {
			if (!applyObject.change?.key) return;

			// Determine if effect is applied on the actor or the token document.
			let appliedChange;
			if (document.documentName === 'Token' && currentPhase === 'afterDerived') {
				appliedChange = applyObject.effect.apply(document, applyObject.change, currentPhase);

				Object.assign(overrides, appliedChange);
			} else {
				appliedChange = applyObject.effect.apply(document, applyObject.change, currentPhase);

				// If appliedChange is null, retry in next phase
				if (appliedChange === null && !applyObject.effect.isSuppressed) {
					if (!nextPhase) {
						ui.notifications.error(localize('A5E.notifications.effects.invalidChange'));
						return;
					}

					let idx =
						document.effectPhases[nextPhase]?.findIndex(
							(e) =>
								e.effect._id === applyObject.effect._id && e.change.key === applyObject.change.key,
						) ?? -1;
					if (idx === -1) document.effectPhases[nextPhase].push(applyObject);

					if (currentPhase === 'afterDerived') return;

					idx =
						document.effectPhases[currentPhase]?.findIndex(
							(e) =>
								e.effect._id === applyObject.effect._id && e.change.key === applyObject.change.key,
						) ?? -1;
					if (idx !== -1) document.effectPhases[currentPhase].splice(idx, 1);
				}

				// Assign change to overrides object
				Object.assign(overrides, appliedChange);
			}
		});

		// Update document overrides
		document.overrides = foundry.utils.expandObject({
			...foundry.utils.flattenObject(document.overrides),
			...overrides,
		});
	}

	/**
	 * Creates a new default active effect on an actor or an item
	 * @param {import("../actor/actor").default| import("../item").default} parentDocument
	 * @returns
	 */
	static createDefaultEffect(parentDocument) {
		const data = {
			name: localize('A5E.effects.new'),
			icon: this.FALLBACK_IMG,
			flags: { a5e: { sort: 0 } },
		};
		return super.create(data, { parent: parentDocument });
	}
}
