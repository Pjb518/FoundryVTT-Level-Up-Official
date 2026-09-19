/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import showdown from 'showdown';

const { Converter } = showdown;

const dirName = url.fileURLToPath(new URL('.', import.meta.url));
const changelogPath = path.resolve(dirName, '../../packs/journals/a5e-changelog.json');

const CORE_VERSION = '14.367';

const markdownConverter = new Converter({
	tables: true,
	strikethrough: true,
	tasklists: true,
	ghCodeBlocks: true,
	simplifiedAutoLink: true,
	simpleLineBreaks: true,
	disableForced4SpacesIndentedSublists: true,
});

/**
 * @param {number} [length]
 * @returns {string}
 */
function randomId(length = 16) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const cutoff = 0x100000000 - (0x100000000 % chars.length);
	const random = new Uint32Array(length);
	do {
		crypto.getRandomValues(random);
	} while (random.some((x) => x >= cutoff));
	let id = '';
	for (let i = 0; i < length; i += 1) id += chars[random[i] % chars.length];
	return id;
}

const version = process.env.RELEASE_VERSION;
const body = process.env.RELEASE_BODY ?? '';
const versionLabel = version && (version.startsWith('v') ? version : `v${version}`);
const pageName = process.env.RELEASE_TITLE?.trim() || versionLabel;

if (!version) {
	console.error('[ERROR] - RELEASE_VERSION environment variable is required.');
	process.exit(1);
}

const journal = JSON.parse(fs.readFileSync(changelogPath, { encoding: 'utf-8' }));

if (journal.pages.some((page) => page._stats?.systemVersion === version)) {
	console.log(`[INFO] - Changelog already has an entry for ${versionLabel}, skipping.`);
	process.exit(0);
}

const highestSort = journal.pages.reduce((max, page) => Math.max(max, page.sort ?? 0), 0);
const now = Date.now();

const page = {
	sort: highestSort + 100000,
	name: pageName,
	type: 'text',
	_id: randomId(),
	system: {},
	title: { show: true, level: 1 },
	image: {},
	text: { format: 2, content: markdownConverter.makeHtml(body), markdown: body },
	video: { controls: true, volume: 0.5 },
	src: null,
	category: null,
	ownership: { default: -1 },
	flags: {},
	_stats: {
		compendiumSource: null,
		duplicateSource: null,
		coreVersion: CORE_VERSION,
		systemId: 'a5e',
		systemVersion: version,
		createdTime: now,
		modifiedTime: now,
		lastModifiedBy: null,
		exportSource: null,
	},
};

journal.pages.push(page);
journal._stats.modifiedTime = now;
journal._stats.systemVersion = version;

fs.writeFileSync(changelogPath, `${JSON.stringify(journal, null, '\t')}\n`, { encoding: 'utf-8' });

console.log(`[INFO] - Added changelog entry for ${pageName}.`);
