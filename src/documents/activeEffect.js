/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */

// eslint-disable-next-line import/no-unresolved
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

import getDeterministicBonus from '../dice/getDeterministicBonus';

/** TODO:
 * - Allow editing of owned items.
 * - Enable active effects on item equip/unequip.
 * - Allow references to core actor data.
 * - Allow arithmetic in data definitions.
 * - Priority of effects.
 * - Allow macros to be executed.
 *
 * Add system-specific logic to the base ActiveEffect Class
*/
export default class ActiveEffectA5e extends ActiveEffect {
  static FALLBACK_ICON = 'icons/svg/aura.svg';

  source = undefined;

  /**
   * Returns the label of the effect. This getter is to keep in line with other documents.
   * @returns {String}
   */
  get name() {
    return this.label;
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

  /**
   * @inheritdoc
   */
  apply(document, change) {
    if (this.isSuppressed) return null;

    return super.apply(document, change);
  }

  /** @inheritdoc */
  _applyAdd(document, change, current, delta, changes) {
    if (current instanceof Set) {
      if (Array.isArray(delta)) delta.forEach((item) => current.add(item));
      else current.add(delta);
      return;
    }

    delta = this.#convertToDeterministicBonus(document, change, delta);

    super._applyAdd(document, change, current, delta, changes);
  }

  /** @inheritdoc */
  _applyMultiply(document, change, current, delta, changes) {
    delta = this.#convertToDeterministicBonus(document, change, delta);

    super._applyMultiply(document, change, current, delta, changes);
  }

  /** @inheritdoc */
  _applyOverride(document, change, current, delta, changes) {
    if (current instanceof Set) {
      current.clear();
      if (Array.isArray(delta)) delta.forEach((item) => current.add(item));
      else current.add(delta);
      return;
    }

    delta = this.#convertToDeterministicBonus(document, change, delta);
    return super._applyOverride(document, change, current, delta, changes);
  }

  /**
   * @inheritdoc
   */
  _applyCustom(document, change, current, delta, changes) {
    if (!change.key.startsWith('flags.a5e.effects'))
      return super._applyCustom(document, change, current, delta, changes);

    let newKey = "";
    let update = "";

    // TODO: Move to own utility function
    switch (change.key) {
      case 'flags.a5e.effects.damageResistances.all':
      case 'flags.a5e.effects.damageVulnerabilities.all':
      case 'flags.a5e.effects.damageImmunities.all':
        newKey = `system.traits.${change.key.split(".").at(-2)}`
        update = Object.keys(CONFIG.A5E.damageTypes);
        break;
      case 'flags.a5e.effects.conditionImmunities.all':
        newKey = `system.traits.${change.key.split(".").at(-2)}`
        update = Object.keys(CONFIG.A5E.conditions);
        break;
    }

    changes[newKey] = update;
  }

  /**
   * Transfer the affect to another token.
   */
  transferEffect(token) {
    const data = [{
      label: this.label,
      origin: this.parent.uuid,
      changes: this.changes
    }];

    token.actor.createEmbeddedDocuments('ActiveEffect', data);
  }

  /**
   *
   * @param {import("./actor").default| import("./item").default} document
   * @param {*} change
   * @param {*} delta
   */
  #convertToDeterministicBonus(document, change, delta) {
    const isActor = document.documentName === 'Actor';
    const isItem = document.documentName === 'Item';

    try {
      if (isActor) {
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
      return delta;
    }
  }

  /**
   *
   * @param {import("./actor").default| import("./item").default} document
   * @param {Array<ActiveEffectA5e>} effects
   * @param {() => boolean} predicate
   */
  static applyEffects(document, effects, predicate = () => true) {
    const overrides = {};

    // Extract and organize changes and apply a priority if it doesn't exist.
    // BasePriority is determined by CONST.ACTIVE_EFFECTS_MODE * 10
    const applyObjects = effects.flatMap((effect) => {
      if (effect.disabled || effect.isSuppressed) return [];

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
   * @param {import("./actor").default| import("./item").default} parentDocument
   * @returns
   */
  static createDefaultEffect(parentDocument) {
    const data = {
      label: localize('A5E.effects.new'),
      icon: this.FALLBACK_ICON
    };
    return super.create(data, { parent: parentDocument });
  }
}
