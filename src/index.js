import './scss/main.scss';

import handlebarsHelperRange from 'handlebars-helper-range';

import A5E from './modules/config';
import Actor5e from './modules/actor/entity';
import D20Roll from './modules/dice/d20Roll';
import DamageRoll from './modules/dice/damageRoll';
import Item5e from './modules/item/entity';
import ActorSheet5eCharacter from './modules/sheets/character';
import ActorSheet5eNPC from './modules/sheets/npc';
import ItemSheet5e from './modules/sheets/item';
import ReactiveDialog from './modules/apps/reactiveDialog';

import getInitiativeFormula from './modules/combat/getInitiativeFormula';
import getInitiativeRoll from './modules/combat/getInitiativeRoll';
import preloadHandlebarsTemplates from './modules/templates';
import rollCombatantInitiative from './modules/combat/rollCombatantInitiative';
import rollInitiative from './modules/combat/rollInitiative';

Hooks.once('init', () => {
  game.a5e = {
    applications: {
      ActorSheet5eCharacter,
      ActorSheet5eNPC,
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
      Item5e
    }
  };

  CONFIG.A5E = A5E;
  CONFIG.Actor.documentClass = Actor5e;
  CONFIG.Item.documentClass = Item5e;

  CONFIG.Dice.D20Roll = D20Roll;
  CONFIG.Dice.DamageRoll = DamageRoll;

  CONFIG.Dice.rolls.push(D20Roll);
  CONFIG.Dice.rolls.push(DamageRoll);

  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('dnd5e', ActorSheet5eCharacter, {
    types: ['character'],
    makeDefault: true,
    label: 'A5E.SheetClassCharacter'
  });

  Actors.registerSheet('dnd5e', ActorSheet5eNPC, {
    types: ['npc'],
    makeDefault: true,
    label: 'A5E.SheetClassNPC'
  });

  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('dnd5e', ItemSheet5e, {
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

Hooks.on('renderChatMessage', (app, html) => Item5e.chatListeners(html));
