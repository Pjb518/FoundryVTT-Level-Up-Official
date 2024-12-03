// @ts-nocheck
// eslint-disable-next-line import/no-unresolved
import { TJSGameSettings, type GameSetting } from '#runtime/svelte/store/fvtt/settings';

import MigrationRunner from '../migration/MigrationRunner';
import { A5E as CONFIG } from '../config';

class A5eGameSettings extends TJSGameSettings {
	public settingsData: any;

	constructor() {
		super('a5e');
		this.settingsData = null;
	}

  init(): void {
    const namespace = 'a5e';
    const scope: { client: 'client', world: 'world' } = { client: 'client', world: 'world' };
    const settings: GameSetting[] = [
      // Actor Settings
      {
        namespace,
        key: 'automatePrototypeTokenSize',
        options: {
          name: 'A5E.settings.automatePrototypeTokenSize',
          hint: 'A5E.settings.hints.automatePrototypeTokenSize',
          scope: 'world',
          config: true,
          default: true,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'blindDeathSaves',
        options: {
          name: 'A5E.settings.blindDeathSaves',
          hint: 'A5E.settings.hints.blindDeathSaves',
          scope: 'world',
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
        key: 'conditionFlowDirection',
        options: {
          name: 'Condition Interface Flow Direction',
          hint: "Setting this option to 'Row' causes the conditions to flow alphabetically left to right, row by row. Setting this option 'Column' causes the conditions to flow alphabetically top to bottom, column by column.",
          scope: scope.client,
          config: true,
          default: 'column',
          choices: {
            row: 'Row',
            column: 'Column'
          },
          type: String
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
        key: 'hideActorCompendiumSelectionDialog',
        options: {
          name: 'A5E.settings.hideActorCompendiumSelectionDialog',
          hint: 'A5E.settings.hints.hideActorCompendiumSelectionDialog',
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
          default: true,
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
      {
        namespace,
        key: 'useNPCExpertisePassiveRulesForCharacters',
        options: {
          name: 'A5E.settings.useNPCExpertisePassiveRulesForCharacters',
          hint: 'A5E.settings.hints.useNPCExpertisePassiveRulesForCharacters',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      // Canvas Settings
      {
        namespace,
        key: 'automateVisionRules',
        options: {
          name: 'A5E.settings.automateVisionRules',
          hint: 'A5E.settings.hints.automateVisionRules',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'visionRulesApplyToCharactersOnly',
        options: {
          name: 'A5E.settings.visionRulesApplyToCharactersOnly',
          hint: 'A5E.settings.hints.visionRulesApplyToCharactersOnly',
          scope: scope.world,
          config: true,
          default: true,
          type: Boolean
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
          default: Object.keys(CONFIG.conditions)
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
        key: 'enableDamageRollColors',
        options: {
          name: 'A5E.settings.enableDamageRollColors',
          hint: 'A5E.settings.hints.enableDamageRollColors',
          scope: scope.client,
          config: true,
          default: true,
          type: Boolean
        }
      },
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
        key: '5eStyleExpertise',
        options: {
          name: 'A5E.settings.5eStyleExpertise',
          hint: 'A5E.settings.hints.5eStyleExpertise',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: '5eStyleJackOfAllTrades',
        options: {
          name: 'A5E.settings.5eStyleJackOfAllTrades',
          hint: 'A5E.settings.hints.5eStyleJackOfAllTrades',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'hideA5eSkills',
        options: {
          name: 'A5E.settings.hideA5eSkills',
          hint: 'A5E.settings.hints.hideA5eSkills',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'hideBrokenAndDamaged',
        options: {
          name: 'A5E.settings.hideBrokenAndDamaged',
          hint: 'A5E.settings.hints.hideBrokenAndDamaged',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'hideExpertiseDice',
        options: {
          name: 'A5E.settings.hideExpertiseDice',
          hint: 'A5E.settings.hints.hideExpertiseDice',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'hideSkillSpecialties',
        options: {
          name: 'A5E.settings.hideSkillSpecialties',
          hint: 'A5E.settings.hints.hideSkillSpecialties',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'hideSkillCriticalPrompt',
        options: {
          name: 'A5E.settings.hideSkillCriticalPrompt',
          hint: 'A5E.settings.hints.hideSkillCriticalPrompt',
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
      {
        namespace,
        key: 'simpleInitiative',
        options: {
          name: 'A5E.settings.simpleInitiative',
          hint: 'A5E.settings.hints.simpleInitiative',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'simpleRests',
        options: {
          name: 'A5E.settings.simpleRests',
          hint: 'A5E.settings.hints.simpleRests',
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
        key: 'autoApplyFancySheets',
        options: {
          name: 'A5E.settings.autoApplyFancySheets',
          hint: 'A5E.settings.hints.autoApplyFancySheets',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'enableCascadingDamageAndHealing',
        options: {
          name: 'A5E.settings.enableCascadingDamageAndHealing',
          hint: 'A5E.settings.hints.enableCascadingDamageAndHealing',
          scope: scope.world,
          config: true,
          default: true,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'cascadingDamageAndHealingDelay',
        options: {
          name: 'A5E.settings.cascadingDamageAndHealingDelay',
          hint: 'A5E.settings.hints.cascadingDamageAndHealingDelay',
          scope: scope.client,
          config: true,
          default: 350,
          type: Number
        }
      },
      {
        namespace,
        key: 'gamemasterTitle',
        options: {
          name: 'A5E.settings.gamemasterTitle',
          scope: scope.world,
          config: true,
          default: 'Narrator',
          type: String
        }
      },
      {
        namespace,
        key: 'newActionNameType',
        options: {
          name: 'A5E.settings.newActionNameType',
          hint: 'A5E.settings.hints.newActionNameType',
          scope: scope.world,
          config: true,
          default: 'system',
          type: String
        }
      },
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
      {
        namespace,
        key: 'skillListFlowDirection',
        options: {
          name: 'Skill List Flow Direction',
          hint: "Setting this option to 'Row' causes the skills to flow alphabetically left to right, row by row. Setting this option 'Column' causes the skills to flow alphabetically top to bottom, column by column.",
          scope: scope.client,
          config: true,
          default: 'row',
          choices: {
            row: 'Row',
            column: 'Column'
          },
          type: String
        }
      },
      // VRC Settings
      {
        namespace,
        key: 'showVRCProficiencies',
        options: {
          name: 'A5E.settings.showVRCProficiencies',
          hint: 'A5E.settings.hints.showVRCProficiencies',
          scope: scope.world,
          config: true,
          default: true,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'showVRCSpecialties',
        options: {
          name: 'A5E.settings.showVRCSpecialties',
          hint: 'A5E.settings.hints.showVRCSpecialties',
          scope: scope.world,
          config: true,
          default: true,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'showVRCSkills',
        options: {
          name: 'A5E.settings.showVRCSkills',
          hint: 'A5E.settings.hints.showVRCSkills',
          scope: scope.world,
          config: true,
          default: true,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'showVRCTechLevel',
        options: {
          name: 'A5E.settings.showVRCTechLevel',
          hint: 'A5E.settings.hints.showVRCTechLevel',
          scope: scope.world,
          config: true,
          default: true,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'showVRCPsionicDisciplines',
        options: {
          name: 'A5E.settings.showVRCPsionicDisciplines',
          hint: 'A5E.settings.hints.showVRCPsionicDisciplines',
          scope: scope.world,
          config: true,
          default: true,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'useCredits',
        options: {
          name: 'A5E.settings.useCredits',
          hint: 'A5E.settings.hints.useCredits',
          scope: scope.world,
          config: true,
          default: false,
          type: Boolean
        }
      },
      {
        namespace,
        key: 'showVRCImplants',
        options: {
          name: 'A5E.settings.showVRCImplants',
          hint: 'A5E.settings.hints.showVRCImplants',
          scope: scope.world,
          config: true,
          default: true,
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
      // Encounter builder settings
      {
        namespace,
        key: 'encounters',
        options: {
          name: 'A5e.settings.encounters',
          scope: scope.world,
          config: false,
          type: Object,
          default: {
            encounters: {},
            templates: {}
          }
        }
      },

			// Party Sheet Settings
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
							isLocked: false,
						},
					},
					type: Object,
				},
			},
		];

		this.registerAll(settings, false);
		this.settingsData = settings;
	}
}

// eslint-disable-next-line import/prefer-default-export
export const gameSettings = new A5eGameSettings();
