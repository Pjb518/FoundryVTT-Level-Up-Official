export default function getPromptLabel(prompt) {
  if (prompt.label) return prompt.label;

  switch (prompt.type) {
    case 'savingThrow':
      return game.i18n.format('A5E.SavingThrowSpecific', {
        ability: game.i18n.localize(CONFIG.A5E.abilities[prompt.ability])
      });
    case 'abilityCheck':
      return game.i18n.format('A5E.AbilityCheckSpecific', {
        ability: game.i18n.localize(CONFIG.A5E.abilities[prompt.ability])
      });
    case 'skillCheck':
      return game.i18n.format('A5E.SkillCheck', {
        skill: game.i18n.localize(CONFIG.A5E.skills[prompt.skill])
      });
    default:
      return game.i18n.localize('A5E.Other');
  }
}
