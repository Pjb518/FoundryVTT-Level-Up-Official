import { localize } from '#runtime/svelte/helper';

import getCorrectedTypeValueFromKey from './getCorrectedTypeValueFromKey';
import getDeterministicBonus from '../../dice/getDeterministicBonus';
import castType from '../../utils/castType';

/**
 * Add system-specific logic to the base ActiveEffect Class
 */
export default class ActiveEffectA5e extends ActiveEffect {
  // -------------------------------------------------------
  //  Static Properties
  // -------------------------------------------------------
  static FALLBACK_ICON = 'icons/svg/aura.svg';

  static PHASES = ['applyAEs', 'afterDerived'];

  static ITEM_TYPES = ['passive', 'onUse', 'permanent'];

  // -------------------------------------------------------
  //  Getters
  // -------------------------------------------------------
  /**
   * Convenience access to the ActiveEffect's icon field
   * @returns {String}
   */
  get img() {
    return this.icon || ActiveEffectA5e.FALLBACK_ICON;
  }

  /**
   * @returns {Boolean}
   */
  get isSuppressed() {
    if (this.disabled || !(['Actor', 'ActorDelta', 'Token'].includes(this.parent.documentName))) return true;

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

  // -------------------------------------------------------
  //  Class Methods
  // -------------------------------------------------------
  /**
   * @inheritdoc
   */
  apply(document, _change, phase = 'applyAEs') {
    // eslint-disable-next-line no-constant-binary-expression
    if (this.isSuppressed && (this.flags?.a5e?.transferType !== 'permanent' ?? true)) return null;

    const change = foundry.utils.deepClone(_change);
    change.key = change.key.replace('@token.', '');

    // Resolve/Validate Data
    if (phase !== 'afterDerived') {
      const resValue = Roll.replaceFormulaData(
        change.value,
        document.getRollData(),
        { missing: null }
      );
      if (resValue.includes('null')) return null;
    }

    // Determine types
    const current = getCorrectedTypeValueFromKey(document, change.key) ?? null;
    const targetType = foundry.utils.getType(current);
    const delta = castType(
      this.#convertToDeterministicBonus(document, change),
      targetType
    );

    const newValue = this.#getNewValue(current, change, delta);
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
  #getNewValue(current, change, delta) {
    const MODES = CONST.ACTIVE_EFFECT_MODES;
    const { mode } = change;

    if (mode === MODES.ADD) return this.#addOrSubtractValues(current, delta);

    if (mode === MODES.MULTIPLY) {
      if (!(typeof delta === 'number' && (typeof current === 'number' || current === undefined))) return current;
      return Math.trunc((current ?? 0) * delta);
    }

    if ([MODES.SUBTRACT, MODES.REMOVE].includes(mode)) {
      const addedChange = (typeof current === 'number' || current === undefined) && typeof delta === 'number'
        ? -1 * delta
        : delta;

      return this.#addOrSubtractValues(current, addedChange);
    }

    if (mode === MODES.DOWNGRADE) {
      if (!(typeof delta === 'number' && (typeof current === 'number' || current === undefined))) return current;
      return Math.min(current ?? 0, delta);
    }

    if (mode === MODES.UPGRADE) {
      if (!(typeof delta === 'number' && (typeof current === 'number' || current === undefined))) return current;
      return Math.max(current ?? 0, delta);
    }

    if (mode === MODES.OVERRIDE) {
      // TODO: Add support for objects
      return delta;
    }

    if (mode === MODES.CUSTOM) {
      return this.#applyCustom(change);
    }

    return current;
  }

  #addOrSubtractValues(current, delta, isSubtract = false) {
    const isNumericAddition = typeof delta === 'number'
      && (typeof current === 'number' || [undefined, null].includes(current));
    const isArrayAdd = Array.isArray(current) && delta instanceof Array;
    const isSetAdd = current instanceof Set && delta instanceof Set;

    if (isNumericAddition) {
      if (isSubtract) return (current ?? 0) - delta;
      return (current ?? 0) + delta;
    }

    if (isArrayAdd) {
      if (isSubtract) return current.filter((e) => e !== delta.includes(e));
      return [...current, ...delta];
    }

    if (isSetAdd) {
      if (isSubtract) return current.difference(delta);
      return current.union(delta);
    }

    if (!current.length) return delta;
    if (isSubtract) return `${current} - ${delta}`;
    return `${current} + ${delta}`;
  }

  #applyCustom(change) {
    if (!change.key.startsWith('flags.a5e.effects')) return null;

    let newKey = '';
    let delta = '';

    // TODO: Move to own utility function
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
        break;
    }

    change.key = newKey;
    return delta;
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

    try {
      if (isActor) {
        const targetField = game.a5e.activeEffects
          .EffectOptions.options[document.type].allOptionsObj[change.key];
        if (typeof targetField.sampleValue !== 'number') return change.value;

        return getDeterministicBonus(
          change.value ?? 0,
          document.getRollData()
        ) ?? change.value;
      }

      if (isItem && document.parent?.documentName === 'Actor') {
        return getDeterministicBonus(
          change.value ?? 0,
          document.parent?.getRollData()
        ) ?? change.value;
      }
    } catch (e) {
      // TODO: Handle invalid roll formula ui side to make sure it's always correct.
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
    if (this.parent?.documentName === 'Item') return;

    this.#addSubConditions(data);
  }

  _preUpdate(data, options, userId) {
    // Update parent effect
    this._preUpdateParentEffect(data, options, userId);

    // Update status effects
    this._preUpdateStatusEffects(data, options, userId);

    return super._preUpdate(data, options, userId);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _preUpdateParentEffect(data, options, userId) {
    if (!(this.parent?.parent instanceof Actor)) return;
    const actor = this.parent.parent;

    if (this.flags?.a5e?.transferType !== 'passive') return;
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
      if (change.key === 'flags.a5e.effects.statusCondition') return;
      const statusEffect = CONFIG.statusEffects.find((e) => e.id === change.value);
      if (!statusEffect) return;

      statuses.add(statusEffect.id);
    });

    data.statuses = Array.from(statuses);
  }

  _onUpdate(data, options, userId) {
    super._onUpdate(data, options, userId);
    this.#updateCanvas(data);

    if (!(this.parent?.parent instanceof Actor)) return;
    const actor = this.parent.parent;

    actor.effectPhases = null;
    actor.reset();
  }

  /**
   * Updates the canvas perception and lights if token effect has changed.
   * @param {Object} data
   */
  #updateCanvas(data) {
    if (this.parent?.documentName !== 'Actor') return;

    const hasDisabled = Object.keys(data).includes('disabled');
    const changeKeys = data.changes?.map((c) => c.key) ?? [];
    if (!(changeKeys.some((k) => k.startsWith('@token'))) && !hasDisabled) return;

    // Reset tokens
    if (foundry.utils.getProperty(this.parent, 'prototypeToken.actorLink') ?? true) {
      const tokens = this.parent.getActiveTokens().map((t) => t.document);
      if (!tokens.length) return;
      tokens.forEach((t) => t?.reset());
    } else {
      if (!this.parent.token) return;
      this.parent.token.reset();
    }

    const updateLighting = changeKeys.some((k) => k.startsWith('@token.light')) || hasDisabled;

    if (updateLighting) {
      canvas.perception.update({ initializeLighting: updateLighting }, true);
    }
  }

  _onDelete(options, userId) {
    super._onDelete(options, userId);
    if (this.parent?.documentName !== 'Actor') return;

    this.#deleteSubConditions();

    this.parent.effectPhases = null;
    this.parent.reset();
  }

  #addSubConditions(data) {
    const statuses = data.statuses ?? [];
    const subConditions = new Set();
    statuses.forEach((statusId) => {
      const statusEffect = CONFIG.statusEffects.find((e) => e.id === statusId);
      if (!statusEffect) return;

      subConditions.add(...statusEffect?.statuses ?? []);
    });

    if (!subConditions.size) return;
    const token = this.parent?.getActiveTokens()?.[0];
    if (!token) return;

    subConditions.forEach((c) => {
      if (this.parent?.statuses?.has(c)) return;
      const effect = CONFIG.statusEffects.find((e) => e.id === c);
      if (!effect) return;

      if (data.statuses?.[0]) {
        foundry.utils.setProperty(effect, 'flags.a5e.source', data.statuses[0]);
      }
      token.document.toggleActiveEffect(effect, { active: true });
    });
  }

  #deleteSubConditions() {
    const statuses = this.statuses ?? [];
    const subConditions = new Set();
    statuses.forEach((statusId) => {
      const statusEffect = CONFIG.statusEffects.find((e) => e.id === statusId);
      if (!statusEffect) return;

      subConditions.add(...statusEffect?.statuses ?? []);
    });

    if (!subConditions.size) return;
    const token = this.parent?.getActiveTokens()?.[0];
    if (!token) return;

    subConditions.forEach((c) => {
      const effect = CONFIG.statusEffects.find((e) => e.id === c);
      if (!effect) return;

      token.document.toggleActiveEffect(effect, { active: false });
    });
  }

  async duplicateEffect() {
    const owningDocument = this.parent;
    const newEffect = foundry.utils.duplicate(this);
    newEffect.name = `${localize(newEffect.name)} (Copy)`;

    if (owningDocument) owningDocument.createEmbeddedDocuments('ActiveEffect', [newEffect]);
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
    if (!(['Actor', 'ActorDelta', 'Token'].includes(document.documentName))) {
      ui.notifications.error(`Document of type ${document.documentName} is not supported by this operation.`);
    }

    const effectData = foundry.utils.deepClone(this);
    effectData.origin = this.parent.uuid;

    // Check if effect already exists
    const effects = document.documentName === 'Token'
      ? document.actor.effects.contents
      : document.effects.contents;

    // eslint-disable-next-line no-restricted-syntax
    for (const effect of effects) {
      if (this.equals(effect)) {
        ui.notifications.error(localize('A5E.effects.duplicate'));
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

    e1.changes.forEach((c) => delete c.priority);
    e2.changes.forEach((c) => delete c.priority);

    return foundry.utils.objectsEqual(e1, e2);
  }

  // -------------------------------------------------------
  //  Static Methods
  // -------------------------------------------------------
  /**
   *
   * @param {} document
   * @param {Array<ActiveEffectA5e>} effects
   * @param {() => boolean} predicate
   */
  static applyEffects(document, effects, currentPhase, nextPhase, predicate = () => true) {
    const overrides = {};

    // Get token data
    const applyObjects = effects.flatMap((effect) => {
      if (effect.disabled || effect.isSuppressed) return [];

      // Add status effects to actor list
      if (document.documentName !== 'Token') {
        effect.statuses.forEach((statusId) => document.statuses.add(statusId));
      }

      return effect.changes.filter(predicate).map((change) => {
        change.priority = change.priority ?? change.mode * 10;
        return { effect, change };
      });
    });

    if (currentPhase !== 'applyAEs') applyObjects.push(...document.effectPhases?.[currentPhase] ?? []);
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

          let idx = document.effectPhases[nextPhase]
            ?.findIndex((e) => e.effect._id === applyObject.effect._id
              && e.change.key === applyObject.change.key) ?? -1;
          if (idx === -1) document.effectPhases[nextPhase].push(applyObject);

          if (currentPhase !== 'applyAEs') return;

          idx = document.effectPhases[currentPhase]
            ?.findIndex((e) => e.effect._id === applyObject.effect._id
              && e.change.key === applyObject.change.key) ?? -1;
          if (idx !== -1) document.effectPhases[currentPhase].splice(idx, 1);
        }

        // Assign change to overrides object
        Object.assign(overrides, appliedChange);
      }
    });

    // Update document overrides
    document.overrides = foundry.utils.expandObject({
      ...foundry.utils.flattenObject(document.overrides),
      ...overrides
    });
  }

  static getPermanentEffectChanges(document, effects) {
    const overrides = {};

    // Get token data
    const applyObjects = effects.flatMap((effect) => effect.changes.map((change) => {
      change.priority = change.priority ?? change.mode * 10;
      return { effect, change };
    }));
    applyObjects.sort((a, b) => (a.change.priority ?? 0) - (b.change.priority ?? 0));

    // Create override object
    applyObjects.forEach((applyObject) => {
      if (!applyObject.change?.key) return;

      // Determine if effect is applied on the actor or the token document.
      let appliedChange;
      if (document.documentName === 'Token' || applyObject.change.key.startsWith('@token')) {
        // TODO: Add support for token overrides
        // appliedChange = applyObject.effect.apply(document, applyObject.change, 'afterDerived');
        // Object.assign(overrides, appliedChange);
      } else {
        appliedChange = applyObject.effect.apply(document, applyObject.change, 'afterDerived');
        if (!appliedChange) return;
        Object.assign(overrides, appliedChange);
      }
    });

    return overrides;
  }

  /**
   * Creates a new default active effect on an actor or an item
   * @param {import("../actor/actor").default| import("../item").default} parentDocument
   * @returns
   */
  static createDefaultEffect(parentDocument) {
    const data = {
      name: localize('A5E.effects.new'),
      icon: this.FALLBACK_ICON,
      flags: { a5e: { sort: 0 } }
    };
    return super.create(data, { parent: parentDocument });
  }
}
