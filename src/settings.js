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
      // 'blinded',
      'encumbered',
      // 'fatigue',
      // 'frightened',
      'grappled',
      // 'invisible',
      // 'paralyzed',
      'petrified',
      // 'poisoned',
      // 'prone',
      // 'rattled',
      'restrained',
      'slowed'
      // 'strife',
      // 'stunned',
      // 'unconscious'
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

  async _updateObject(event, formData) {
    const updatedConditions = formData.conditions.filter((c) => c);
    await game.settings.set('a5e', 'automatedConditions', updatedConditions);

    this.render();
  }
}

export default function registerSystemSettings() {
  const reload = foundry.utils.debounce(() => window.location.reload(), 250);

  // Internal System Migration Version
  game.settings.register('a5e', 'systemMigrationVersion', {
    name: 'System Migration Version',
    scope: 'world',
    config: false,
    type: String,
    default: ''
  });

  // Critical Hit Damage Modes
  game.settings.register('a5e', 'critCalculationMode', {
    name: 'A5E.SettingsCritCalculationMode',
    hint: 'A5E.SettingsCritCalculationModeHint',
    scope: 'world',
    config: true,
    default: 'doubleAllDamage',
    type: String,
    choices: {
      doubleAllDamage: 'A5E.SettingsCritDoubleAllDamage',
      doubleDiceDamage: 'A5E.SettingsCritDoubleDiceDamage',
      doubleDiceQuantity: 'A5E.SettingsCritDoubleDiceQuantity',
      doubleDiceQuantityAndMods: 'A5E.SettingsCritDoubleDiceQuantityAndMods',
      maxDamage: 'A5E.SettingsCritMaxDamage',
      maxDamagePlusRoll: 'A5E.SettingsCritMaxDamagePlusRoll'
    }
  });

  game.settings.register('a5e', 'itemRightClickConfigure', {
    name: 'A5E.SettingsItemRightClickConfigureName',
    hint: 'A5E.SettingsItemRightClickConfigureHint',
    scope: 'client',
    config: true,
    type: Boolean,
    default: false
  });

  // Default GM Setting for placing templates
  game.settings.register('a5e', 'hideDeleteConfirmation', {
    name: 'Hide Deletion Confirmation Dialog',
    hint: 'When this setting is enabled, you can delete items from actor sheets without being presented with a dialog window to confirm the deletion.',
    scope: 'client',
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register('a5e', 'reverseInitiativeAltBehavior', {
    name: 'Reverse Alt Behavior for Initiative',
    hint: 'By default, holding the left alt key will skip the roll dialog for initiative rolls. If this setting is checked, the initiative roll dialog will be skipped unless the left key is held when clicking the roll button.',
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
    onChange: reload
  });

  game.settings.register('a5e', 'hideChatDescriptionsByDefault', {
    name: 'Hide Descriptions in Chat Cards',
    hint: 'When this setting is enabled, the description sections of Item chat cards will be hidden by default. You can still reveal the description sections by clicking on the header of the chat card.',
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
    onChange: reload
  });

  game.settings.register('a5e', 'terseRollFormulae', {
    name: 'Hide System Roll Annotations',
    hint: 'The system provides detailed roll annotations in chat card roll formulae. Enabling this setting removes all roll annotations in this formula display, providing a cleaner aesthetic at the expense of clarity.',
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
    onChange: reload
  });

  // Currency Weight
  game.settings.register('a5e', 'currencyWeight', {
    name: 'A5E.SettingsCoinWeightName',
    hint: 'A5E.SettingsCoinWeightHint',
    scope: 'world',
    config: true,
    default: true,
    type: Boolean
  });

  // Diagonal Movement Rule
  game.settings.register('a5e', 'diagonalRule', {
    name: 'A5E.SettingsDiagName',
    hint: 'A5E.SettingsDiagHint',
    scope: 'world',
    config: true,
    default: 'normal',
    type: String,
    choices: {
      normal: 'A5E.SettingsDiagNormal',
      euclidean: 'A5E.SettingsDiagEuclidean',
      5105: 'A5E.SettingsDiag5105'
    },
    onChange: (rule) => { canvas.grid.diagonalRule = rule; }
  });

  // Default GM Setting for placing templates
  game.settings.register('a5e', 'placeItemTemplateDefault', {
    name: 'Place Templates by Default',
    hint: 'Automatically select the "Place Measured Template" option in the roll dialog for features, spells, etc.',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });

  // Default GM Setting for NPC Health Randomization
  game.settings.register('a5e', 'randomizeNPCHitPoints', {
    name: 'Randomize NPC Hit Points',
    hint: 'When enabled, the hit points of NPCs with be randomly rolled based on their hit point formula when an actor is dragged to a scene.',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });

  // Enable settings for condition automation
  game.settings.register('a5e', 'automatedConditions', {
    name: 'Enable Condition Automation',
    scope: 'world',
    config: false,
    type: Array,
    default: ['petrified'],
    onChange: reload
  });

  game.settings.registerMenu('a5e', 'ConditionAutomationMenu', {
    name: 'Condition Automation Menu',
    label: 'Configure Condition Automation',
    icon: 'fas fa bars',
    type: ConditionAutomationSettings,
    restricted: true
  });
}
