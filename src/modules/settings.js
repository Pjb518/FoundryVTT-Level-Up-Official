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

  // Currency Weight
  game.settings.register('a5e', 'currencyWeight', {
    name: 'A5E.Settings.CoinWeightName',
    hint: 'A5E.Settings.CoinWeightHint',
    scope: 'world',
    config: true,
    default: true,
    type: Boolean
  });

  // Diagonal Movement Rule
  game.settings.register('a5e', 'diagonalRule', {
    name: 'A5E.Settings.DiagName',
    hint: 'A5E.Settings.DiagHint',
    scope: 'world',
    config: true,
    default: 'normal',
    type: String,
    choices: {
      normal: 'A5E.Settings.DiagNormal',
      euclidean: 'A5E.Settings.DiagEuclidean',
      5105: 'A5E.Settings.Diag5105'
    },
    onChange: (rule) => { canvas.grid.diagonalRule = rule; }
  });

  // Default GM Setting for placing templates
  game.settings.register('a5e', 'placeItemTemplateDefault', {
    name: 'Place Templates for Items by Default',
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
