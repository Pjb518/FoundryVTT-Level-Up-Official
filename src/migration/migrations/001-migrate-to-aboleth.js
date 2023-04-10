import MigrationBase from '../MigrationBase';

import isStandardRange from '../../utils/isStandardRange';

export default class Migration001Aboleth extends MigrationBase {
  /** @override */
  static version = 0.001;

  #updateItemRange(range) {
    if (isStandardRange(range)) return range;

    const ftInString = range.toLowerCase().includes('ft');
    if (!ftInString) return range;

    const matches = range.match(/\d+/);

    // eslint-disable-next-line no-param-reassign
    range = matches && Number(matches[0]) === 5 ? 'fiveFeet' : range;
    return range;
  }

  #updateItemWeight(system) {
    if (!system.weight?.length) return;

    // Extract numbers from string
    const weightString = system.weight;
    const matches = weightString.match(/\d+/);

    const weight = matches ? Number(matches[0]) : 0;

    system.weight = weight;
  }

  #updateActionsConfig(itemData) {
    const { actions } = itemData.system;

    // Step 0: Check if action is needed
    const {
      actionOptions, activation, duration, range, target
    } = itemData.system;

    if (!actionOptions?.length && !activation?.type
      && !duration?.unit && !range?.length && !target?.type
    ) return;

    // Step 1: Create an action for the item
    const action = {
      name: itemData.name
    };

    // Step 2: Get actionOptions and delete it

    // Step 3: Migrate activation data
    action.activation = foundry.utils.duplicate(itemData.system.activation);

    // Step 4: Migrate duration
    action.duration = foundry.utils.duplicate(itemData.system.duration);

    // Step 5: Migrate range
    if (itemData.system.range?.length) {
      action.ranges = {};
      itemData.system.range.forEach((r) => {
        // eslint-disable-next-line no-param-reassign
        r = this.#updateItemRange(r);
        action.ranges[foundry.utils.randomID()] = { range: r };
      });
    }

    // Step 6: Migrate area config
    action.area = foundry.utils.duplicate(itemData.system.area);
    action.area.placeTemplate = itemData.flags.a5e?.placeTemplate ?? false;
    itemData['flags.a5e.-=placeTemplate'] = null;

    // Step 7: Migrate target data
    action.target = foundry.utils.duplicate(itemData.system.target ?? {});

    // Step 8: Rolls & Prompts
    if (actionOptions.includes('attack')) {
      const attack = foundry.utils.duplicate(itemData.system.attack ?? {});
      attack.attackType = attack.type;
      attack.type = 'attack';
      attack.ability = itemData.system.ability;
      action.rolls = {
        ...action.rolls,
        [foundry.utils.randomID()]: attack
      };
    }

    if (actionOptions.includes('damage')) {
      itemData.system.damage.forEach((d) => {
        const damage = foundry.utils.duplicate(d);
        damage.type = 'damage';
        damage.formula = this.#replaceMod(itemData, 'default', damage.formula);
        action.rolls = {
          ...action.rolls,
          [foundry.utils.randomID()]: damage
        };
      });
    }

    if (actionOptions.includes('healing')) {
      itemData.system.healing.forEach((h) => {
        const healing = foundry.utils.duplicate(h);
        healing.formula = this.#replaceMod(itemData, 'default', healing.formula);
        healing.type = 'healing';
        action.rolls = {
          ...action.rolls,
          [foundry.utils.randomID()]: healing
        };
      });
    }

    if (actionOptions.includes('abilityCheck')) {
      const { check } = itemData.system;

      action.rolls = {
        ...action.rolls,
        [foundry.utils.randomID()]: {
          ability: check.ability,
          type: 'abilityCheck'
        }
      };
    }

    if (actionOptions.includes('savingThrow')) {
      const { save } = itemData.system;

      action.prompts = {
        ...action.prompts,
        [foundry.utils.randomID()]: {
          ability: save.targetAbility,
          onSave: save.onSave,
          saveDC: {
            type: 'custom',
            bonus: this.#replaceMod(itemData, save.targetAbility, save.dc)
          },
          type: 'savingThrow'
        }
      };
    }

    // Step 9: Delete old data
    itemData['system.-=actionOptions'] = null;
    itemData['system.-=activation'] = null;
    itemData['system.-=actionOptions'] = null;
    itemData['system.-=activation'] = null;
    itemData['system.-=duration'] = null;
    itemData['system.-=range'] = null;
    itemData['system.-=area'] = null;
    itemData['system.-=target'] = null;
    itemData['system.-=attack'] = null;
    itemData['system.-=damage'] = null;
    itemData['system.-=healing'] = null;
    itemData['system.-=check'] = null;
    itemData['system.-=savingThrow'] = null;

    // Step 10: Add action to update data
    itemData.system.actions = {
      ...actions,
      [foundry.utils.randomID()]: action
    };
  }

  #replaceMod(itemData, fieldAbility, field) {
    if (!field) return field;
    // eslint-disable-next-line no-param-reassign
    field = String(field);

    const attackType = itemData.system.attack.type;
    const { ability } = itemData.system;

    if (attackType && ['meleeWeaponAttack', 'rangedWeaponAttack'].includes(attackType)) {
      if (itemData.system.objectType === 'weapon') {
        if (attackType === 'rangedWeaponAttack') {
          return field.replaceAll('@mod', '@dex.mod');
        }

        if (itemData.system.weaponProperties.includes('finesse')) {
          return field.replaceAll('@mod', '@finesse.mod');
        }

        return field.replaceAll('@mod', '@str.mod');
      }
    }

    if (!ability) return field;

    if (fieldAbility === 'default') {
      return field.replaceAll('@mod', `@${ability}.mod`);
    }

    return field.replaceAll('@mod', `@${fieldAbility}.mod`);
  }

  #updateActorBonuses(actorData) {
    const old = actorData?.system?.bonuses?.spell;

    actorData.system.bonuses = {
      meleeSpellAttack: old?.attack ?? '',
      rangedSpellAttack: old?.attack ?? '',
      spellDC: old?.dc ?? ''
    };

    actorData['system.bonuses.-=spell'] = null;
  }

  #updateCarryCapacity(actorData) {
    const old = actorData.flags.a5e?.carryCapacityMultiplier;
    if (!old) return;

    foundry.utils.setProperty(actorData, 'flags.a5e.doubleCarryCapacity', old > 1);
  }

  #updateMovements(actorData) {
    const old = actorData?.system?.attributes?.movement;
    const unitMap = {
      miles: ['mile', 'miles', 'mi.', 'mi'],
      kilometers: ['kilometer', 'kilometers', 'km.', 'km'],
      meters: ['meter', 'meters', 'm.', 'm']
    };

    const newMovements = Object.entries(old ?? {}).reduce((acc, [mode, distance]) => {
      if (mode === 'traits') {
        acc[mode] = { hover: distance.hover };
        return acc;
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const [unit, strings] of Object.entries(unitMap)) {
        if (strings.some((el) => distance.toString().includes(el))) {
          acc[mode] = { distance: parseInt(distance, 10) || 0, unit };
          return acc;
        }
      }
      acc[mode] = { distance: parseInt(distance, 10) || 0, unit: 'feet' };
      return acc;
    }, {});

    foundry.utils.setProperty(actorData, 'system.attributes.movement', newMovements);
  }

  #updateSenses(actorData) {
    const old = actorData?.system?.attributes?.senses;
    const unitMap = {
      miles: ['mile', 'miles', 'mi.', 'mi'],
      kilometers: ['kilometer', 'kilometers', 'km.', 'km'],
      meters: ['meter', 'meters', 'm.', 'm'],
      unlimited: ['unlimited', 'infinite']
    };

    const newSenses = Object.entries(old ?? {}).reduce((acc, [sense, distance]) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const [unit, strings] of Object.entries(unitMap)) {
        if (strings.some((el) => distance.toString().includes(el))) {
          acc[sense] = { distance: parseInt(distance, 10), unit };
          return acc;
        }
      }

      acc[sense] = { distance: parseInt(distance, 10), unit: 'feet' };
      return acc;
    }, {});

    foundry.utils.setProperty(actorData, 'system.attributes.senses', newSenses);
  }

  /**
   * @override
   * @param {Object} itemData
   * @returns {Promise<void>}
   */
  async updateItem(itemData) {
    // Only run this if the system version is below 0.9.0
    const lastMigrationVersion = game.settings.get('a5e', 'systemMigrationVersion');
    const isNewer = foundry.utils.isNewerVersion(lastMigrationVersion, '0.8.20');
    if (isNewer) return;

    if (itemData.type === 'object') this.#updateItemWeight(itemData.system);
    this.#updateActionsConfig(itemData);
  }

  /**
   * @override
   * @param {Object} actorData
   * @returns {Promise<void>}
   */
  async updateActor(actorData) {
    // Only run this if the system version is below 0.9.0
    const lastMigrationVersion = game.settings.get('a5e', 'systemMigrationVersion');
    const isNewer = foundry.utils.isNewerVersion(lastMigrationVersion, '0.8.20');
    if (isNewer) return;

    this.#updateActorBonuses(actorData);
    this.#updateCarryCapacity(actorData);
    this.#updateMovements(actorData);
    this.#updateSenses(actorData);
  }
}
