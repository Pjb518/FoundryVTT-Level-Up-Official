import MigrationBase from '../MigrationBase';

export default class Migration014SpellBooks extends MigrationBase {
  static version = 0.014;

  async updateActor(actorData: Record<string, any>) {
    const id = foundry.utils.randomID();

    const spellBook = {
      _id: id,
      name: 'New Spell Book',
      default: true,
      img: 'icons/svg/book.svg',

      ability: 'default',
      disableSpellConsumers: false,
      showSpellPoints: false,
      showSpellSlots: true
    };

    actorData['system.spellBooks'] = { [id]: spellBook };

    // Update flags
    actorData['flags.a5e.filters.-=exclusive'] = null;
    actorData['flags.a5e.filters.-=inclusive'] = null;
    foundry.utils.setProperty(actorData, 'flags.a5e.sortMode', {});

    // Update items
    for (const item of actorData.items) {
      if (item.type === 'spell') item.system.spellBook = id;
    }
  }
}
