export default function isCustomLanguage(language) {
  return !Object.hasOwn(CONFIG.A5E.languages, language);
}
