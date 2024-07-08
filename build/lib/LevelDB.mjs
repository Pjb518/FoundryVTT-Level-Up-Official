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

    this.#dbKey = dbKey;
    this.#embeddedKeys = embeddedKeys ?? [];

    this.#documentDb = this.sublevel(dbKey, dbOptions);

    if (this.#embeddedKeys.length) {
      this.#embeddedDbs = this.#embeddedKeys
        .map((key) => ({
          key,
          db: this.sublevel(`${this.#dbKey}.${key}`, dbOptions)
        }));
    }
  }

  #getDBKeys(packName) {
    const metadata = systemJSON.packs
      .find((p) => path.basename(p.path).split('.')[0] === packName);

    if (!metadata) throw Error(`Pack ${packName} isn't setup in system.json.`);

    let dbKey = null;
    if (metadata.type === 'JournalEntry') dbKey = 'journal';
    else if (metadata.type === 'RollTable') dbKey = 'tables';
    else dbKey = `${metadata.type.toLowerCase()}s`;

    let embeddedKeys = [];
    if (dbKey === 'actors') embeddedKeys = ['effects', 'items'];
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
          const embeddedDocs = source[key];

          if ((Array.isArray(embeddedDocs))) {
            for (let i = 0; i < embeddedDocs.length; i += 1) {
              const doc = embeddedDocs[i];
              if (embeddedBatches[key]) {
                embeddedBatches[key].put(`${source._id}.${doc._id}`, doc);
                if (!doc._id) console.log(`${doc.name}`);
                embeddedDocs[i] = doc._id ?? '';
              }
            }
          }
        });
      }
      docBatch.put(source._id ?? '', source);
    }

    await docBatch.write();

    for await (const [key, batch] of Object.entries(embeddedBatches)) {
      console.log(key, batch.length);
      if (batch.length) await batch.write();
    }

    await this.close();
  }
}
