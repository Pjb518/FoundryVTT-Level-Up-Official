import getDeterministicBonus from '../dice/getDeterministicBonus';

export default function computeSaveDC(actor: any, saveDC: any): number | null {
  if (!actor) return null;

  const rollData: object = actor.getRollData();
  const terms: (string | number)[] = [];

  if (saveDC?.type === 'spellcasting') {
    terms.push(actor.system.attributes.spellDC);
  } else if (saveDC?.type === 'maneuver') {
    terms.push(actor.system.attributes.maneuverDC);
    // @ts-ignore missing CONFIG variable
  } else if (Object.keys(CONFIG.A5E.abilities).includes(saveDC?.type)) {
    terms.push(8, actor.system.attributes.prof, actor.system.abilities[saveDC?.type].check.mod);
  }

  if (saveDC.bonus) {
    terms.push(saveDC?.bonus);
  }

  return getDeterministicBonus(terms.join(' + '), rollData);
}
