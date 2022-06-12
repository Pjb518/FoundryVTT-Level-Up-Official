export default function registerSystemSettings() {
  // Internal System Migration Version
  game.settings.register('a5e', 'systemMigrationVersion', {
    name: 'System Migration Version',
    scope: 'world',
    config: false,
    type: String,
    default: ''
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
