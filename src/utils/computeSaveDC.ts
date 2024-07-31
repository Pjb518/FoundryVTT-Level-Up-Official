import type { BaseActorA5e } from '../documents/actor/base';
import type { ItemA5e } from '../documents/item/item';

import getDeterministicBonus from '../dice/getDeterministicBonus';
import getSpellBookDC from './getSpellBookDC';

export default function computeSaveDC(
  actor: BaseActorA5e,
  item: ItemA5e,
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
