import path from 'path';

// eslint-disable-next-line import/no-extraneous-dependencies
import { ClassicLevel } from 'classic-level';
// eslint-disable-next-line import/extensions
import systemJSON from '../../public/system.json' with { type: 'json'};

export default class LevelDatabase extends ClassicLevel {
  #dbKey;

  #embeddedKeys;

  #documentDb;

  #embeddedDbs;

  constructor(location, options) {
    const dbOptions = options.dbOptions ?? { keyEncoding: 'utf8', valueEncoding: 'json' };
    super(location, dbOptions);

    const { dbKey, embeddedKeys } = this.#getDBKeys(options.packName);

    this.dbOptions = dbOptions;
    this.#dbKey = dbKey;
    this.#embeddedKeys = embeddedKeys ?? [];

    this.#documentDb = this.sublevel(dbKey, dbOptions);

    if (this.#embeddedKeys.length) {
      this.#embeddedDbs = this.#embeddedKeys.map((key) => ({
        key: key.replaceAll('.', '-'),
        db: this.sublevel(`${this.#dbKey}.${key}`, dbOptions)
      }));
    }
  }

  #getDBKeys(packName) {
    const metadata = systemJSON.packs
      .find((p) => path.basename(p.path).split('.')[0] === packName);

    if (!metadata) throw Error(`[ERROR] - Pack ${packName} isn't setup in system.json.`);

    let dbKey = null;
    if (metadata.type === 'JournalEntry') dbKey = 'journal';
    else if (metadata.type === 'RollTable') dbKey = 'tables';
    else dbKey = `${metadata.type.toLowerCase()}s`;

    let embeddedKeys = [];
    if (dbKey === 'actors') embeddedKeys = ['effects', 'items', 'items.effects'];
    if (dbKey === 'items') embeddedKeys = ['effects'];
    else if (dbKey === 'journal') embeddedKeys = ['pages'];
    else if (dbKey === 'tables') embeddedKeys = ['results'];

    return { dbKey, embeddedKeys };
  }

  async createPack(docs) {
    const docBatch = this.#documentDb.batch();
    const embeddedBatches = this.#embeddedDbs.reduce((acc, { key, db }) => {
      acc[key] = db.batch();
      return acc;
    }, {});

    for (const source of docs) {
      if (this.#embeddedKeys.length) {
        this.#embeddedKeys.forEach((key) => {
          if (key === 'items.effects') return; // TODO:: Make this generic
          if (this.#dbKey === 'actors' && key === 'items') {
            const items = source[key];

            // Do effects
            for (const item of items) {
              const { effects } = item;
              this.#addDataToBatch(effects, embeddedBatches['items-effects'], `${source._id}.${item._id}`);
            }

            // Do items
            this.#addDataToBatch(items, embeddedBatches[key], source._id);
          } else {
            const embeddedDocs = source[key];
            this.#addDataToBatch(embeddedDocs, embeddedBatches[key], source._id);
          }
        });
      }
      docBatch.put(source._id ?? '', source);
    }

    await docBatch.write();
    for await (const batch of Object.values(embeddedBatches)) {
      if (batch.length) await batch.write();
    }

    await this.close();
  }

  #addDataToBatch(embeddedDocs, batch, sourceId) {
    if (Array.isArray(embeddedDocs)) {
      for (let i = 0; i < embeddedDocs.length; i += 1) {
        const doc = embeddedDocs[i];
        if (batch) {
          batch.put(`${sourceId}.${doc._id}`, doc);
          embeddedDocs[i] = doc._id ?? '';
        }
      }
    }
  }
}
