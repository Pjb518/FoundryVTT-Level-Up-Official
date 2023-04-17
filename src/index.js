/* eslint-disable no-underscore-dangle */

import './scss/main.scss';

import ActorSheetA5e from './apps/ActorSheet';
import ItemSheetA5e from './apps/ItemSheet';

import A5eChatCard from './apps/chat/ChatCard.svelte';

import A5E from './config';
import ActiveEffectA5e from './documents/activeEffects';
import ActorA5e from './documents/actor';
import D20Roll from './dice/d20Roll';
import ItemA5e from './documents/item';
import TokenA5e from './documents/token';
import TokenDocumentA5e from './documents/tokenDocument';
import TokenHUDA5e from './documents/tokenHUD';

import _onCombatControl from './combat/_onCombatControl';
import _onCombatantControl from './combat/_onCombatantControl';
import getInitiativeFormula from './combat/getInitiativeFormula';
import getInitiativeRoll from './combat/getInitiativeRoll';
import measureDistances from './pixi/measureDistances';
import preloadHandlebarsTemplates from './templates';
import performPreLocalization from './utils/localization/performLocalization';
import registerSystemSettings from './settings';
import rollCombatantInitiative from './combat/rollCombatantInitiative';
import rollInitiative from './combat/rollInitiative';

import createActor from './hooks/createActor';
import createToken from './hooks/createToken';
import ready from './hooks/ready';

import setupConditions from './activeEffects/conditions';

// Macros
import activateActionMacro from './macros/activateActionMacro';
import activateItemMacro from './macros/activateItemMacro';
import createMacro from './macros/createMacro';

// Migrations
import MigrationList from './migration/MigrationList';
import MigrationRunner from './migration/MigrationRunner';
import handleMigration from './migration/handleMigration';

Hooks.once('init', () => {
  game.a5e = {
    applications: {
      ActorSheetA5e,
      ItemSheetA5e
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
    migrations: {
      MigrationList,
      MigrationRunner,
      handleMigration
    }
  };

  CONFIG.A5E = A5E;
  CONFIG.ActiveEffect.documentClass = ActiveEffectA5e;
  CONFIG.Actor.documentClass = ActorA5e;
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

  // TODO: In a future version, this helper can be removed. It is currently needed to support legacy
  // chat cards as we go into 0.9.0.
  Handlebars.registerHelper('containsSubstring', (string, searchTerm) => string.toString().includes(searchTerm));

  Combatant.prototype._getInitiativeFormula = getInitiativeFormula; // eslint-disable-line
  Combatant.prototype.getInitiativeRoll = getInitiativeRoll;
  Combatant.prototype.rollInitiative = rollCombatantInitiative;

  Combat.prototype.rollInitiative = rollInitiative;

  CombatTracker.prototype._onCombatantControl = _onCombatantControl;
  CombatTracker.prototype._onCombatControl = _onCombatControl;

  return preloadHandlebarsTemplates();
});

// Once game object is ready initialize anything that requires the game object
Hooks.once('setup', () => {
  registerSystemSettings();
  setupConditions();
});

// Prelocalize any static strings once localization files become available.
Hooks.once('i18nInit', () => performPreLocalization(CONFIG.A5E));

// Once the entire VTT framework is initialized, check to see if we should perform a data migration
Hooks.once('ready', ready);

Hooks.on('canvasInit', () => {
  canvas.grid.diagonalRule = game.settings.get('a5e', 'diagonalRule');
  SquareGrid.prototype.measureDistances = measureDistances;
  game.canvas.hud.token = new TokenHUDA5e();
});

Hooks.on('init', () => {
  class FastTooltipManager extends TooltipManager {
    static TOOLTIP_ACTIVATION_MS = 100;
  }

  game.tooltip = new FastTooltipManager();
});

Hooks.on('createActor', createActor);
Hooks.on('createToken', createToken);

Hooks.on('renderChatMessage', (message, html) => {
  const target = $(html).find('.message-content article')[0];

  if (!target) return;

  if (CONFIG.A5E.chatCardTypes.includes(message.getFlag('a5e', 'cardType'))) {
    message._svelteComponent = new A5eChatCard({
      target: $(html).find('.message-content article')[0],
      props: { messageDocument: message }
    });
  }
});

Hooks.on('preDeleteChatMessage', (message) => {
  const flagData = message?.flags?.a5e;

  if (typeof flagData === 'object' && typeof message?._svelteComponent?.$destroy === 'function') {
    message._svelteComponent.$destroy();
  }
});
