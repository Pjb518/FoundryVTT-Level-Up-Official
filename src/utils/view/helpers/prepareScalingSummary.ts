import { isObject } from '#utils/isObject.ts';
import { localize } from '#utils/localization/localize.ts';

type ScalingData = {
	formula: Record<string, any> | string;
	mode: string;
	step: string;
	config?: { number?: number; value?: string };
};

const SUMMARY_KEY_BY_MODE: Record<string, string> = {
	actionUses: 'uses',
	itemUses: 'uses',
	resourceUses: 'uses',
};

const NON_STEPPED_MODES = new Set(['cantrip']);

function buildConfigFormula(config: ScalingData['config'], dieFaces?: number | string) {
	const parts: string[] = [];
	if (config?.number && dieFaces) parts.push(`${config.number}d${dieFaces}`);
	if (config?.value) parts.push(config.value);
	return parts.join(' + ') || '0';
}

export function prepareScalingSummary(
	type: string,
	data: ScalingData,
	extra: Record<string, any> = {},
) {
	if (!data) return '';
	const { mode } = data;
	if (!mode) return '';

	let summaryKey = SUMMARY_KEY_BY_MODE[mode] ?? mode;

	if (Number(data.step) > 1 && !NON_STEPPED_MODES.has(summaryKey)) {
		summaryKey = `stepped${summaryKey.charAt(0).toUpperCase()}${summaryKey.slice(1)}`;
	}

	const baseSummary = `A5E.scaling.summaries.${summaryKey}.${type}`;
	const formula = isObject(data.formula)
		? data.formula
		: { formula: data.formula ?? buildConfigFormula(data.config, extra.dieFaces) };

	const localized = localize(baseSummary, {
		...formula,
		...extra,
		step: data.step,
	});

	return localized;
}
