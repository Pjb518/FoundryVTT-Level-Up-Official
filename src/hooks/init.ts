import ActorSheetA5e from '../apps/ActorSheet';
import ActiveEffectConfigA5e from '../apps/ActiveEffectConfig';
import ItemSheetA5e from '../apps/ItemSheet';

import { A5E } from '../config';
import ActiveEffectA5e from '../documents/activeEffect/activeEffect';
import D20Roll from '../dice/d20Roll';
import TokenA5e from '../documents/token/token';
import TokenDocumentA5e from '../documents/tokenDocument';

import ActorProxy from '../documents/actor/actorProxy';
import ItemProxy from '../documents/item/itemProxy';

// Canvas
import prepareDetectionModes from '../pixi/visionModes/prepareDetectionModes';

// CompendiumSheets
import DND5ESpellCompendiumSheet from '../apps/DND5ESpellCompendiumSheet';
import ItemCompendiumSheet from '../apps/ItemCompendiumSheet';
import ManeuverCompendiumSheet from '../apps/ManeuverCompendiumSheet';
import MonsterCompendiumSheet from '../apps/MonsterCompendiumSheet';
import SpellCompendiumSheet from '../apps/SpellCompendiumSheet';

// DataModels
import actorDataModels from '../dataModels/actor/actorDataModels';
import chatDataModels from '../dataModels/chat/chatCardDataModels';
import itemDataModels from '../dataModels/item/itemDataModels';

// Effects
import constructEffectOptions from '../documents/activeEffect/utils/constructEffectOptions';
import EffectOption from '../documents/activeEffect/EffectOption';

import registerKeybindings from '../keybindings';

import _onCombatControl from '../combat/_onCombatControl';
import _onCombatantControl from '../combat/_onCombatantControl';
import getInitiativeFormula from '../combat/getInitiativeFormula';
import getInitiativeRoll from '../combat/getInitiativeRoll';
import preloadHandlebarsTemplates from '../templates';
import performPreLocalization from '../utils/localization/performLocalization';
import rollCombatantInitiative from '../combat/rollCombatantInitiative';
import rollInitiative from '../combat/rollInitiative';
import trackableAttributes from '../documents/actor/trackableAttributes';

// Macros
import activateActionMacro from '../macros/activateActionMacro';
import activateItemMacro from '../macros/activateItemMacro';
import createMacro from '../macros/createMacro';

// Managers
import { A5eEnricherManager } from '../managers/A5eEnricherManager';
import { ActionsManager } from '../managers/ActionsManager';
import ContainerManager from '../managers/ContainerManager';
import ForeignDocumentManager from '../managers/ForeignDocumentManager';
import HitDiceManager from '../managers/HitDiceManager';
import ItemGrantsManager from '../managers/ItemGrantsManager';
import ModifierManager from '../managers/ModifierManager';
import { ResourceConsumptionManager } from '../managers/ResourceConsumptionManager';
import RestManager from '../managers/RestManager';
import { RollPreparationManager } from '../managers/RollPreparationManager';
import TemplatePreparationManager from '../managers/TemplatePreparationManager';

// Migrations
import MigrationList from '../migration/MigrationList';
import MigrationRunner from '../migration/MigrationRunner';
import handleMigration from '../migration/handleMigration';
import handlePackMigration from '../migration/handlePackMigration';

// Utility functions
import getDeterministicBonus from '../dice/getDeterministicBonus';
import * as compendiaIndexFunctions from '../utils/createIndexes';
import openCompendium from '../utils/openCompendium';

// Stores
import { gameSettings } from '../settings/SettingsStore';

export default function init() {
	CONFIG.A5E = A5E;
	CONFIG.ActiveEffect.documentClass = ActiveEffectA5e;
	// @ts-expect-error
	CONFIG.Actor.documentClass = ActorProxy;
	CONFIG.Actor.trackableAttributes = trackableAttributes;
	CONFIG.Item.documentClass = ItemProxy;
	CONFIG.Token.documentClass = TokenDocumentA5e;
	CONFIG.Token.objectClass = TokenA5e;

	CONFIG.Dice.D20Roll = D20Roll;

	CONFIG.Dice.rolls.push(D20Roll);

	CONFIG.MeasuredTemplate.defaults.angle = 60;

	// DataModels
	CONFIG.Actor.dataModels = actorDataModels;
	// @ts-expect-error
	CONFIG.ChatMessage.dataModels = chatDataModels;
	CONFIG.Item.dataModels = itemDataModels;

	// Initialize the game's A5E namespace
	game.a5e = {
		applications: {
			ActorSheetA5e,
			ItemSheetA5e,
		},
		activeEffects: {
			EffectOption,
			options: {},
			effectsPanel: null,
		},
		compendiumSheets: {
			DND5ESpellCompendiumSheet,
			ItemCompendiumSheet,
			ManeuverCompendiumSheet,
			MonsterCompendiumSheet,
			SpellCompendiumSheet,
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
			MigrationRunner,
			handleMigration,
			handlePackMigration,
		},
		settings: {
			store: gameSettings,
		},
		utils: {
			getDeterministicBonus,
			compendiaIndexFunctions,
			openCompendium,
		},
	};

	// Register sheet application classes
	Actors.unregisterSheet('core', ActorSheet);
	// @ts-expect-error
	Actors.registerSheet('a5e', ActorSheetA5e, {
		types: ['character'],
		makeDefault: true,
		label: 'A5E.SheetClassCharacter',
	});

	// @ts-expect-error
	Actors.registerSheet('a5e', ActorSheetA5e, {
		types: ['npc'],
		makeDefault: true,
		label: 'A5E.SheetClassNPC',
	});

	Items.unregisterSheet('core', ItemSheet);
	// @ts-expect-error
	Items.registerSheet('a5e', ItemSheetA5e, {
		makeDefault: true,
		label: 'A5E.SheetClassItem',
	});

	DocumentSheetConfig.unregisterSheet(ActiveEffect, 'core', ActiveEffectConfig);
	DocumentSheetConfig.registerSheet(ActiveEffect, 'a5e', ActiveEffectConfigA5e, {
		makeDefault: true,
		label: 'A5E.SheetClassActiveEffectConfig',
	});

	// @ts-expect-error
	Combatant.prototype._getInitiativeFormula = getInitiativeFormula;
	Combatant.prototype.getInitiativeRoll = getInitiativeRoll;
	Combatant.prototype.rollInitiative = rollCombatantInitiative;

	Combat.prototype.rollInitiative = rollInitiative;

	// @ts-expect-error
	CombatTracker.prototype._onCombatantControl = _onCombatantControl;
	// @ts-expect-error
	CombatTracker.prototype._onCombatControl = _onCombatControl;

	// Register detection modes
	prepareDetectionModes();

	// Set tooltips to animate faster
	TooltipManager.TOOLTIP_ACTIVATION_MS = 100;

	// Prelocalize any static strings once localization files become available.
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
