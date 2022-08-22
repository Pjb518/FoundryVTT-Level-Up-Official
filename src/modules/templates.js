/**
 * Define a set of template paths to pre-load.
 * Pre-loaded templates are compiled and cached for fast access when rendering.
 * @returns {Promise}
 */
export default async () => loadTemplates([
  // Actor sheets
  'systems/a5e/templates/sheet.html',
  'systems/a5e/templates/limited-actor-sheet.hbs',

  // Chat
  'systems/a5e/templates/chat/ability-check.hbs',
  'systems/a5e/templates/chat/item-card.hbs',

  // Roll Tooltip
  'systems/a5e/templates/chat/roll-tooltip.hbs',

  // Announcements
  'systems/a5e/templates/announcements/0.6.0.hbs',

  // Settings
  'systems/a5e/templates/conditionAutomationMenu.hbs'
]);
