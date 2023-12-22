import ActorSheetA5e from '../apps/ActorSheet';
import ActiveEffectConfigA5e from '../apps/ActiveEffectConfig';
import ItemSheetA5e from '../apps/ItemSheet';

import A5E from '../config';
import ActiveEffectA5e from '../documents/activeEffect/activeEffect';
import ActorA5e from '../documents/actor/actor';
import D20Roll from '../dice/d20Roll';
import TokenA5e from '../documents/token/token';
import TokenDocumentA5e from '../documents/tokenDocument';

import ItemProxy from '../documents/item/itemProxy';

// DataModels
import CharacterData from '../dataModels/actor/CharacterData';
import NPCData from '../dataModels/actor/NPCData';

import BackgroundDataModel from '../dataModels/item/BackgroundDataModel';
import CultureDataModel from '../dataModels/item/CultureDataModel';
import DestinyDataModel from '../dataModels/item/DestinyDataModel';
import HeritageDataModel from '../dataModels/item/HeritageDataModel';

// Effects
import constructEffectOptions from '../documents/activeEffect/utils/constructEffectOptions';
import EffectOption from '../documents/activeEffect/EffectOption';

// Sidebar
import ItemDirectoryA5E from '../sidebar/ItemDirectoryA5E';

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
import ActionsManager from '../managers/ActionsManager';
import ForeignDocumentManager from '../managers/ForeignDocumentManager';
import ItemGrantsManager from '../managers/ItemGrantsManager';
import ModifierManager from '../managers/ModifierManager';
import ResourceConsumptionManager from '../managers/ResourceConsumptionManager';
import RestManager from '../managers/RestManager';
import RollPreparationManager from '../managers/RollPreparationManager';
import SubObjectManager from '../managers/subItems/SubObjectManager';
import TemplatePreparationManager from '../managers/TemplatePreparationManager';

// Migrations
import MigrationList from '../migration/MigrationList';
import MigrationRunner from '../migration/MigrationRunner';
import handleMigration from '../migration/handleMigration';
import handlePackMigration from '../migration/handlePackMigration';

// Utility functions
import getDeterministicBonus from '../dice/getDeterministicBonus';
import * as compendiaIndexFunctions from '../utils/createIndexes';

// Stores
import { gameSettings } from '../settings/SettingsStore';

export default function init() {
  CONFIG.A5E = A5E;
  CONFIG.ActiveEffect.documentClass = ActiveEffectA5e;
  CONFIG.Actor.documentClass = ActorA5e;
  CONFIG.Actor.trackableAttributes = trackableAttributes;
  CONFIG.Item.documentClass = ItemProxy;
  CONFIG.Token.documentClass = TokenDocumentA5e;
  CONFIG.Token.objectClass = TokenA5e;

  CONFIG.ui.items = ItemDirectoryA5E;

  CONFIG.Dice.D20Roll = D20Roll;

  CONFIG.Dice.rolls.push(D20Roll);

  CONFIG.MeasuredTemplate.defaults.angle = 60;

  // DataModels
  const version = game.settings.storage.get('world').getItem('a5e.worldSchemaVersion');

  if (version > 0.008) {
    CONFIG.Actor.dataModels.character = CharacterData;
    CONFIG.Actor.dataModels.npc = NPCData;
  }

  CONFIG.Item.dataModels.background = BackgroundDataModel;
  CONFIG.Item.dataModels.culture = CultureDataModel;
  CONFIG.Item.dataModels.destiny = DestinyDataModel;
  CONFIG.Item.dataModels.heritage = HeritageDataModel;

  // Initialize the game's A5E namespace
  game.a5e = {
    applications: {
      ActorSheetA5e,
      ItemSheetA5e
    },
    activeEffects: {
      EffectOption,
      options: {},
      effectsPanel: null
    },
    config: A5E,
    dice: {
      D20Roll
    },
    documentClasses: {
      ActorA5e,
      // TODO: Add item document classes back in
      TokenDocumentA5e,
      TokenA5e
    },
    dialogs: {
      bonuses: {
        abilities: {},
        damage: {},
        healing: {},
        skills: {}
      }
    },
    macros: {
      activateActionMacro,
      activateItemMacro,
      createMacro
    },
    managers: {
      ActionsManager,
      ForeignDocumentManager,
      ItemGrantsManager,
      ModifierManager,
      ResourceConsumptionManager,
      RestManager,
      RollPreparationManager,
      SubObjectManager,
      TemplatePreparationManager
    },
    migrations: {
      MigrationList,
      MigrationRunner,
      handleMigration,
      handlePackMigration
    },
    settings: {
      store: gameSettings
    },
    utils: {
      getDeterministicBonus,
      compendiaIndexFunctions
    }
  };

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('a5e', ActorSheetA5e, {
    types: ['character'],
    makeDefault: true,
    label: 'A5E.SheetClassCharacter'
  });

  Actors.registerSheet('a5e', ActorSheetA5e, {
    types: ['npc'],
    makeDefault: true,
    label: 'A5E.SheetClassNPC'
  });

  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('a5e', ItemSheetA5e, {
    makeDefault: true,
    label: 'A5E.SheetClassItem'
  });

  DocumentSheetConfig.unregisterSheet(ActiveEffect, 'core', ActiveEffectConfig);
  DocumentSheetConfig.registerSheet(ActiveEffect, 'a5e', ActiveEffectConfigA5e, {
    makeDefault: true,
    label: 'A5E.SheetClassActiveEffectConfig'
  });

  Combatant.prototype._getInitiativeFormula = getInitiativeFormula; // eslint-disable-line
  Combatant.prototype.getInitiativeRoll = getInitiativeRoll;
  Combatant.prototype.rollInitiative = rollCombatantInitiative;

  Combat.prototype.rollInitiative = rollInitiative;

  CombatTracker.prototype._onCombatantControl = _onCombatantControl;
  CombatTracker.prototype._onCombatControl = _onCombatControl;

  // Set tooltips to animate faster
  TooltipManager.TOOLTIP_ACTIVATION_MS = 100;

  // Prelocalize any static strings once localization files become available.
  Hooks.once('i18nInit', () => {
    performPreLocalization(CONFIG.A5E);
    game.a5e.activeEffects.options = constructEffectOptions();
  });

  registerKeybindings();

  return preloadHandlebarsTemplates();
}
