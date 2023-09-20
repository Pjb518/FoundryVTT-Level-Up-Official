import hotbarDrop from './hotBarDrop';
import handleMigration from '../migration/handleMigration';

import KeyPressHandler from '../apps/KeyPressHandler.svelte';

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

export default async function ready() {
  Hooks.on('hotbarDrop', hotbarDrop);

  handleMigration();
  // handleAnnouncement();
  addKeyPressLogger();
}
