import type { A5EActionData } from '../../dataModels/item/actions/ActionDataModel.ts';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function getDamageLabel(action: A5EActionData) {
	const rolls = action.getRollsByType();
	const damageRolls = rolls.damage;
	if (!damageRolls) return '';
	if (!rolls.damage?.length) return '';

	let damageLabel = '';
	damageRolls.forEach((r, idx) => {
		damageLabel += `${r.getFormula()}[${CONFIG.A5E.damageTypes[r.damageType]}]`;
		if (idx > damageRolls.length - 1) damageLabel += ', ';
	});

	return damageLabel;
}
