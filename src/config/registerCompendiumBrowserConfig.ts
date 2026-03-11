export function registerCompendiumBrowserConfig() {
  const itemsListConfig = {
    archetype: "Archetypes",
    background: "Backgrounds",
    class: "Classes",
    destiny: "Destinies",
    feature: "Features",
    heritage: "Heritages",
    maneuver: "Maneuvers",
    npc: "Monsters",
    object: "Objects",
    spell: "Spells",
  };

  const groups = {
    object: "rarity",
    maneuver: "degree",
    monster: "details.cr",
    spell: "level",
  };

  const groupFilterBy = {
    object: [
      "mundane",
      "common",
      "uncommon",
      "rare",
      "very rare",
      "legendary",
      "artifact",
    ],
    maneuver: [0, 1, 2, 3, 4, 5],
    monster: [
      0,
      0.125,
      0.25,
      0.5,
      ...Array.from(Array(30).keys(), (n) => n + 1),
    ],
    spell: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  };
  return {};
}
