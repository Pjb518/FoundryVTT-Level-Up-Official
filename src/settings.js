import MigrationRunner from './migration/MigrationRunner';
import SettingsShim from './settings/SettingsShim';

import { gameSettings } from './settings/SettingsStore';

class ConditionAutomationSettings extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: 'Condition Automation Settings',
      id: 'condition-automation-settings',
      template: 'systems/a5e/templates/conditionAutomationMenu.hbs',
      width: '600',
      height: 'auto',
      closeOnSubmit: true,
      resizable: true

    });
  }

  // eslint-disable-next-line no-unused-vars
  getData(options = {}) {
    this.conditions = [
      'blinded',
      'bloodied',
      'encumbered',
      // 'fatigue',
      // 'frightened',
      'grappled',
      'invisible',
      'paralyzed',
      'petrified',
      'poisoned',
      'prone',
      'rattled',
      'restrained',
      'slowed',
      // 'strife',
      'stunned',
      'unconscious'
    ];

    const enabledConditions = game.settings.get('a5e', 'automatedConditions');

    const data = {};
    this.conditions.forEach((c) => {
      data[c] = {
        label: game.i18n.localize(`A5E.Condition${c.capitalize()}`),
        checked: enabledConditions.includes(c)
      };
    });

    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);
  }

  async _updateObject(_, formData) {
    const updatedConditions = formData.conditions.filter((c) => c);
    await game.settings.set('a5e', 'automatedConditions', updatedConditions);

    this.render();
  }
}

export default function registerSystemSettings() {
  gameSettings.init();

  const reload = foundry.utils.debounce(() => window.location.reload(), 250);

  // Internal System Migration Version
  game.settings.register('a5e', 'systemMigrationVersion', {
    name: 'System Migration Version',
    scope: 'world',
    config: false,
    type: String,
    default: ''
  });

  game.settings.register('a5e', 'worldSchemaVersion', {
    name: 'World Schema Version',
    scope: 'world',
    config: false,
    type: Number,
    default: MigrationRunner.LATEST_SCHEMA_VERSION
  });

  // Critical Hit Damage Modes
  game.settings.register('a5e', 'critCalculationMode', {
    name: 'A5E.settings.critCalculationMode',
    hint: 'A5E.settings.hints.critCalculationMode',
    scope: 'world',
    config: true,
    default: 'doubleAllDamage',
    type: String,
    choices: {
      doubleAllDamage: 'A5E.settings.critDoubleAllDamage',
      doubleDiceDamage: 'A5E.settings.critDoubleDiceDamage',
      doubleDiceQuantity: 'A5E.settings.critDoubleDiceQuantity',
      doubleDiceQuantityAndMods: 'A5E.settings.critDoubleDiceQuantityAndMods',
      maxDamage: 'A5E.settings.critMaxDamage',
      maxDamagePlusRoll: 'A5E.settings.critMaxDamagePlusRoll'
    }
  });

  game.settings.register('a5e', 'itemRightClickConfigure', {
    name: 'A5E.settings.itemRightClickConfigure',
    hint: 'A5E.settings.itemRightClickConfigure',
    scope: 'client',
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register('a5e', 'hideDeleteConfirmation', {
    name: 'A5E.settings.hideDeletionConfirmationDialog',
    hint: 'A5E.settings.hints.hideDeletionConfirmationDialog',
    scope: 'client',
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register('a5e', 'collapseActionList', {
    name: 'A5E.settings.hideActionListInLockedMode',
    hint: 'A5E.settings.hints.hideActionListInLockedMode',
    scope: 'client',
    config: true,
    type: Boolean,
    default: false,
    onChange: reload
  });

  game.settings.register('a5e', 'reverseInitiativeAltBehavior', {
    name: 'A5E.settings.reverseInitiativeAltBehavior',
    hint: 'A5E.settings.hints.reverseInitiativeAltBehavior',
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
    onChange: reload
  });

  game.settings.register('a5e', 'hideChatDescriptionsByDefault', {
    name: 'A5E.settings.hideChatDescriptionsByDefault',
    hint: 'A5E.settings.hints.hideChatDescriptionsByDefault',
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
    onChange: reload
  });

  game.settings.register('a5e', 'protectRolls', {
    name: 'A5E.settings.protectRolls',
    hint: 'A5E.settings.hints.protectRolls',
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
    onChange: reload
  });

  game.settings.register('a5e', 'terseRollFormulae', {
    name: 'A5E.settings.terseRollFormulae',
    hint: 'A5E.settings.hints.terseRollFormulae',
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
    onChange: reload
  });

  // Currency Weight
  game.settings.register('a5e', 'currencyWeight', {
    name: 'A5E.settings.trackCurrencyWeight',
    hint: 'A5E.settings.hints.trackCurrencyWeight',
    scope: 'world',
    config: true,
    default: true,
    type: Boolean
  });

  // Diagonal Movement Rule
  game.settings.register('a5e', 'diagonalRule', {
    name: 'A5E.settings.diagonalMovementMeasurement',
    hint: 'A5E.settings.hints.diagonalMovementMeasurement',
    scope: 'world',
    config: true,
    default: 'normal',
    type: String,
    choices: {
      normal: 'A5E.settings.diagonalMovementMeasurementNormal',
      euclidean: 'A5E.settings.diagonalMovementMeasurementEuclidean',
      5105: 'A5E.settings.diagonalMovementMeasurementAlternating'
    },
    onChange: (rule) => { canvas.grid.diagonalRule = rule; }
  });

  // Default GM Setting for placing templates
  game.settings.register('a5e', 'placeItemTemplateDefault', {
    name: 'A5E.settings.placeItemTemplateDefault',
    hint: 'A5E.settings.hints.placeItemTemplateDefault',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });

  // Default GM Setting for NPC Health Randomization
  game.settings.register('a5e', 'randomizeNPCHitPoints', {
    name: 'A5E.settings.randomizeNPCHitPoints',
    hint: 'A5E.settings.hints.randomizeNPCHitPoints',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });

  // Enable settings for condition automation
  // game.settings.register('a5e', 'automatedConditions', {
  //   name: 'A5E.settings.automateConditions',
  //   scope: 'world',
  //   config: false,
  //   type: Array,
  //   default: ['bloodied'],
  //   onChange: reload
  // });

  // game.settings.registerMenu('a5e', 'ConditionAutomationMenu', {
  //   name: 'Condition Automation Menu',
  //   label: 'Configure Condition Automation',
  //   icon: 'fas fa bars',
  //   type: ConditionAutomationSettings,
  //   restricted: true
  // });

  game.settings.registerMenu('a5e', 'SystemSettings', {
    name: 'System Settings',
    label: 'Configure System Settings',
    icon: 'fas fa bars',
    type: SettingsShim,
    restricted: true
  });
}
