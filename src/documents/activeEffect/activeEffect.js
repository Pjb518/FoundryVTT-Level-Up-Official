/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */

// eslint-disable-next-line import/no-unresolved
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

import getCorrectedTypeValueFromKey from './getCorrectedTypeValueFromKey';
import getDeterministicBonus from '../../dice/getDeterministicBonus';
import castType from '../../utils/castType';

const { fields } = foundry.data;

/**
 * Add system-specific logic to the base ActiveEffect Class
 */
export default class ActiveEffectA5e extends ActiveEffect {
  // -------------------------------------------------------
  //  Static Properties
  // -------------------------------------------------------
  static FALLBACK_ICON = 'icons/svg/aura.svg';

  static PHASES = ['applyAEs', 'beforeDerived', 'afterDerived'];

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
    // TODO: Refactor this when item effects are added
    if (this.disabled || this.parent.documentName !== 'Actor') return true;
    const { parentItem } = this;
    if (!parentItem) return false;
    return parentItem?.system?.equipped;
  }

  get parentItem() {
    if (this.parent instanceof Actor) return null;
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
  apply(actor, change) {
    if (this.isSuppressed) return null;

    // Validate Data

    // Determine types
    const current = getCorrectedTypeValueFromKey(actor, change.key) ?? null;
    const targetType = foundry.utils.getType(current);
    const delta = castType(
      this.#convertToDeterministicBonus(actor, change),
      targetType
    );

    const newValue = this.#getNewValue(current, change, delta);

    return super.apply(actor, change);
  }

  /**
   * Returns the new value that should be applied to the actor.
   * @param {*} current
   * @param {*} change
   */
  #getNewValue(current, change, delta) {
    const { mode } = change;

    if (mode === 'ADD') return this.#addOrSubtractValues(current, delta);

    if (mode === 'MULTIPLY') { }

    if (['SUBTRACT', 'REMOVE'].includes(mode)) { }

    if (mode === 'DOWNGRADE') { }

    if (mode === 'UPGRADE') { }

    if (mode === 'OVERRIDE') { }

    if (mode === 'CUSTOM') { }

    return null;
  }

  #addOrSubtractValues(current, change) {
    const isNumericAddition = typeof change === 'number'
      && (typeof current === 'number' || [undefined, null].includes(current));
    const isArrayAdd = Array.isArray(current) && current.every((e) => typeof e === typeof change);
    const isSetAdd = current instanceof Set;

    if (isNumericAddition) return (current ?? 0) + change;
    if (isArrayAdd || isSetAdd) return change;

    return null;
  }

  /**
   * @inheritdoc
   */
  _applyCustom(document, change, current, delta, changes) {
    if (!change.key.startsWith('flags.a5e.effects')) { return super._applyCustom(document, change, current, delta, changes); }

    let newKey = '';
    let update = '';

    // TODO: Move to own utility function
    switch (change.key) {
      case 'flags.a5e.effects.damageResistances.all':
      case 'flags.a5e.effects.damageVulnerabilities.all':
      case 'flags.a5e.effects.damageImmunities.all':
        newKey = `system.traits.${change.key.split('.').at(-2)}`;
        update = Object.keys(CONFIG.A5E.damageTypes);
        break;
      case 'flags.a5e.effects.conditionImmunities.all':
        newKey = `system.traits.${change.key.split('.').at(-2)}`;
        update = Object.keys(CONFIG.A5E.conditions);
        break;
      default:
        break;
    }

    changes[newKey] = update;
  }

  async duplicateEffect() {
    const owningDocument = this.parent;
    const newEffect = foundry.utils.duplicate(this);
    newEffect.name = `${localize(newEffect.name)} (Copy)`;

    if (owningDocument) owningDocument.createEmbeddedDocuments('ActiveEffect', [newEffect]);
  }

  async toggleActiveState() {
    await this.update({ disabled: !this.disabled });
  }

  /**
   * Transfer the affect to another token.
   */
  transferEffect(token) {
    const data = [{
      name: this.name,
      origin: this.parent.uuid,
      changes: this.changes
    }];

    token.actor.createEmbeddedDocuments('ActiveEffect', data);
  }

  /**
   *
   * @param {import("../actor").default| import("../item").default} document
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
  }

  /**
   *
   * @param {import("../actor").default| import("../item").default} document
   * @param {Array<ActiveEffectA5e>} effects
   * @param {() => boolean} predicate
   */
  static applyEffects(document, effects, predicate = () => true) {
    const overrides = {};

    // Extract and organize changes and apply a priority if it doesn't exist.
    // BasePriority is determined by CONST.ACTIVE_EFFECTS_MODE * 10
    const applyObjects = effects.flatMap((effect) => {
      if (effect.disabled || effect.isSuppressed) return [];

      // Add status effects to actor list
      effect.statuses.forEach((statusId) => document.statuses.add(statusId));

      return effect.changes.filter(predicate).map((change) => {
        change.priority = change.priority ?? change.mode * 10;
        return { effect, change };
      });
    });

    applyObjects.sort((a, b) => (a.change.priority ?? 0) - (b.change.priority ?? 0));

    // Apply changes to calling document
    applyObjects.forEach((applyObject) => {
      if (!applyObject.change?.key) return;
      const appliedChange = applyObject.effect.apply(document, applyObject.change);
      Object.assign(overrides, appliedChange);
    });

    // Update document overrides
    document.overrides = foundry.utils.expandObject({
      ...foundry.utils.flattenObject(document.overrides),
      ...overrides
    });
  }

  /**
   * Creates a new default active effect on an actor or an item
   * @param {import("../actor").default| import("../item").default} parentDocument
   * @returns
   */
  static createDefaultEffect(parentDocument) {
    const data = {
      name: localize('A5E.effects.new'),
      icon: this.FALLBACK_ICON,
      flags: {
        a5e: {
          sort: 0,
          phase: 'applyAEs'
        }
      }
    };
    return super.create(data, { parent: parentDocument });
  }
}
