export function isCustomLanguage(name) {
  return !Object.prototype.hasOwnProperty.call(CONFIG.A5E.languages, name);
}

export function localizeLanguage(name) {
  if (isCustomLanguage(name)) {
    return name;
  }

  return game.i18n.localize(CONFIG.A5E.languages[name]);
}
