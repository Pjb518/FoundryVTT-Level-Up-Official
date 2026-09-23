import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import {
	type ProductEntry,
	productLines,
	products,
	publishers,
} from '../src/config/premiumContent/data.ts';

// ---------------------------------------------------
//             Validate references
// ---------------------------------------------------

const errors: string[] = [];

for (const [slug, product] of Object.entries(products)) {
	if (product.publisher && !(product.publisher in publishers)) {
		errors.push(`Product "${slug}" references unknown publisher "${product.publisher}".`);
	}

	if (product.productLine && !(product.productLine in productLines)) {
		errors.push(`Product "${slug}" references unknown product line "${product.productLine}".`);
	}
}

if (errors.length > 0) {
	console.error('[ERROR] - Found broken references in src/config/premiumContent/data.ts:');
	for (const error of errors) console.error(`  - ${error}`);
	process.exit(1);
}

console.log(
	`[INFO] - Validated ${Object.keys(products).length} products, ${Object.keys(publishers).length} publishers, ${Object.keys(productLines).length} product lines.`,
);

// ---------------------------------------------------
//             Render markdown
// ---------------------------------------------------

function renderBullet(product: ProductEntry): string {
	const label = product.url ? `[${product.title}](${product.url})` : product.title;
	return product.salesPitch ? `- ${label} - ${product.salesPitch}` : `- ${label}`;
}

function compareText(a: string, b: string): number {
	return a.localeCompare(b, undefined, { numeric: true });
}

function renderBullets(entries: ProductEntry[]): string {
	return [...entries]
		.sort((a, b) => compareText(a.title, b.title))
		.map(renderBullet)
		.join('\n');
}

function sortByDisplayName<T>(
	map: Map<string, T[]>,
	displayNames: Record<string, string>,
): [string, T[]][] {
	return [...map.entries()].sort(([a], [b]) => compareText(displayNames[a], displayNames[b]));
}

function renderGroup(heading: string, entries: ProductEntry[], headingLevel = '##'): string {
	if (entries.length === 0) return '';
	return `${headingLevel} ${heading}\n\n${renderBullets(entries)}`;
}

type WikiCategory = ProductEntry['category'] | 'included';

function getWikiCategory(product: ProductEntry): WikiCategory {
	return product.moduleDeprecated ? 'included' : product.category;
}

function groupByKey<T>(
	entries: T[],
	keyFn: (entry: T) => string | undefined,
): { ungrouped: T[]; byKey: Map<string, T[]> } {
	const ungrouped: T[] = [];
	const byKey = new Map<string, T[]>();
	for (const entry of entries) {
		const key = keyFn(entry);
		if (!key) {
			ungrouped.push(entry);
			continue;
		}
		const group = byKey.get(key) ?? [];
		group.push(entry);
		byKey.set(key, group);
	}
	return { ungrouped, byKey };
}

function renderCategorySections(
	heading: string,
	entries: ProductEntry[],
	categoryLevel = '##',
): string[] {
	if (entries.length === 0) return [];

	const publisherLevel = `${categoryLevel}#`;
	const productLineLevel = `${publisherLevel}#`;

	const { ungrouped: noPublisher, byKey: byPublisher } = groupByKey(
		entries,
		(product) => product.publisher,
	);

	const sections: string[] = [`${categoryLevel} ${heading}`];
	if (noPublisher.length > 0) sections.push(renderBullets(noPublisher));

	for (const [publisherKey, publisherEntries] of sortByDisplayName(byPublisher, publishers)) {
		const { ungrouped: standalone, byKey: byProductLine } = groupByKey(
			publisherEntries,
			(product) => product.productLine,
		);

		const publisherSection: string[] = [`${publisherLevel} ${publishers[publisherKey]}`];
		if (standalone.length > 0) publisherSection.push(renderBullets(standalone));
		for (const [lineKey, lineEntries] of sortByDisplayName(byProductLine, productLines)) {
			publisherSection.push(renderGroup(productLines[lineKey], lineEntries, productLineLevel));
		}

		sections.push(publisherSection.join('\n\n'));
	}

	return sections;
}

const allProducts = Object.values(products);

const contentModules = allProducts.filter((product) => getWikiCategory(product) === 'content');
const utilityModules = allProducts.filter((product) => getWikiCategory(product) === 'utility');
const premiumProducts = allProducts.filter((product) => getWikiCategory(product) === 'premium');
const includedProducts = allProducts.filter((product) => getWikiCategory(product) === 'included');

const sections = [
	'# Modules',
	"In addition to the wealth of system agnostic modules available on Foundry, several modules have already been made specifically for Level Up. You can find a list of these packages below.\n\nIf you've developed a module for the Level Up system and would like it listed here, feel free to get in touch. You can find several ways to contact me in the `system.json`, or you can open a ticket if you'd prefer.",
	'## Free Modules', // heading only - Content/Utility subsections below carry the entries
	...renderCategorySections('Content Modules', contentModules, '###'),
	...renderCategorySections('Utility Modules', utilityModules, '###'),
	...renderCategorySections('Premium Modules', premiumProducts),
	...renderCategorySections('Included in the System', includedProducts),
];

const markdown = `${sections.filter(Boolean).join('\n\n').trimEnd()}\n`;

// ---------------------------------------------------
//             Write output
// ---------------------------------------------------

const dirName = url.fileURLToPath(new URL('.', import.meta.url));
const outputDir = path.resolve(dirName, 'output');
const outputPath = path.resolve(outputDir, 'Modules.md');

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, markdown, 'utf-8');

console.log(`[INFO] - Wrote wiki content to ${outputPath}`);
