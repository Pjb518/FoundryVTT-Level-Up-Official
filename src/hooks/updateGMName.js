export default function updateGMName() {
  const name = game.settings.get('a5e', 'gamemasterName') || 'Narrator';

  game.i18n.translations.USER.GM = name;
  game.i18n.translations.GM = name;
}
