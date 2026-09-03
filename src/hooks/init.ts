import { ConditionManager } from '#managers/ConditionManager.ts';
import { CompendiumBrowser } from '#view/dialogs/initializers/CompendiumBrowser.svelte.ts';
import { RegionLayerA5E } from '../canvas/layers/region.ts';
import _onCombatantControl from '../combat/_onCombatantControl.js';
import _onCombatControl from '../combat/_onCombatControl.js';
import getInitiativeFormula from '../combat/getInitiativeFormula.js';
import getInitiativeRoll from '../combat/getInitiativeRoll.js';
import rollCombatantInitiative from '../combat/rollCombatantInitiative.js';
import rollInitiative from '../combat/rollInitiative.js';
import { A5E } from '../config.ts';
import actorDataModels from '../dataModels/actor/actorDataModels.ts';
import chatDataModels from '../dataModels/chat/chatCardDataModels.ts';
import activeEffectModels from '../dataModels/effect/effectDataModels.ts';
import itemDataModels from '../dataModels/item/itemDataModels.ts';
import { getDeterministicBonus } from '../dice/getDeterministicBonus.ts';
import { BaseRoll } from '../dice/rolls/BaseRoll.ts';
import { D20Roll } from '../dice/rolls/D20Roll.ts';
import { BaseDie } from '../dice/terms/BaseDie.ts';
import { D20Die } from '../dice/terms/D20Die.ts';
import { ExpertiseDie } from '../dice/terms/ExpertiseDie.ts';
import { ActiveEffectA5E } from '../documents/activeEffect/ae.svelte.ts';
import EffectOption from '../documents/activeEffect/EffectOption.ts';
import constructEffectOptions from '../documents/activeEffect/utils/constructEffectOptions.ts';
import ActorProxy from '../documents/actor/actorProxy.ts';
import trackableAttributes from '../documents/actor/trackableAttributes.js';
import { ChatMessageA5e } from '../documents/chatMessage.ts';
import ItemProxy from '../documents/item/itemProxy.ts';
import ActiveEffectSheetA5e from '../documents/sheets/ActiveEffectSheet.svelte.ts';
import ActorSheetA5e from '../documents/sheets/ActorSheet.svelte.ts';
import ItemSheetA5e from '../documents/sheets/ItemSheet.svelte.ts';
import TokenA5e from '../documents/token/token.js';
import TokenDocumentA5e from '../documents/tokenDocument.ts';
import { CombatantA5e } from '../encounter/Combatant.ts';
import { EncounterA5e } from '../encounter/Encounter.ts';
import { registerKeybindings } from '../keybindings.ts';
import activateActionMacro from '../macros/activateActionMacro.js';
import activateItemMacro from '../macros/activateItemMacro.js';
import createMacro from '../macros/createMacro.js';
import { A5eEnricherManager } from '../managers/A5eEnricherManager.ts';
import { ActionsManager } from '../managers/ActionsManager.ts';
import ContainerManager from '../managers/ContainerManager.ts';
import ForeignDocumentManager from '../managers/ForeignDocumentManager.ts';
import HitDiceManager from '../managers/HitDiceManager.ts';
import { ItemGrantsManager } from '../managers/ItemGrantsManager.ts';
import ModifierManager from '../managers/ModifierManager.js';
import { ResourceConsumptionManager } from '../managers/ResourceConsumptionManager.ts';
import RestManager from '../managers/RestManagerO.js';
import { RollPreparationManager } from '../managers/RollPreparationManager.ts';
import TemplatePreparationManager from '../managers/TemplatePreparationManager.js';
import { handleMigration } from '../migration/handlers/handleMigration.ts';
import { handlePackMigration } from '../migration/handlers/handlePackMigration.ts';
import { MigrationList } from '../migration/MigrationList.ts';
import { MigrationRunnerFoundry } from '../migration/runner/foundryRunner.ts';
import prepareDetectionModes from '../pixi/visionModes/prepareDetectionModes.js';
import preloadHandlebarsTemplates from '../templates.js';
import performPreLocalization from '../utils/localization/performLocalization.js';

// Update namespace

export default function init() {
	CONFIG.A5E = A5E;
	// CONFIG.ActiveEffect.documentClass = ActiveEffectA5e;
	CONFIG.ActiveEffect.documentClass = ActiveEffectA5E;
	// @ts-expect-error
	CONFIG.Actor.documentClass = ActorProxy;
	CONFIG.Actor.trackableAttributes = trackableAttributes;
	CONFIG.ChatMessage.documentClass = ChatMessageA5e;
	CONFIG.Combat.documentClass = EncounterA5e;
	CONFIG.Combatant.documentClass = CombatantA5e;
	CONFIG.Item.documentClass = ItemProxy;
	CONFIG.Token.documentClass = TokenDocumentA5e;
	CONFIG.Token.objectClass = TokenA5e;

	CONFIG.Dice.BaseRoll = BaseRoll;
	CONFIG.Dice.D20Roll = D20Roll;
	CONFIG.Dice.rolls.push(D20Roll);

	CONFIG.Dice.BaseDie = BaseDie;
	CONFIG.Dice.D20Die = D20Die;
	CONFIG.Dice.terms.d = BaseDie;
	CONFIG.Dice.ExpertiseDie = ExpertiseDie;
	CONFIG.Dice.types.push(D20Die);
	CONFIG.Dice.types.push(ExpertiseDie);

	CONFIG.MeasuredTemplate.defaults.angle = 60;

	// DataModels
	CONFIG.Actor.dataModels = actorDataModels;
	CONFIG.ActiveEffect.dataModels = activeEffectModels;
	CONFIG.ChatMessage.dataModels = chatDataModels;
	CONFIG.Item.dataModels = itemDataModels;

	CONFIG.ActiveEffect.changeTypes = {
		0: 'custom',
		1: 'multiply',
		2: 'add',
		3: 'subtract',
		4: 'downgrade',
		5: 'upgrade',
		6: 'override',
		7: 'conditional',
	};

	// Layers
	CONFIG.Canvas.layers.regions.layerClass = RegionLayerA5E;

	// Initialize the game's A5E namespace
	game.a5e = {
		applications: {
			ActorSheetA5e,
			ItemSheetA5e,
		},
		activeEffects: {
			conditions: { ConditionManager },
			EffectOption,
			options: {},
			effectsPanel: null,
		},
		compendium: {
			applicationClass: CompendiumBrowser,
		},
		config: A5E,
		dice: {
			D20Roll,
		},
		documentClasses: {
			...A5E.Actor.documentClasses,
			...A5E.Item.documentClasses,
			TokenDocumentA5e,
			TokenA5e,
		},
		dialogs: {
			bonuses: {
				abilities: {},
				damage: {},
				healing: {},
				skills: {},
			},
			partyViewer: null,
		},
		macros: {
			activateActionMacro,
			activateItemMacro,
			createMacro,
		},
		managers: {
			ActionsManager,
			ContainerManager,
			ForeignDocumentManager,
			HitDiceManager,
			ItemGrantsManager,
			ModifierManager,
			ResourceConsumptionManager,
			RestManager,
			RollPreparationManager,
			TemplatePreparationManager,
		},
		migrations: {
			MigrationList,
			MigrationRunner: MigrationRunnerFoundry,
			handleMigration,
			handlePackMigration,
		},
		settings: {
			// store: gameSettings,
		},
		utils: {
			getDeterministicBonus,
			// compendiaIndexFunctions,
			// openCompendium,
		},
	};

	// Register sheet application classes
	foundry.documents.collections.Actors.unregisterSheet(
		'core',
		foundry.applications.sheets.ActorSheetV2,
	);
	// @ts-expect-error
	foundry.documents.collections.Actors.registerSheet('a5e', ActorSheetA5e, {
		types: ['character'],
		makeDefault: true,
		label: 'A5E.SheetClassCharacter',
	});

	// @ts-expect-error
	foundry.documents.collections.Actors.registerSheet('a5e', ActorSheetA5e, {
		types: ['npc'],
		makeDefault: true,
		label: 'A5E.SheetClassNPC',
	});

	foundry.documents.collections.Items.unregisterSheet(
		'core',
		foundry.applications.sheets.ItemSheetV2,
	);
	// @ts-expect-error
	foundry.documents.collections.Items.registerSheet('a5e', ItemSheetA5e, {
		makeDefault: true,
		label: 'A5E.SheetClassItem',
	});

	foundry.applications.apps.DocumentSheetConfig.unregisterSheet(
		ActiveEffect,
		'core',
		foundry.applications.sheets.ActiveEffectConfig,
	);
	foundry.applications.apps.DocumentSheetConfig.registerSheet(
		ActiveEffect,
		'a5e',
		ActiveEffectSheetA5e,
		{
			makeDefault: true,
			label: 'A5E.SheetClassActiveEffectConfig',
		},
	);

	// @ts-expect-error
	Combatant.prototype._getInitiativeFormula = getInitiativeFormula;
	Combatant.prototype.getInitiativeRoll = getInitiativeRoll;
	Combatant.prototype.rollInitiative = rollCombatantInitiative;

	Combat.prototype.rollInitiative = rollInitiative;

	// @ts-expect-error
	foundry.applications.sidebar.tabs.CombatTracker.prototype._onCombatantControl =
		_onCombatantControl;
	// @ts-expect-error
	foundry.applications.sidebar.tabs.CombatTracker.prototype._onCombatControl = _onCombatControl;

	// Register detection modes
	prepareDetectionModes();

	// Set tooltips to animate faster
	foundry.helpers.interaction.TooltipManager.TOOLTIP_ACTIVATION_MS = 100;

	// Pre-localize any static strings once localization files become available.
	Hooks.once('i18nInit', () => {
		performPreLocalization(CONFIG.A5E);
		game.a5e.activeEffects.options = constructEffectOptions();
	});

	registerKeybindings();

	// Add enricher
	const enricherManager = new A5eEnricherManager();
	enricherManager.registerCustomEnrichers();

	return preloadHandlebarsTemplates();
}
