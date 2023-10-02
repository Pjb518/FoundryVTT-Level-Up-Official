export default function registerActiveEffectConfig(A5E) {
  A5E.ACTIVE_EFFECT_MODES = {
    CUSTOM: 0,
    MULTIPLY: 1,
    ADD: 2,
    SUBTRACT: 3,
    DOWNGRADE: 4,
    UPGRADE: 5,
    OVERRIDE: 6,
    CONDITIONAL: 7
  };

  A5E.activeEffectTypes = {
    onUse: 'A5E.effects.types.plural.onUse',
    ongoing: 'A5E.effects.types.plural.ongoing',
    inactive: 'A5E.effects.types.plural.inactive',
    passive: 'A5E.effects.types.plural.passive',
    permanent: 'A5E.effects.types.plural.permanent',
    temporary: 'A5E.effects.types.plural.temporary'
  };

  A5E.conditionDescriptions = {
    blinded: '<ul><li>A blinded creature can\'t see and it automatically fails ability checks that require sight.</li><li>Attack rolls against a blinded creature are made with advantage, and the creature\'s attack rolls are made with disadvantage.</li></ul>',
    bloodied: '<ul><li>A creature is bloodied when reduced to half its hit points or less.</li></ul>',
    charmed: '<ul><li>A charmed creature can\'t take any hostile action against the charmer.</li><li>Ability checks the charmer makes to socially interact with the charmed creature have advantage.</li></ul>',
    concentration: '<p>A spellcaster\'s concentration can be ended by any of the following:</p><ul><li>The spellcaster chooses to end concentration at any time.</li><li>The spellcaster is incapacitated or killed.</li><li>The spellcaster successfully casts another spell that requires concentration.</li><li>The GM may rule that a sudden interruption, such as a push, may force the spellcaster to make a DC 10 Constitution check. On a failure, the spell ends.</li><li>If the spellcaster takes damage while concentrating on a spell, they must make a Constitution saving throw; on a failure, the spell ends.The DC is 10 or half the damage taken, whichever is higher.</li></ul>',
    confused: '<ul><li>A confused creature can\'t take reactions.</li><li>On its turn a confused creature rolls a d8 to determine what it does.</li><ul><li>On a 1 to 4, a confused creature does nothing.</li><li>On a 5 or 6, a confused creature takes no action or bonus action and uses all its movement to move in a randomly determined direction.</li><li>On a 7 or 8, a confused creature makes a melee attack against a randomly determined creature within its reach or does nothing if it can\'t make such an attack.</li></ul ></ul >',
    deafened: '<ul><li>A deafened creature can\'t hear and automatically fails ability checks that require hearing.</li></ul>',
    doomed: '<ul><li>A doomed creature dies at a time determined by the Narrator, or within 13 (2d12) hours.</li><li>A doomed creature continues to be doomed even after it dies. Magic equivalent to a 7th-level or higher spell can remove the doomed condition (such as regenerate cast on a living creature, resurrection, true resurrection, or wish).</li></ul >',
    encumbered: '<ul><li>An encumbered creature\'s Speed is reduced to 5 ft.</li></ul>',
    frightened: '<ul><li>A frightened creature has disadvantage on ability checks and attack rolls while it is able to see the source of its fear.</li><li>A frightened creature can\'t willingly move closer to the source of its fear.</li></ul>',
    grappled: '<ul><li>A grappled creature\'s Speed becomes 0, and it can\'t benefit from bonuses to movement speeds.</li><li>If the grappler becomes incapacitated the condition ends.</li><li>If an effect removes the grappled creature from the reach of the grappler or grappling effect (such as when a creature is shoved away by the Doubleteam combat maneuver) the condition ends.</li></ul>',
    incapacitated: '<ul><li>An incapacitated creature can\'t take actions, bonus actions, or reactions.</li></ul>',
    invisible: '<ul><li>An invisible creature is impossible to see without the aid of magic or a special sense (it gains no benefits from this condition against creatures still able to see it).</li><li>An invisible creature is heavily obscured for the purpose of hiding.</li><li>An invisible creature\'s location can be detected by noises it makes or tracks it leaves.</li><li>Attack rolls against an invisible creature are made with disadvantage.</li><li>An invisible creature makes attack rolls with advantage.</li></ul>',
    paralyzed: '<ul><li>A paralyzed creature is incapacitated and can\'t move or speak.</li><li>A paralyzed creature automatically fails Strength and Dexterity saving throws.</li><li>Attack rolls against a paralyzed creature have advantage.</li><li>Any attack that hits a paralyzed creature is a critical hit if the attacker is within 5 feet.</li></ul>',
    petrified: '<ul><li>A petrified creature (and all of its mundane possessions) is transformed into a solid inanimate substance (usually stone).</li><li>A petrified creature\'s weight is increased by a factor of ten and it ceases aging.</li><li>A petrified creature is incapacitated, can\'t move or speak, and is unaware of its surroundings.</li><li>A petrified creature automatically fails Strength and Dexterity saving throws.</li><li>A petrified creature has resistance to all damage.</li><li>A petrified creature is immune to poison and disease (time spent petrified does not affect the duration of a poison or disease already in its system).</li></ul>',
    poisoned: '<ul><li>A poisoned creature has disadvantage on attack rolls and ability checks.</li></ul>',
    prone: '<ul><li>A prone creature\'s only movement option is to crawl (every 1 foot of movement while crawling costs 1 extra foot) until it stands up.</li><li>Standing up requires half a creature\'s movement.</li><li>A prone creature makes melee attack rolls with disadvantage.</li><li>An attack roll against a prone creature is made with advantage if the attacker is within 5 feet. Otherwise, the attack roll is made with disadvantage.</li></ul>',
    rattled: '<ul><li>A rattled creature cannot benefit from expertise dice.</li><li>A creature that is immune to being stunned is immune to being rattled.</li><li>A rattled creature cannot take reactions.</li></ul>',
    restrained: '<ul><li>A restrained creature\'s Speed becomes 0, and it can\'t benefit from bonuses to speed.</li><li>Attack rolls against a restrained creature are made with advantage.</li><li>A restrained creature makes attack rolls with disadvantage.</li><li>The restrained creature has disadvantage on Dexterity saving throws.</li></ul>',
    slowed: '<ul><li>A slowed creature\'s Speed is halved.</li><li>A slowed creature takes a −2 penalty to AC and Dexterity saving throws.</li><li>A slowed creature cannot take reactions.</li><li>On its turn, a slowed creature can take either an action or a bonus action, not both. In addition, it can\'t make more than one melee or ranged attack during its turn.</li></ul>',
    stunned: '<ul><li>A stunned creature is incapacitated (see the condition), can\'t move, and can speak only falteringly.</li><li>The creature automatically fails Strength and Dexterity saving throws.</li><li>Attack rolls against the creature have advantage.</li><li>A creature that is immune to being stunned is immune to being rattled.</li></ul>',
    unconscious: '<ul><li>An unconscious creature is incapacitated, can\'t move or speak, and is unaware of its surroundings.</li><li>An unconscious creature drops whatever it\'s holding and falls prone.</li><li>An unconscious creature automatically fails Strength and Dexterity saving throws.</li><li>Attack rolls against an unconscious creature are made with advantage.</li><li>Any attack that hits an unconscious creature is a critical hit if the attacker is within 5 feet.</li></ul>'
  };

  // TODO: Allow people to replace these with settings
  A5E.conditionIcons = {
    blinded: 'icons/svg/blind.svg',
    bloodied: 'icons/svg/blood.svg',
    charmed: 'systems/a5e/assets/icons/charmed.svg',
    concentration: 'systems/a5e/assets/icons/concentration.svg',
    confused: 'systems/a5e/assets/icons/confused.svg',
    deafened: 'icons/svg/deaf.svg',
    dead: 'icons/svg/skull.svg',
    doomed: 'systems/a5e/assets/icons/doomed.svg',
    encumbered: 'systems/a5e/assets/icons/encumbered.svg',
    fatigue: 'systems/a5e/assets/icons/fatigue.svg',
    frightened: 'icons/svg/terror.svg',
    grappled: 'systems/a5e/assets/icons/grappled.svg',
    incapacitated: 'systems/a5e/assets/icons/incapacitated.svg',
    invisible: 'icons/svg/invisible.svg',
    paralyzed: 'icons/svg/paralysis.svg',
    petrified: 'systems/a5e/assets/icons/petrified.svg',
    poisoned: 'icons/svg/poison.svg',
    prone: 'icons/svg/falling.svg',
    rattled: 'systems/a5e/assets/icons/rattled.svg',
    restrained: 'icons/svg/net.svg',
    slowed: 'systems/a5e/assets/icons/slowed.svg',
    strife: 'systems/a5e/assets/icons/strife.svg',
    stunned: 'icons/svg/daze.svg',
    unconscious: 'icons/svg/unconscious.svg'
  };

  A5E.itemActiveEffectTypes = {
    onUse: 'A5E.effects.types.singular.onUse',
    passive: 'A5E.effects.types.singular.passive',
    permanent: 'A5E.effects.types.singular.permanent'
  };

  A5E.itemActiveEffectTypesPlural = {
    onUse: 'A5E.effects.types.plural.onUse',
    passive: 'A5E.effects.types.plural.passive',
    permanent: 'A5E.effects.types.plural.permanent'
  };

  A5E.effectDurationTypes = {
    seconds: 'A5E.effects.durationTypes.plural.seconds',
    rounds: 'A5E.effects.durationTypes.plural.roundsAndTurns'
  };

  A5E.effectDurationUnits = {
    seconds: 'A5E.effects.durationUnits.plural.seconds',
    minutes: 'A5E.effects.durationUnits.plural.minutes',
    hours: 'A5E.effects.durationUnits.plural.hours'
  };
}
