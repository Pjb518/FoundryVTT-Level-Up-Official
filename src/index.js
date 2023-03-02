/* eslint-disable no-underscore-dangle */

import './scss/main.scss';

// eslint-disable-next-line no-unused-vars
import migrateActionsConfig from './modules/migrations/v090Migrations/migrateActionsConfig';

import ActorSheetA5e from './apps/ActorSheet';
import ItemSheetA5e from './apps/ItemSheet';

import A5eChatCard from './apps/chat/ChatCard.svelte';
import KeyPressHandler from './apps/KeyPressHandler.svelte';

import A5E from './config';
import ActiveEffectA5e from './documents/activeEffects';
import ActorA5e from './documents/actor';
import D20Roll from './dice/d20Roll';
import DamageRoll from './dice/damageRoll';
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
import registerSystemSettings from './settings';
import rollCombatantInitiative from './combat/rollCombatantInitiative';
import rollInitiative from './combat/rollInitiative';

import setupConditions from './activeEffects/conditions';

// Macros
import activateItemMacro from './modules/macros/activateItemMacro';
import createMacro from './modules/macros/createMacro';

// Migrations
import migrateWorld from './modules/migrations/migrateWorld';
import migrateActorData from './modules/migrations/migrateActorData';
import migrateCompendium from './modules/migrations/migrateCompendium';
import migrateItemData from './modules/migrations/migrateItemData';
import migrateMacroData from './modules/migrations/migrateMacroData';
import migrateSceneData from './modules/migrations/migrateSceneData';

import migrateCurrentHitPoints from './modules/migrations/helpers/migrateCurrentHitPoints';

Hooks.once('init', () => {
  game.a5e = {
    applications: {
      ActorSheetA5e,
      ItemSheetA5e
    },
    config: A5E,
    dice: {
      D20Roll,
      DamageRoll
    },
    entities: {
      ActorA5e,
      ItemA5e,
      TokenDocumentA5e,
      TokenA5e
    },
    macros: {
      activateItemMacro,
      createMacro
    },
    migrations: {
      migrateWorld,
      migrateActorData,
      migrateCompendium,
      migrateItemData,
      migrateMacroData,
      migrateSceneData,
      migrateCurrentHitPoints
    }
  };

  CONFIG.A5E = A5E;
  CONFIG.ActiveEffect.documentClass = ActiveEffectA5e;
  CONFIG.Actor.documentClass = ActorA5e;
  CONFIG.Item.documentClass = ItemA5e;
  CONFIG.Token.documentClass = TokenDocumentA5e;
  CONFIG.Token.objectClass = TokenA5e;

  CONFIG.Dice.D20Roll = D20Roll;
  CONFIG.Dice.DamageRoll = DamageRoll;

  CONFIG.Dice.rolls.push(D20Roll);
  CONFIG.Dice.rolls.push(DamageRoll);

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

/**
 * Once game object is ready initialize anything that requires the game object
 */
Hooks.once('setup', () => {
  registerSystemSettings();
  setupConditions();
});

/**
 * Once the entire VTT framework is initialized, check to see if we should perform a data migration
 */
Hooks.once('ready', () => {
  // eslint-disable-next-line consistent-return
  Hooks.on('hotbarDrop', (_, data, slot) => {
    if (data.type === 'Item') {
      game.a5e.macros.createMacro(data, slot);
      return false;
    }
  });

  // Determine whether a system migration is required
  if (!game.user.isGM) return;

  const currentVersion = game.settings.get('a5e', 'systemMigrationVersion');
  const NEEDS_MIGRATION_VERSION = '0.7.0';
  const totalDocuments = game.actors.size + game.scenes.size + game.items.size;

  if (!currentVersion && totalDocuments === 0) {
    game.settings.set('a5e', 'systemMigrationVersion', game.system.data.version);
    return;
  }

  const needsMigration = !currentVersion || isNewerVersion(NEEDS_MIGRATION_VERSION, currentVersion);
  if (!needsMigration) return;

  game.a5e.migrations.migrateWorld();
});

Hooks.once('ready', () => {
  const LATEST_ANNOUNCEMENT_VERSION = '0.6.0';
  const lastAnnouncementShown = game.user.getFlag('a5e', 'latestAnnouncement');

  const showAnnouncement = !lastAnnouncementShown
    || isNewerVersion(LATEST_ANNOUNCEMENT_VERSION, lastAnnouncementShown);

  if (!showAnnouncement) return;

  const announcementWindow = new Application({
    title: 'Test!',
    template: 'systems/a5e/templates/announcements/0.6.0.hbs',
    width: 700
  });

  announcementWindow.render(true);

  game.user.setFlag('a5e', 'latestAnnouncement', game.system.data.version);
});

Hooks.once('ready', () => {
  // eslint-disable-next-line no-new
  new KeyPressHandler({ target: document.body });
});

Hooks.on('canvasInit', () => {
  canvas.grid.diagonalRule = game.settings.get('a5e', 'diagonalRule');
  SquareGrid.prototype.measureDistances = measureDistances;
  game.canvas.hud.token = new TokenHUDA5e();
});

Hooks.on('renderChatMessage', (_, html) => ItemA5e.chatListeners(html));

Hooks.on('init', () => {
  class FastTooltipManager extends TooltipManager {
    static TOOLTIP_ACTIVATION_MS = 100;
  }

  game.tooltip = new FastTooltipManager();
});

// TODO: Move to separate file in 1.0.0
Hooks.on('createToken', async (token, _, userID) => {
  const { actor } = token;
  const userPlacingToken = game.users.get(userID);

  if (![game.user.isGM, game.user === userPlacingToken, actor.type === 'npc', game.settings.get('a5e', 'randomizeNPCHitPoints')
  ].every(Boolean)) return;

  const { hitPointFormula } = actor;

  if (hitPointFormula === null) return;

  const hpRoll = new Roll(hitPointFormula);
  await hpRoll.toMessage({ flavor: `Rolling hit points for ${token.name}.` }, { rollMode: 'gmroll' });

  // Update token with new information
  actor.update({
    'system.attributes.hp': {
      baseMax: hpRoll.total,
      value: hpRoll.total
    }
  });
});

Hooks.on('renderChatMessage', (message, html) => {
  if (['abilityCheck', 'item', 'savingThrow', 'skillCheck'].includes(message.getFlag('a5e', 'cardType'))) {
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
