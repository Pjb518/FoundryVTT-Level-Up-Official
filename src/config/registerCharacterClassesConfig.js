export default function registerCharacterClassesConfig(A5E) {
  A5E.spellcastingCharacterClasses = {
    artificer: 'A5E.characterClasses.artificer',
    bard: 'A5E.characterClasses.bard',
    cleric: 'A5E.characterClasses.cleric',
    druid: 'A5E.characterClasses.druid',
    // elementalist: 'A5E.characterClasses.elementalist',
    herald: 'A5E.characterClasses.herald',
    sorcerer: 'A5E.characterClasses.sorcerer',
    warlock: 'A5E.characterClasses.warlock',
    // wielder: 'A5E.characterClasses.wielder',
    witch: 'A5E.characterClasses.witch',
    wizard: 'A5E.characterClasses.wizard'
  };

  A5E.characterClasses = {
    ...A5E.spellcastingCharacterClasses,
    adept: 'A5E.characterClasses.adept',
    berserker: 'A5E.characterClasses.berserker',
    esper: 'A5E.characterClasses.esper',
    fighter: 'A5E.characterClasses.fighter',
    marshal: 'A5E.characterClasses.marshal',
    ranger: 'A5E.characterClasses.ranger',
    rogue: 'A5E.characterClasses.rogue',
    savant: 'A5E.characterClasses.savant',
    scholar: 'A5E.characterClasses.scholar'
  };
}
