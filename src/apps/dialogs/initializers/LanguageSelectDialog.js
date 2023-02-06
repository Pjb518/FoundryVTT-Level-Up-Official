import TraitSelectDialog from './TraitSelectDialog';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class LanguageSelectDialog extends TraitSelectDialog {
  /**
   * @param {string} name The name of the parent item or actor to include in the dialog window.
   * @param {*} options See TraitSelectDialog options
   */
  constructor(name, options) {
    super(
      game.i18n.format('A5E.LanguagesConfigurationPrompt', { name }),
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
   * @param {string} name The name of the parent item or actor to include in the dialog window.
   * @param {[string]]} knownLanguage A list of languages the character already knows. Users can't
   *                                  change these.
   * @param {[string]} defaultSelections A list of recommended languages. Users may change these.
   * @param {number=0} additional The number of additional languages the user can select.
   * @return Returns the new list of languages or the character's currently known languages if user
   * doesn't submit their choices.
   */
  static async createRecommendLanguages(
    name,
    knownLanguages,
    defaultSelections,
    additional = 0
  ) {
    // Remove duplicates
    const selected = [...new Set([...knownLanguages, ...defaultSelections])];

    const dialog = new LanguageSelectDialog(
      name,
      {
        selected,
        disabled: knownLanguages,
        selectionLimit: knownLanguages.length + defaultSelections.length + additional
      }
    );

    dialog.render(true);

    // If the dialog is closed without user submitting their choices, return knownLanguages.
    return (await dialog.promise) ?? knownLanguages;
  }
}
