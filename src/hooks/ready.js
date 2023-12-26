import hotbarDrop from './hotBarDrop';
import handleMigration from '../migration/handleMigration';

import AnnouncementDialog from '../apps/dialogs/initializers/AnnouncementDialog';
import KeyPressHandler from '../apps/KeyPressHandler.svelte';
import ModuleIncompatibilityDialog from '../apps/dialogs/initializers/ModuleIncompatibilityDialog';

// eslint-disable-next-line no-unused-vars
async function handleAnnouncement() {
  const LATEST_ANNOUNCEMENT_VERSION = '0.16.4';
  const lastAnnouncementShown = game.user.getFlag('a5e', 'latestAnnouncement');

  const showAnnouncement = !lastAnnouncementShown
    || foundry.utils.isNewerVersion(LATEST_ANNOUNCEMENT_VERSION, lastAnnouncementShown);

  if (!showAnnouncement) return;

  const announcementDialog = new AnnouncementDialog('A5e Version 0.16.4 Announcements');
  announcementDialog.render(true);

  game.user.setFlag('a5e', 'latestAnnouncement', game.system.version);
}

async function handleIncompatibilityWarning() {
  const activeIncompatibleModules = Object.entries(CONFIG.A5E.moduleIncompatibilities)
    .filter(([module]) => game.modules.get(module)?.active);

  if (!activeIncompatibleModules.length) return;

  const dialog = new ModuleIncompatibilityDialog(activeIncompatibleModules);
  dialog.render(true);
}

async function addKeyPressLogger() {
  // eslint-disable-next-line no-new
  new KeyPressHandler({ target: document.body });
}

export default async function ready() {
  Hooks.on('hotbarDrop', hotbarDrop);

  handleMigration();
  handleAnnouncement();
  handleIncompatibilityWarning();
  addKeyPressLogger();
}
