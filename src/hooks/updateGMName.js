export default function updateGMName() {
  const defaultName = 'Narrator';

  game.i18n.translations.USER.GM = defaultName;
  game.i18n.translations.GM = defaultName;
}
