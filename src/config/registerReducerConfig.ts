export default function registerReducerConfig() {
  return {
    reducerSortMap: {
      feature: {
        legendaryAction: 0,
        naturalWeapon: 1,
        class: 2,
        knack: 3,
        feat: 4,
        followerFeature: 5,
        heritage: 6,
        culture: 7,
        background: 8,
        destiny: 9,
        boon: 10,
        other: 11,
      },
      object: {
        weapon: 0,
        armor: 1,
        shield: 2,
        ammunition: 3,
        container: 4,
        consumable: 5,
        tool: 6,
        jewelry: 7,
        clothing: 8,
        miscellaneous: 9,
      },
    },
  };
}
