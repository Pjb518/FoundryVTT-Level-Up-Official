export default function prepareManeuverTraditions(actor) {
  if (actor.type !== 'character') return [];

  const traditions = (actor.system.proficiencies.traditions ?? []).map((tradition) => (
    game.i18n.localize(CONFIG.A5E.maneuverTraditions[tradition]) ?? tradition));

  traditions.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  return traditions;
}
