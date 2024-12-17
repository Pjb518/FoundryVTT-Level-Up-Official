import hotbarDrop from './hotBarDrop';
import { handleMigration } from '../migration/handlers/handleMigration';

import AnnouncementDialog from '../apps/dialogs/initializers/AnnouncementDialog';
import KeyPressHandler from '../apps/KeyPressHandler.svelte';
import ModuleIncompatibilityDialog from '../apps/dialogs/initializers/ModuleIncompatibilityDialog';

// eslint-disable-next-line no-unused-vars
async function handleAnnouncement() {
	const LATEST_ANNOUNCEMENT_VERSION = '0.18.14';
	const lastAnnouncementShown = game.user?.getFlag('a5e', 'latestAnnouncement');

	// NOTE: The date comparison below is to ensure that this announcement isn't shown after
	// the product bundles expire. It should be removed for future announcements.
	const showAnnouncement =
		(!lastAnnouncementShown ||
			foundry.utils.isNewerVersion(LATEST_ANNOUNCEMENT_VERSION, lastAnnouncementShown)) &&
		Date.now() < 1718600413000;

	if (!showAnnouncement) return;

	const announcementDialog = new AnnouncementDialog('3PP Content Bundles');
	announcementDialog.render(true);

	game.user?.setFlag('a5e', 'latestAnnouncement', game.system.version);
}

async function handleIncompatibilityWarning() {
	if (!game.user?.isGM) return;

	const activeIncompatibleModules = Object.entries(CONFIG.A5E.moduleIncompatibilities).filter(
		([module]) => game.modules.get(module)?.active,
	);

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
