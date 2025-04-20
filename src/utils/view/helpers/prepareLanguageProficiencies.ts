export function prepareLanguageProficiencies(data: any): string[] {
  const languageProficiencies = data.system.proficiencies.languages.map(
    (language) =>
      game.i18n.localize(CONFIG.A5E.languages[language]) ?? language,
  );

  languageProficiencies.sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase()),
  );
  return languageProficiencies;
}
