import ActorSheetA5e from '../apps/ActorSheet';
import ActiveEffectConfigA5e from '../apps/ActiveEffectConfig';
import ItemSheetA5e from '../apps/ItemSheet';

import A5E from '../config';
import ActiveEffectA5e from '../documents/activeEffect/activeEffect';
import ActorA5e from '../documents/actor/actor';
import D20Roll from '../dice/d20Roll';
import ItemA5e from '../documents/item';
import TokenA5e from '../documents/token';
import TokenDocumentA5e from '../documents/tokenDocument';

import EffectOptions from '../activeEffects/EffectOptions';

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

export default function init() {
  game.a5e = {
    applications: {
      ActorSheetA5e,
      ItemSheetA5e
    },
    activeEffects: {
      EffectOptions
    },
    config: A5E,
    dice: {
      D20Roll
    },
    entities: {
      ActorA5e,
      ItemA5e,
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
      handleMigration
    }
  };

  CONFIG.A5E = A5E;
  CONFIG.ActiveEffect.documentClass = ActiveEffectA5e;
  CONFIG.Actor.documentClass = ActorA5e;
  CONFIG.Actor.trackableAttributes = trackableAttributes;
  CONFIG.Item.documentClass = ItemA5e;
  CONFIG.Token.documentClass = TokenDocumentA5e;
  CONFIG.Token.objectClass = TokenA5e;

  CONFIG.Dice.D20Roll = D20Roll;

  CONFIG.Dice.rolls.push(D20Roll);

  CONFIG.MeasuredTemplate.defaults.angle = 60;

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
    game.a5e.activeEffects.EffectOptions.createOptions();
  });

  return preloadHandlebarsTemplates();
}
