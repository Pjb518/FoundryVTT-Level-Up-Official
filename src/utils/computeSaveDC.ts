import getDeterministicBonus from '../dice/getDeterministicBonus';
import getSpellBookDC from './getSpellBookDC';

export default function computeSaveDC(
  actor: typeof Actor,
  item: typeof Item,
  saveDC: any
): number | null {
  if (!actor) return null;

  const rollData: object = actor.getRollData(item);
  const terms: (string | number)[] = [];

  if (saveDC?.type === 'spellcasting') {
    terms.push(getSpellBookDC(actor, item));
  } else if (saveDC?.type === 'maneuver') {
    terms.push(actor.system.attributes.maneuverDC);
  } else if (Object.keys(CONFIG.A5E.abilities).includes(saveDC?.type)) {
    terms.push(8, actor.system.attributes.prof, actor.system.abilities[saveDC?.type].check.mod);
  }

  if (saveDC.bonus) {
    terms.push(saveDC?.bonus);
  }

  return getDeterministicBonus(terms.join(' + '), rollData);
}
