import type { A5EActionData } from '../../dataModels/item/actions/ActionDataModel.ts';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function getAttackRollLabel(action: A5EActionData) {
	const rolls = action.getRollsByType();
	const attackRoll = rolls.attack;
	if (!attackRoll) return '';
	if (!rolls.attack?.length) return '';

	return attackRoll[0].getFormula();
}
