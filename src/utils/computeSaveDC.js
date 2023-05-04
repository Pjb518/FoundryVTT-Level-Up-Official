import getDeterministicBonus from '../dice/getDeterministicBonus';

export default function computeSaveDC(actor, saveDC) {
  if (!actor) return null;

  const rollData = actor.getRollData();
  const terms = [];

  if (saveDC?.type === 'spellcasting') {
    terms.push(actor.system.attributes.spellDC);
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
