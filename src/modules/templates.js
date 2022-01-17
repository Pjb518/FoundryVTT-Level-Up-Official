/**
 * Define a set of template paths to pre-load.
 * Pre-loaded templates are compiled and cached for fast access when rendering.
 * @returns {Promise}
 */
export default async () => loadTemplates([
  // Actor sheets
  'systems/a5e/templates/actors/character-sheet.hbs',
  'systems/a5e/templates/actors/npc-sheet.hbs',
  'systems/a5e/templates/actors/limited-actor-sheet.hbs',

  // Actor sheet tabs
  'systems/a5e/templates/actors/tabs/attributes.hbs',
  'systems/a5e/templates/actors/tabs/bio.hbs',
  'systems/a5e/templates/actors/tabs/core.hbs',
  'systems/a5e/templates/actors/tabs/features.hbs',
  'systems/a5e/templates/actors/tabs/inventory.hbs',
  'systems/a5e/templates/actors/tabs/maneuvers.hbs',
  'systems/a5e/templates/actors/tabs/spells.hbs',

  // Actor sheet partials
  'systems/a5e/templates/actors/partials/ability-score.hbs',
  'systems/a5e/templates/actors/partials/combat-mode-navigation.hbs',
  'systems/a5e/templates/actors/partials/health.hbs',
  'systems/a5e/templates/actors/partials/skill.hbs',
  'systems/a5e/templates/actors/partials/standard-navigation.hbs',

  // Item sheets
  'systems/a5e/templates/items/feature-sheet.hbs',
  'systems/a5e/templates/items/maneuver-sheet.hbs',
  'systems/a5e/templates/items/object-sheet.hbs',
  'systems/a5e/templates/items/spell-sheet.hbs',

  // Item sheet tabs
  'systems/a5e/templates/items/tabs/details.hbs',
  'systems/a5e/templates/items/tabs/maneuver-properties.hbs',
  'systems/a5e/templates/items/tabs/object-properties.hbs',
  'systems/a5e/templates/items/tabs/spell-properties.hbs',

  // Item sheet partials
  'systems/a5e/templates/items/partials/ability-check-config.hbs',
  'systems/a5e/templates/items/partials/ability-score-config.hbs',
  'systems/a5e/templates/items/partials/activation-settings.hbs',
  'systems/a5e/templates/items/partials/action-options.hbs',
  'systems/a5e/templates/items/partials/attack-config.hbs',
  'systems/a5e/templates/items/partials/damage-config.hbs',
  'systems/a5e/templates/items/partials/duration.hbs',
  'systems/a5e/templates/items/partials/healing-config.hbs',
  'systems/a5e/templates/items/partials/maneuver-tradition.hbs',
  'systems/a5e/templates/items/partials/primary-spell-school.hbs',
  'systems/a5e/templates/items/partials/secondary-spell-schools.hbs',
  'systems/a5e/templates/items/partials/saving-throw-config.hbs',
  'systems/a5e/templates/items/partials/range.hbs',
  'systems/a5e/templates/items/partials/target.hbs',

  // Chat
  'systems/a5e/templates/chat/ability-check.hbs',
  'systems/a5e/templates/chat/item-card.hbs',

  // Roll Tooltip
  'systems/a5e/templates/chat/roll-tooltip.hbs'
]);
