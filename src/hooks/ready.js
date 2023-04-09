import MigrationList from '../migration/MigrationList';
import MigrationRunner from '../migration/MigrationRunner';

import hotbarDrop from './hotBarDrop';

import KeyPressHandler from '../apps/KeyPressHandler.svelte';

export default async function ready() {
  Hooks.on('hotbarDrop', hotbarDrop);

  handleMigration();
  // handleAnnouncement();
  addKeyPressLogger();
}

async function handleMigration() {
  if (!game.user.isGM) return;

  // Determine whether a system migration is required
  const currentVersion = game.settings.get('a5e', 'worldSchemaVersion');

  // Save the current world schema version if hasn't before.
  const storedSchemaVersion = game.settings.storage
    .get('world')
    .getItem('a5e.worldSchemaVersion');

  if (!storedSchemaVersion) {
    const minimumVersion = MigrationRunner.RECOMMENDED_SAFE_VERSION;
    const currVersion = game.actors.size === 0
      ? game.settings.get('a5e', 'worldSchemaVersion')
      : Math.max(
        Math.min(...new Set(game.actors.map((actor) => actor.schemaVersion ?? minimumVersion))),
        minimumVersion
      );
    await game.settings.set('a5e', 'worldSchemaVersion', currVersion);
  }

  // Perform Migrations if necessary
  const migrationRunner = new MigrationRunner(
    MigrationList.constructFromVersion(currentVersion)
  );

  if (migrationRunner.needsMigration()) {
    if (currentVersion && currentVersion < MigrationRunner.MIN_SAFE_VERSION) {
      ui.notifications.error(
        'Your A5E system data is from too old a Foundry version and cannot be reliably migrated to the latest version. The process will be attempted, but errors may occur.',
        { permanent: true }
      );
    }

    await migrationRunner.runMigration();
    // TODO: Add Migration summary
    // https://github.com/foundryvtt/pf2e/blob/5fd278acdd15f5337e54484bde45b2e1f5bf0b0a/src/module/apps/migration-summary.ts
  }
}

// eslint-disable-next-line no-unused-vars
async function handleAnnouncement() {
  const LATEST_ANNOUNCEMENT_VERSION = '0.8.0';
  const lastAnnouncementShown = game.user.getFlag('a5e', 'latestAnnouncement');

  const showAnnouncement = !lastAnnouncementShown
    || isNewerVersion(LATEST_ANNOUNCEMENT_VERSION, lastAnnouncementShown);

  if (!showAnnouncement) return;

  const announcementWindow = new Application({
    title: 'Test!',
    template: 'systems/a5e/templates/announcements/0.9.0.hbs',
    width: 700
  });

  announcementWindow.render(true);

  game.user.setFlag('a5e', 'latestAnnouncement', game.system.version);
}

async function addKeyPressLogger() {
  // eslint-disable-next-line no-new
  new KeyPressHandler({ target: document.body });
}
