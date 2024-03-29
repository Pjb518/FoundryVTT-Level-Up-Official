export default function registerClassesConfig(A5E) {
  A5E.casterTypes = {
    none: 'A5E.None',
    fullCaster: 'A5E.classes.casterTypes.fullCaster',
    halfCaster: 'A5E.classes.casterTypes.halfCaster',
    tertiaryCaster: 'A5E.classes.casterTypes.tertiaryCaster',
    quaternaryCaster: 'A5E.classes.casterTypes.quaternaryCaster',
    artificer: 'A5E.classes.casterTypes.artificer',
    warlock5e: 'A5E.classes.casterTypes.warlock5e',
    warlockA5e: 'A5E.classes.casterTypes.warlockA5e',
    wielder: 'A5E.classes.casterTypes.wielder'
  };

  A5E.casterProgression = {
    fullCaster: 1,
    halfCaster: 2,
    tertiaryCaster: 3,
    quaternaryCaster: 4,
    artificer: 2
  };
}
