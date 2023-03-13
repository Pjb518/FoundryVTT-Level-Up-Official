import doubleAllDamage from './doubleRolledDamage';
import doubleDiceDamage from './doubleDiceDamage';
import doubleDiceQuantity from './doubleDiceQuantity';
import doubleDiceQuantityAndMods from './doubleDiceQuantityAndMods';
import getBonusCritDamage from './getBonusCritDamage';
import maxDamage from './maxDamage';
import maxDamagePlusRoll from './maxDamagePlusRoll';

const CRIT_CALCULATION_FUNCTION_MAP = {
  doubleAllDamage,
  doubleDiceDamage,
  doubleDiceQuantity,
  doubleDiceQuantityAndMods,
  maxDamage,
  maxDamagePlusRoll
};

export default async function constructCritDamageRoll(baseRoll, critBonus) {
  const critCalculationMode = game.settings.get('a5e', 'critCalculationMode');
  const terms = await CRIT_CALCULATION_FUNCTION_MAP[critCalculationMode](baseRoll);

  if (critBonus) terms.push(...(await getBonusCritDamage(critBonus)));

  return Roll.fromTerms(terms);
}
