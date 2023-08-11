export default function registerActiveEffectConfig(A5E) {
  A5E.activeEffectTypes = {
    onUse: 'A5E.effects.types.plural.onUse',
    ongoing: 'A5E.effects.types.plural.ongoing',
    inactive: 'A5E.effects.types.plural.inactive',
    passive: 'A5E.effects.types.plural.passive',
    permanent: 'A5E.effects.types.plural.permanent',
    temporary: 'A5E.effects.types.plural.temporary'
  };

  // TODO: Allow people to replace these with settings
  A5E.ConditionIcons = {
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
}
