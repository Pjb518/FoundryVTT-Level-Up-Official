export default function getLanguageProficiencies(data) {
  const languageProficiencies = data.data.proficiencies.languages.map((language) => (
    game.i18n.localize(CONFIG.A5E.languages[language]) ?? language));

  languageProficiencies.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  return languageProficiencies;
}
