import { getDeterministicBonus } from '../../dice/getDeterministicBonus.ts';

export function getMaxUses(item: any): number | string {
	const max = item?.system?.uses?.max;
	if (!item?.actor) return max;

	return getDeterministicBonus(max ?? 0, item.actor.getRollData(item) ?? {});
}

export default function getUsesSummary(item: any): string {
	const uses = item?.system?.uses;
	if (!uses) return '';

	const max = getMaxUses(item);

	if (!uses.value && !max) return '';

	let summary = max ? `${uses.value ?? 0}/${max}` : `${uses.value}`;

	if (uses.per === 'recharge' && uses.recharge.type === 'recoverAll') {
		summary = `${summary} (Recharges on ${uses.recharge.threshold})`;
	} else if (uses.per === 'recharge' && uses.recharge.type === 'formula') {
		summary = `${summary} (Recharges by ${uses.recharge.formula})`;
	} else if (uses.per === 'countdown') {
		const { size, threshold } = uses.countdown;
		summary = `${summary} (Countdown d${size} ≥ ${threshold})`;
	} else if (uses.per) {
		summary = `${summary} (Per ${CONFIG.A5E.resourceRecoveryOptions[uses.per]})`;
	}

	return summary;
}
