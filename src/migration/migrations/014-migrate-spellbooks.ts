import MigrationBase from '../MigrationBase';

export default class Migration014SpellBooks extends MigrationBase {
  static version = 0.014;

  async updateActor(actorData: Record<string, any>) {
    const id = Object.keys(actorData.system.spellBooks ?? {})?.[0] || foundry.utils.randomID();

    const showSpellPoints = foundry.utils.getProperty(actorData, 'flags.a5e.showSpellPoints') ?? false;
    const showSpellSlots = foundry.utils.getProperty(actorData, 'flags.a5e.showSpellSlots') ?? true;

    const spellBook = {
      _id: id,
      name: 'New Spell Book',
      img: 'icons/svg/book.svg',

      ability: 'default',
      disableSpellConsumers: false,
      showSpellPoints,
      showSpellSlots
    };

    actorData['system.spellBooks'] = { [id]: spellBook };

    // Update flags
    actorData['flags.a5e.filters.-=exclusive'] = null;
    actorData['flags.a5e.filters.-=inclusive'] = null;
    actorData['flags.a5e.-=showSpellPoints'] = null;
    actorData['flags.a5e.-=showSpellSlots'] = null;
    foundry.utils.setProperty(actorData, 'flags.a5e.sortMode', {});

    // Update items
    for (const item of actorData.items) {
      if (item.type === 'spell') item.system.spellBook = id;
    }
  }
}
