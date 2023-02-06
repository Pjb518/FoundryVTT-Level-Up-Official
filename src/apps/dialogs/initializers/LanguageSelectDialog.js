import TraitSelectDialog from './TraitSelectDialog';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class LanguageSelectDialog extends TraitSelectDialog {
  /**
   * @param {string} titleName Name to include in the title
   * @param {*} options See TraitSelectDialog options
   */
  constructor(titleName, options) {
    super(
      game.i18n.format('A5E.LanguagesConfigurationPrompt', titleName),
      [{
        label: 'A5E.Languages',
        traits: CONFIG.A5E.languages
      },
      {
        label: 'Other Languages'
      }],
      options
    );
  }

  /**
   * @param {string} Name to include in the title
   * @param {[string]]} known List of known languages, users can not change these.
   * @param {[string]} recommended List of recommended languages, users may change these.
   * @param {number=0} additional
   * @return Returns the new list of languages, or `known` if user doesn't submit their choices
   */
  static async createRecommendLanguages(titleName, known, recommended, additional = 0) {
    // Remove duplicates
    const selected = [...new Set([...known, ...recommended])];

    const dialog = new LanguageSelectDialog(
      titleName,
      {
        selected,
        disabled: known,
        selectionLimit: known.length + recommended.length + additional
      }
    );
    dialog.render(true);

    // If the dialog is closed without user submitting their choices, return known.
    return (await dialog.promise) ?? known;
  }
}
