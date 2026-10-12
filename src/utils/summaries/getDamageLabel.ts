import type { A5EActionData } from '../../dataModels/item/actions/ActionDataModel.ts';

export function getDamageRollLabel(roll: { getFormula(): string; damageType: string; }) {
	return `${roll.getFormula()}[${CONFIG.A5E.damageTypes[roll.damageType]}]`;
}

export default function getDamageLabel(action: A5EActionData) {
	const damageRolls = action.getRollsByType().damage;
	if (!damageRolls?.length) return '';

	return damageRolls.map((r) => getDamageRollLabel(r)).join(', ');
}
