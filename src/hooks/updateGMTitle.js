export default function updateGMTitle() {
  const name = game.settings.get('a5e', 'gamemasterTitle') || 'Narrator';

  game.i18n.translations.USER.GM = name;
  game.i18n.translations.GM = name;
}
