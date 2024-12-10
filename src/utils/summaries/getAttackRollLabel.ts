import type { AttackRollData } from '../../dataModels/item/actions/ActionRollsDataModel';
import { RollPreparationManager } from '../../managers/RollPreparationManager';

function reduceAttackDice (array, die: string) {
	let numberOfDice = 0;

	array.map( (term: string) => {
		if ( term.includes(die) ) {
			numberOfDice += Number(term.substring(0, term.indexOf("d")));
		}
	});

	if (numberOfDice) return numberOfDice + die;
	
	return '';
}


export default function getAttackRollLabel(item: ItemA5e, action: AttackRollData) {
	if (foundry.utils.isEmpty(item) || foundry.utils.isEmpty(item.actor) || foundry.utils.isEmpty(action)) return '';

	const rolls = action?.rolls;
	const rollID = Object.keys(rolls).filter((id) => rolls[id].type === "attack");
	const attackRollData = rolls[rollID];
	
	if (!rolls || !attackRollData) return '';

	const parts = RollPreparationManager.prepareAttackRollData(item.actor, item, attackRollData);
	const formula = parts.formula.replace(/\[.+?]/g, '').split("+");

	let integerTotal = 0;
	const diceList = ["d4", "d6", "d8", "d10", "d12"];

	formula.map( (term) => {
		if (!term.includes("d")) {
			integerTotal += Number(term);
		}
	});

	const toHitArray = ["+" + integerTotal];

	diceList.map ( (die) => {
		const dieTerm = reduceAttackDice(formula, die);
		if (dieTerm) toHitArray.push(dieTerm);
	});

	const toHit = toHitArray.join(" + ");
	
	return toHit;
}
