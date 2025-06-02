import ActorSheetA5e from "../documents/sheets/ActorSheet.svelte.ts";
import ItemSheetA5e from "../documents/sheets/ItemSheet.svelte.ts";
// import ActiveEffectConfigA5e from "../apps/ActiveEffectConfig.js";
// import ItemSheetA5e from "../apps/ItemSheet.ts";

import { A5E } from "../config.ts";
import ActiveEffectA5e from "../documents/activeEffect/activeEffect.js";
import D20Roll from "../dice/d20Roll.js";
import TokenA5e from "../documents/token/token.js";
import TokenDocumentA5e from "../documents/tokenDocument.js";

import ActorProxy from "../documents/actor/actorProxy.ts";
import ItemProxy from "../documents/item/itemProxy.ts";
import { ChatMessageA5e } from "../documents/chatMessage.ts";

// Canvas
import prepareDetectionModes from "../pixi/visionModes/prepareDetectionModes.js";

// CompendiumSheets
// import DND5ESpellCompendiumSheet from "../apps/DND5ESpellCompendiumSheet.js";
// import ItemCompendiumSheet from "../apps/ItemCompendiumSheet.js";
// import ManeuverCompendiumSheet from "../apps/ManeuverCompendiumSheet.js";
// import MonsterCompendiumSheet from "../apps/MonsterCompendiumSheet.js";
// import SpellCompendiumSheet from "../apps/SpellCompendiumSheet.js";

// DataModels
import actorDataModels from "../dataModels/actor/actorDataModels.ts";
import activeEffectModels from "../dataModels/effect/effectDataModels.ts";
import chatDataModels from "../dataModels/chat/chatCardDataModels.ts";
import itemDataModels from "../dataModels/item/itemDataModels.ts";

// Effects
import constructEffectOptions from "../documents/activeEffect/utils/constructEffectOptions.js";
import EffectOption from "../documents/activeEffect/EffectOption.ts";

import registerKeybindings from "../keybindings.js";

import _onCombatControl from "../combat/_onCombatControl.js";
import _onCombatantControl from "../combat/_onCombatantControl.js";
import getInitiativeFormula from "../combat/getInitiativeFormula.js";
import getInitiativeRoll from "../combat/getInitiativeRoll.js";
import preloadHandlebarsTemplates from "../templates.js";
import performPreLocalization from "../utils/localization/performLocalization.js";
import rollCombatantInitiative from "../combat/rollCombatantInitiative.js";
import rollInitiative from "../combat/rollInitiative.js";
import trackableAttributes from "../documents/actor/trackableAttributes.js";

// Macros
import activateActionMacro from "../macros/activateActionMacro.js";
import activateItemMacro from "../macros/activateItemMacro.js";
import createMacro from "../macros/createMacro.js";

// Managers
import { A5eEnricherManager } from "../managers/A5eEnricherManager.ts";
import { ActionsManager } from "../managers/ActionsManager.ts";
import ContainerManager from "../managers/ContainerManager.ts";
import ForeignDocumentManager from "../managers/ForeignDocumentManager.ts";
import HitDiceManager from "../managers/HitDiceManager.ts";
import { ItemGrantsManager } from "../managers/ItemGrantsManager.ts";
import ModifierManager from "../managers/ModifierManager.js";
import { ResourceConsumptionManager } from "../managers/ResourceConsumptionManager.ts";
import RestManager from "../managers/RestManager.js";
import { RollPreparationManager } from "../managers/RollPreparationManager.ts";
import TemplatePreparationManager from "../managers/TemplatePreparationManager.js";

// Migrations
import { MigrationList } from "../migration/MigrationList.ts";
import { MigrationRunnerFoundry } from "../migration/runner/foundryRunner.ts";
import { handleMigration } from "../migration/handlers/handleMigration.ts";
import { handlePackMigration } from "../migration/handlers/handlePackMigration.ts";

// Utility functions
import { getDeterministicBonus } from "../dice/getDeterministicBonus.ts";
// import * as compendiaIndexFunctions from "../utils/createIndexes.ts";
// import openCompendium from "../utils/openCompendium.ts";

// Stores
// import { gameSettings } from "../settings/SettingsStore.ts";

export default function init() {
  CONFIG.A5E = A5E;
  CONFIG.ActiveEffect.documentClass = ActiveEffectA5e;
  // @ts-expect-error
  CONFIG.Actor.documentClass = ActorProxy;
  CONFIG.Actor.trackableAttributes = trackableAttributes;
  CONFIG.ChatMessage.documentClass = ChatMessageA5e;
  CONFIG.Item.documentClass = ItemProxy;
  CONFIG.Token.documentClass = TokenDocumentA5e;
  CONFIG.Token.objectClass = TokenA5e;

  CONFIG.Dice.D20Roll = D20Roll;

  CONFIG.Dice.rolls.push(D20Roll);

  CONFIG.MeasuredTemplate.defaults.angle = 60;

  // DataModels
  CONFIG.Actor.dataModels = actorDataModels;
  // @ts-expect-error
  CONFIG.ActiveEffect.dataModels = activeEffectModels;
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
      // DND5ESpellCompendiumSheet,
      // ItemCompendiumSheet,
      // ManeuverCompendiumSheet,
      // MonsterCompendiumSheet,
      // SpellCompendiumSheet,
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
  Actors.unregisterSheet("core", ActorSheet);
  // @ts-expect-error
  Actors.registerSheet("a5e", ActorSheetA5e, {
    types: ["character"],
    makeDefault: true,
    label: "A5E.SheetClassCharacter",
  });

  // @ts-expect-error
  Actors.registerSheet("a5e", ActorSheetA5e, {
    types: ["npc"],
    makeDefault: true,
    label: "A5E.SheetClassNPC",
  });

  Items.unregisterSheet("core", ItemSheet);
  // @ts-expect-error
  Items.registerSheet("a5e", ItemSheetA5e, {
    makeDefault: true,
    label: "A5E.SheetClassItem",
  });

  // DocumentSheetConfig.unregisterSheet(ActiveEffect, "core", ActiveEffectConfig);
  // DocumentSheetConfig.registerSheet(
  //   ActiveEffect,
  //   "a5e",
  //   ActiveEffectConfigA5e,
  //   {
  //     makeDefault: true,
  //     label: "A5E.SheetClassActiveEffectConfig",
  //   },
  // );

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
  Hooks.once("i18nInit", () => {
    performPreLocalization(CONFIG.A5E);
    game.a5e.activeEffects.options = constructEffectOptions();
  });

  registerKeybindings();

  // Add enricher
  const enricherManager = new A5eEnricherManager();
  enricherManager.registerCustomEnrichers();

  return preloadHandlebarsTemplates();
}
