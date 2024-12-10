import type { DamageRollData } from '../../dataModels/item/actions/ActionRollsDataModel';

function getDamageFormula(damageRoll: DamageRollData) {
    const formula = damageRoll.formula;
    //convert @ to integer

    let damageFormula = formula;

    damageFormula += " " + damageRoll.damageType;

    if (damageRoll.critBonus) damageFormula += " (Bonus Critical Damage: " + damageRoll.critBonus + ")";

    return damageFormula;
}

export default function getDamageLabel(item: ItemA5e, action: DamageRollData) {
    if (foundry.utils.isEmpty(item) || foundry.utils.isEmpty(item.actor) || foundry.utils.isEmpty(action)) return '';

    
    const rolls = action?.rolls;
    console.log("rolls = " + JSON.stringify(rolls));
	const rollIDs = Object.keys(rolls).filter((id) => rolls[id].type === "damage" && rolls[id].default);
    const damageRollDataArray = rollIDs.map((id) => rolls[id]);

    if (!rolls || !damageRollDataArray) return '';

    const damageLabel = damageRollDataArray.map((damageRoll) => getDamageFormula(damageRoll)).join(", ");
    console.log("damageLabel = " + damageLabel);


    return '';
}
