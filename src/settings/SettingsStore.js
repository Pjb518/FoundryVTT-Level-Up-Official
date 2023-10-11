// eslint-disable-next-line import/no-unresolved
import { TJSGameSettings } from '#runtime/svelte/store/fvtt/settings';

import MigrationRunner from '../migration/MigrationRunner';

class A5eGameSettings extends TJSGameSettings {
  constructor() {
    super('a5e');
    this.settingsData = null;
  }

  init() {
    const namespace = 'a5e';
    const scope = { client: 'client', world: 'world' };
    const settings = [
      // Actor Settings
      {
        namespace,
        key: 'blindDeathSaves',
        options: {
          name: 'A5E.settings.blindDeathSaves',
          hint: 'A5E.settings.hints.blindDeathSaves',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'collapseActionList',
        options: {
          name: 'A5E.settings.collapseActionList',
          hint: 'A5E.settings.hints.collapseActionList',
          scope: scope.client,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'currencyWeight',
        options: {
          name: 'A5E.settings.trackCurrencyWeight',
          hint: 'A5E.settings.hints.trackCurrencyWeight',
          scope: scope.world,
          config: true,
          default: true,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'hideDeleteConfirmation',
        options: {
          name: 'A5E.settings.hideDeletionConfirmationDialog',
          hint: 'A5E.settings.hints.hideDeletionConfirmationDialog',
          scope: scope.client,
          config: true,
          type: Boolean,
          default: false
        }
      },
      {
        namespace,
        key: 'itemRightClickConfigure',
        options: {
          name: 'A5E.settings.itemRightClickConfigure',
          hint: 'A5E.settings.hints.itemRightClickConfigure',
          scope: scope.client,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'randomizeNPCHitPoints',
        options: {
          name: 'A5E.settings.randomizeNPCHitPoints',
          hint: 'A5E.settings.hints.randomizeNPCHitPoints',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'reverseAltBehavior',
        options: {
          name: 'A5E.settings.reverseAltBehavior',
          hint: 'A5E.settings.hints.reverseAltBehavior',
          scope: scope.client,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'reverseInitiativeAltBehavior',
        options: {
          name: 'A5E.settings.reverseInitiativeAltBehavior',
          hint: 'A5E.settings.hints.reverseInitiativeAltBehavior',
          scope: scope.client,
          config: true,
          default: false,
          type: Boolean
        }
      },
      // Canvas Settings
      {
        namespace,
        key: 'diagonalRule',
        options: {
          name: 'A5E.settings.diagonalRule',
          hint: 'A5E.settings.hints.diagonalRule',
          scope: scope.world,
          config: true,
          default: 'normal',
          type: String,
          choices: {
            normal: 'A5E.settings.diagonalRuleNormal',
            euclidean: 'A5E.settings.diagonalRuleEuclidean',
            5105: 'A5E.settings.diagonalRuleAlternating'
          },
          onChange: (rule) => { canvas.grid.diagonalRule = rule; }
        }
      },
      {
        namespace,
        key: 'placeItemTemplateDefault',
        options: {
          name: 'A5E.settings.placeItemTemplateDefault',
          hint: 'A5E.settings.hints.placeItemTemplateDefault',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      // Effects
      {
        namespace,
        key: 'automatedConditions',
        options: {
          name: 'A5E.settings.automateConditions',
          hint: 'A5E.settings.hints.automateConditions',
          scope: scope.world,
          config: true,
          type: Array,
          default: []
        }
      },
      {
        namespace,
        key: 'automateBloodiedApplication',
        options: {
          name: 'A5E.settings.automateBloodiedApplication',
          hint: 'A5E.settings.hints.automateBloodiedApplication',
          scope: scope.world,
          config: true,
          type: Boolean,
          default: true
        }
      },
      {
        namespace,
        key: 'automateUnconsciousApplication',
        options: {
          name: 'A5E.settings.automateUnconsciousApplication',
          hint: 'A5E.settings.hints.automateUnconsciousApplication',
          scope: scope.world,
          config: true,
          type: Boolean,
          default: true
        }
      },
      {
        namespace,
        key: 'enableRadialEffects',
        options: {
          name: 'A5E.settings.enableRadialEffects',
          hint: 'A5E.settings.hints.enableRadialEffects',
          scope: scope.world,
          config: true,
          type: Boolean,
          default: true
        }
      },
      {
        namespace,
        key: 'customConditionIcons',
        options: {
          name: 'A5E.settings.customConditionIcons',
          hint: 'A5E.settings.hints.customConditionIcons',
          scope: scope.world,
          config: true,
          type: Object,
          default: {}
        }
      },
      {
        namespace,
        key: 'effectsPanelIconSize',
        options: {
          name: 'A5E.settings.effectsPanelIconSize',
          hint: 'A5E.settings.hints.effectsPanelIconSize',
          scope: scope.client,
          config: true,
          type: String,
          choices: {
            small: 'A5E.settings.effectsPanelIconSizeSmall',
            medium: 'A5E.settings.effectsPanelIconSizeMedium',
            large: 'A5E.settings.effectsPanelIconSizeLarge'
          },
          default: 'medium'
        }
      },
      {
        namespace,
        key: 'effectsPanelOffset',
        options: {
          name: 'A5E.settings.effectsPanelOffset',
          hint: 'A5E.settings.hints.effectsPanelOffset',
          scope: scope.client,
          config: true,
          type: Object,
          default: { top: 0, bottom: 0, right: 0 }
        }
      },
      {
        namespace,
        key: 'showEffectsPanel',
        options: {
          name: 'A5E.settings.showEffectsPanel',
          scope: scope.client,
          config: true,
          default: true,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'removeActiveEffectsOnLongRest',
        options: {
          name: 'A5E.settings.removeActiveEffectsOnLongRest',
          hint: 'A5E.settings.hints.removeActiveEffectsOnLongRest',
          scope: scope.world,
          config: true,
          type: Boolean,
          default: false
        }
      },
      // Chat Card Settings
      {
        namespace,
        key: 'hideChatDescriptionsByDefault',
        options: {
          name: 'A5E.settings.hideChatDescriptionsByDefault',
          hint: 'A5E.settings.hints.hideChatDescriptionsByDefault',
          scope: scope.client,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'hideRandomizedHPRolls',
        options: {
          name: 'A5E.settings.hideRandomizedHPRolls',
          hint: 'A5E.settings.hints.hideRandomizedHPRolls',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'protectRolls',
        options: {
          name: 'A5E.settings.protectRolls',
          hint: 'A5E.settings.hints.protectRolls',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'terseRollFormulae',
        options: {
          name: 'A5E.settings.terseRollFormulae',
          hint: 'A5E.settings.hints.terseRollFormulae',
          scope: scope.client,
          config: true,
          default: false,
          type: Boolean
        }
      },
      // Roll Settings
      {
        namespace,
        key: 'critCalculationMode',
        options: {
          name: 'A5E.settings.critCalculationMode',
          hint: 'A5E.settings.hints.critCalculationMode',
          scope: scope.world,
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
        }
      },
      {
        namespace,
        key: 'preventActionRollOnWarning',
        options: {
          name: 'A5E.settings.preventActionRollOnWarning',
          hint: 'A5E.settings.hints.preventActionRollOnWarning',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      // 5E Specific Settings
      {
        namespace,
        key: '5eStyleDeathSaves',
        options: {
          name: 'A5E.settings.5eStyleDeathSaves',
          hint: 'A5E.settings.hints.5eStyleDeathSaves',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'replaceFatigueAndStrife',
        options: {
          name: 'A5E.settings.replaceFatigueAndStrife',
          hint: 'A5E.settings.hints.replaceFatigueAndStrife',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      // Party Viewer Settings
      {
        namespace,
        key: 'playersCanAccessPartyViewer',
        options: {
          name: 'A5E.settings.playersCanAccessPartyViewer',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'showActorImagesInPartyViewer',
        options: {
          name: 'A5E.settings.showActorImagesInPartyViewer',
          scope: scope.client,
          config: true,
          default: true,
          type: Boolean
        }
      },
      // Misc Settings
      {
        namespace,
        key: 'showDescriptionOnLimitedPerms',
        options: {
          name: 'A5E.settings.showDescriptionOnLimitedPerms',
          hint: 'A5E.settings.hints.showDescriptionOnLimitedPerms',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      // Hidden system settings
      {
        namespace,
        key: 'systemMigrationVersion',
        options: {
          name: 'A5E.settings.systemMigrationVersion',
          scope: scope.world,
          config: false,
          type: String,
          default: ''
        }
      },
      {
        namespace,
        key: 'worldSchemaVersion',
        options: {
          name: 'A5E.settings.worldSchemaVersion',
          scope: scope.world,
          config: false,
          default: MigrationRunner.LATEST_SCHEMA_VERSION,
          type: Number
        }
      },
      {
        namespace,
        key: 'parties',
        options: {
          name: 'A5E.settings.parties',
          scope: scope.world,
          config: false,
          default: {
            '5Di3aRnZbNtrXq0K': {
              name: 'New Party',
              actors: [],
              isLocked: false
            }
          },
          type: Object
        }
      }

    ];

    this.registerAll(settings, false);
    this.settingsData = settings;
  }
}

// eslint-disable-next-line import/prefer-default-export
export const gameSettings = new A5eGameSettings();
