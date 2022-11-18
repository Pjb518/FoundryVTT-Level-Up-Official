export default function localizeLanguage(language) {
  return game.i18n.localize(CONFIG.A5E.languages[language] ?? language);
}
