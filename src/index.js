import './scss/main.scss';
import 'remixicon/fonts/remixicon.css';

import handlebarsHelperRange from 'handlebars-helper-range';

import A5E from './modules/config';
import Actor5e from './modules/actor/entity';
import D20Roll from './modules/dice/d20Roll';
import DamageRoll from './modules/dice/damageRoll';
import Item5e from './modules/item/entity';
import ActorSheet5e from './modules/sheets/character';
import ActiveEffect5e from './modules/activeEffects/entity';
import ItemSheet5e from './modules/sheets/item';
import ReactiveDialog from './modules/apps/reactiveDialog';
import Token5e from './modules/actor/token';
import TokenDocument5e from './modules/actor/tokenDocument';

import AbilityDialog from './vue/AbilityDialog.vue';
import DeathSavingThrowDialog from './vue/DeathSavingThrowDialog.vue';
import InitiativeDialog from './vue/InitiativeDialog.vue';
import ItemActivationDialog from './vue/ItemActivationDialog.vue';
import RestDialog from './vue/RestDialog.vue';

import getDialogData from './modules/dice/getDialogData';
import getInitiativeFormula from './modules/combat/getInitiativeFormula';
import getInitiativeRoll from './modules/combat/getInitiativeRoll';
import measureDistances from './modules/pixi/measureDistances';
import preloadHandlebarsTemplates from './modules/templates';
import registerSystemSettings from './modules/settings';
import rollCombatantInitiative from './modules/combat/rollCombatantInitiative';
import rollInitiative from './modules/combat/rollInitiative';

import setupConditions from './modules/activeEffects/conditions';

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
      ActorSheet5e,
      ItemSheet5e,
      ReactiveDialog
    },
    config: A5E,
    dice: {
      D20Roll,
      DamageRoll
    },
    entities: {
      Actor5e,
      Item5e,
      TokenDocument5e,
      Token5e
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
    },
    vue: {
      AbilityDialog,
      DeathSavingThrowDialog,
      InitiativeDialog,
      ItemActivationDialog,
      RestDialog
    },
    utils: {
      getDialogData
    }
  };

  CONFIG.A5E = A5E;
  CONFIG.ActiveEffect.documentClass = ActiveEffect5e;
  CONFIG.Actor.documentClass = Actor5e;
  CONFIG.Item.documentClass = Item5e;
  CONFIG.Token.documentClass = TokenDocument5e;
  CONFIG.Token.objectClass = Token5e;

  CONFIG.Dice.D20Roll = D20Roll;
  CONFIG.Dice.DamageRoll = DamageRoll;

  CONFIG.Dice.rolls.push(D20Roll);
  CONFIG.Dice.rolls.push(DamageRoll);

  CONFIG.MeasuredTemplate.defaults.angle = 60;

  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('a5e', ActorSheet5e, {
    types: ['character'],
    makeDefault: true,
    label: 'A5E.SheetClassCharacter'
  });

  Actors.registerSheet('a5e', ActorSheet5e, {
    types: ['npc'],
    makeDefault: true,
    label: 'A5E.SheetClassNPC'
  });

  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('a5e', ItemSheet5e, {
    makeDefault: true,
    label: 'A5E.SheetClassItem'
  });

  Handlebars.registerHelper('range', handlebarsHelperRange);
  Handlebars.registerHelper('contains', (array, value) => Array.isArray(array) && array.includes(value));
  Handlebars.registerHelper('containsSubstring', (string, searchTerm) => string.toString().includes(searchTerm));

  Combatant.prototype._getInitiativeFormula = getInitiativeFormula; // eslint-disable-line
  Combatant.prototype.getInitiativeRoll = getInitiativeRoll;
  Combatant.prototype.rollInitiative = rollCombatantInitiative;

  Combat.prototype.rollInitiative = rollInitiative;

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

Hooks.on('canvasInit', () => {
  canvas.grid.diagonalRule = game.settings.get('a5e', 'diagonalRule');
  SquareGrid.prototype.measureDistances = measureDistances;
});

Hooks.on('renderChatMessage', (_, html) => Item5e.chatListeners(html));

// TODO: Move to separate file in 1.0.0
Hooks.on('createToken', async (token) => {
  if (!game.user.isGM) return;

  // Checks if its a NPC type of actor and if the game setting is set to true
  if (token.actor.type === 'npc' && game.settings.get('a5e', 'randomizeNPCHealth')) {
    // getting the NPC Hit Dice
    const { hitDice } = token.actor.system.attributes;

    // Get Constitution Modifier
    const conMod = token.actor.system.abilities.con.mod;

    let hitDiceCount = 0;
    const parts = [];

    // Builds towards the hitDiceFormula for Roll and tracks the totalHitDiceCount
    Object.entries(hitDice).forEach(([dieType, hitDie]) => {
      if (!hitDie.total) return;

      parts.push(`${hitDie.total}${dieType}`);
      hitDiceCount += hitDie.total;
    });

    // creates the actual hitDiceFormula
    const hitDiceFormula = `${parts.join(' + ')} + ${hitDiceCount * conMod}`;

    // Roll the hitDiceFormula
    // TODO: Remove async true when foundry bug is fixed
    const hpRoll = await new Roll(hitDiceFormula).roll({ async: true });
    // await hpRoll.toMessage({ whisper: ChatMessage.getWhisperRecipients("Gm") });

    // Update token with new information
    token.actor.update({
      'system.attributes.hp': {
        baseMax: hpRoll.total,
        value: hpRoll.total
      }
    });
  }
});
