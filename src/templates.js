/**
 * Define a set of template paths to pre-load.
 * Pre-loaded templates are compiled and cached for fast access when rendering.
 * @returns {Promise}
 */
export default async () => loadTemplates([
  // Settings
  'systems/a5e/templates/conditionAutomationMenu.hbs',

  // Hud
  'systems/a5e/templates/hud/token-hud.hbs'
]);
