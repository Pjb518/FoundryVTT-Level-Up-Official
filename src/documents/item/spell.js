import ItemA5e from './item';

export default class SpellItemA5e extends ItemA5e {
  get spellBook() {
    return this.system.spellBook;
  }

  // eslint-disable-next-line consistent-return
  _preCreate(data, options, user) {
    if (!data.system.spellBook && this.parent?.documentName === 'Actor') {
      ui.notifications.error('You must select a spell book to create a spell.');
      return false;
    }

    super._preCreate(data, options, user);
  }
}
