export default function registerActiveEffectConfig(A5E) {
  A5E.activeEffectTypes = {
    onUse: 'A5E.effects.types.plural.onUse',
    ongoing: 'A5E.effects.types.plural.ongoing',
    inactive: 'A5E.effects.types.plural.inactive',
    passive: 'A5E.effects.types.plural.passive',
    permanent: 'A5E.effects.types.plural.permanent',
    temporary: 'A5E.effects.types.plural.temporary'
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
