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
import BackgroundDataModel from '../dataModels/item/BackgroundDataModel';
import CultureDataModel from '../dataModels/item/CultureDataModel';
import DestinyDataModel from '../dataModels/item/DestinyDataModel';
import HeritageDataModel from '../dataModels/item/HeritageDataModel';

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
import ActionsManager from '../managers/ActionsManager';
import ResourceConsumptionManager from '../managers/ResourceConsumptionManager';
import RestManager from '../managers/RestManager';
import TemplatePreparationManager from '../managers/TemplatePreparationManager';

// Migrations
import MigrationList from '../migration/MigrationList';
import MigrationRunner from '../migration/MigrationRunner';
import handleMigration from '../migration/handleMigration';
import handlePackMigration from '../migration/handlePackMigration';

// Svelte Components
import Checkbox from '../apps/components/Checkbox.svelte';
import CheckboxGroup from '../apps/components/CheckboxGroup.svelte';
import Editor from '../apps/components/Editor.svelte';
import FormSection from '../apps/components/FormSection.svelte';
import InputField from '../apps/components/InputField.svelte';
import MultiStateCheckBoxGroup from '../apps/components/MultiStateCheckBoxGroup.svelte';
import RadioGroup from '../apps/components/RadioGroup.svelte';
import Spinner from '../apps/components/Spinner.svelte';
import Tag from '../apps/components/Tag.svelte';
import TagGroup from '../apps/components/TagGroup.svelte';

import CreateMenu from '../apps/components/actorUtilityBar/CreateMenu.svelte';
import Filter from '../apps/components/actorUtilityBar/Filter.svelte';
import Search from '../apps/components/actorUtilityBar/Search.svelte';
import ShowDescription from '../apps/components/actorUtilityBar/ShowDescription.svelte';
import Sort from '../apps/components/actorUtilityBar/Sort.svelte';
import UtilityBar from '../apps/components/actorUtilityBar/UtilityBar.svelte';

export default function init() {
  CONFIG.A5E = A5E;
  CONFIG.ActiveEffect.documentClass = ActiveEffectA5e;
  CONFIG.Actor.documentClass = ActorA5e;
  CONFIG.Actor.trackableAttributes = trackableAttributes;
  CONFIG.Item.documentClass = ItemProxy;
  CONFIG.Token.documentClass = TokenDocumentA5e;
  CONFIG.Token.objectClass = TokenA5e;

  CONFIG.Dice.D20Roll = D20Roll;

  CONFIG.Dice.rolls.push(D20Roll);

  CONFIG.MeasuredTemplate.defaults.angle = 60;

  // DataModels
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
    macros: {
      activateActionMacro,
      activateItemMacro,
      createMacro
    },
    managers: {
      ActionsManager,
      ResourceConsumptionManager,
      RestManager,
      TemplatePreparationManager
    },
    migrations: {
      MigrationList,
      MigrationRunner,
      handleMigration,
      handlePackMigration
    },
    svelteComponents: {
      Checkbox,
      CheckboxGroup,
      CreateMenu,
      Editor,
      Filter,
      FormSection,
      InputField,
      MultiStateCheckBoxGroup,
      RadioGroup,
      Search,
      ShowDescription,
      Sort,
      Spinner,
      Tag,
      TagGroup,
      UtilityBar
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
