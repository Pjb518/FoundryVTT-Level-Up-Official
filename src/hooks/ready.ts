import { mount } from 'svelte';

import hotbarDrop from './hotBarDrop.ts';
import { handleMigration } from '../migration/handlers/handleMigration.ts';
import { collectSynergies } from '#utils/db/indexCompendiaFields.ts';

import KeyPressHandler from '#view/globals/KeyPressHandler.svelte';
// import ModuleIncompatibilityDialog from "../apps/dialogs/initializers/ModuleIncompatibilityDialog.js";

const CHANGELOG_PACK_ID = 'a5e.a5e-journals';
const CHANGELOG_JOURNAL_NAME = 'A5E Changelog';

async function handleChangelog() {
	if (!game.user?.isGM) return;

	const lastSeenVersion = game.settings.get('a5e', 'lastSeenChangelogVersion');

	if (!lastSeenVersion) {
		await game.settings.set('a5e', 'lastSeenChangelogVersion', game.system.version);
		return;
	}

	if (!foundry.utils.isNewerVersion(game.system.version, lastSeenVersion)) return;

	const pack = game.packs.get(CHANGELOG_PACK_ID);
	if (!pack) return;

	const indexEntry = pack.index.find((entry) => entry.name === CHANGELOG_JOURNAL_NAME);
	if (!indexEntry) return;

	const journal = await pack.getDocument(indexEntry._id);
	const latestPage = journal?.pages.contents.reduce(
		(latest, page) => (!latest || page.sort > latest.sort ? page : latest),
		null,
	);
	if (!latestPage) return;

	journal.sheet.render(true, { pageId: latestPage._id });

	await game.settings.set('a5e', 'lastSeenChangelogVersion', game.system.version);
}

async function _handleIncompatibilityWarning() {
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
	mount(KeyPressHandler, { target: document.body });
}

export default async function ready() {
	Hooks.on('hotbarDrop', hotbarDrop);

	collectSynergies();
	handleMigration();
	handleChangelog();
	// handleIncompatibilityWarning();
	addKeyPressLogger();
}
