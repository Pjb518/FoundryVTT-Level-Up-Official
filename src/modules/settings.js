export default function registerSystemSettings() {
  // Internal System Migration Version
  game.settings.register('a5e', 'systemMigrationVersion', {
    name: 'System Migration Version',
    scope: 'world',
    config: false,
    type: String,
    default: ''
  });

  // Diagonal Movement Rule
  game.settings.register('a5e', 'diagonalRule', {
    name: 'A5E.Settings.DiagName',
    hint: 'A5E.Settings.DiagHint',
    scope: 'world',
    config: true,
    default: 'normal',
    type: String,
    choices: {
      normal: 'A5E.Settings.DiagNormal',
      euclidean: 'A5E.Settings.DiagEuclidean',
      5105: 'A5E.Settings.Diag5105'
    },
    onChange: (rule) => { canvas.grid.diagonalRule = rule; }
  });

  // Default GM Setting for placing templates
  game.settings.register('a5e', 'placeItemTemplateDefault', {
    name: 'Place templates for items by default',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false
  });
}
