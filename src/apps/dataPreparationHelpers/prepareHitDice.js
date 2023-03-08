export default function prepareHitDice(actor) {
  const actorType = actor.type;
  const hitDice = ['d6', 'd8', 'd10', 'd12'];

  if (actorType === 'npc') {
    hitDice.unshift('d4');
    hitDice.push('d20');
  }

  return hitDice.map((hd) => ({
    die: hd,
    dieSize: hd,
    current: actor.system.attributes.hitDice[hd].current,
    total: actor.system.attributes.hitDice[hd].total
  }));
}
