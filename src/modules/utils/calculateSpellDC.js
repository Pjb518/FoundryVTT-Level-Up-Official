import getDeterministicBonus from '../dice/getDeterministicBonus';

export default function calculateSpellDC(actorData) {
  const { abilities, attributes, bonuses } = actorData.data;
  const spellcastingAbility = attributes.spellcasting || 'int';

  return getDeterministicBonus(
    8
    + attributes.prof
    + (parseInt(bonuses?.spell?.dc, 10) || 0)
    + abilities[spellcastingAbility].check.mod
  );
}
