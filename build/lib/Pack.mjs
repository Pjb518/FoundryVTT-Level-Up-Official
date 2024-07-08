/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

// eslint-disable-next-line import/no-extraneous-dependencies
import { globSync } from 'glob';
// eslint-disable-next-line import/extensions
import LevelDatabase from './LevelDB.mjs';

export default class Pack {
  static #PACK_DEST = path.resolve(process.cwd(), 'public/packs');

  static #packsMetadata = JSON.parse(fs.readFileSync('public/system.json', 'utf-8')).packs;

  constructor(dirName, data) {
    const metadata = Pack.#packsMetadata
      .find((p) => path.basename(p.path).split('.')[0] === path.basename(dirName));

    if (!metadata) throw Error(`Pack ${dirName} isn't setup in system.json.`);

    this.systemId = metadata.system;
    this.packId = metadata.name;
    this.documentType = metadata.type;

    this.dirPath = dirName;
    this.dirName = path.basename(dirName);
    this.data = data;

    // TODO: Clean and validate data
  }

  clean() { }

  async saveAsPack() {
    if (!fs.lstatSync(Pack.#PACK_DEST, { throwIfNoEntry: false })?.isDirectory()) {
      fs.mkdirSync(Pack.#PACK_DEST);
    }

    const outDir = path.join(Pack.#PACK_DEST, this.dirName);
    console.log(outDir);

    if (fs.lstatSync(outDir, { throwIfNoEntry: false })?.isDirectory()) {
      fs.rmSync(outDir, { recursive: true });
    }

    const db = new LevelDatabase(outDir, { packName: this.dirName });
    await db.createPack(this.data);

    return this.data.length;
  }

  saveAsJSON() { }

  validate() { }

  static loadJSONFiles(dirPath) {
    const filenames = globSync(`${dirPath}/**/*.json`);
    const files = [];

    for (const file of filenames) {
      let jsonData;

      try {
        jsonData = JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }).toString());
      } catch (err) {
        console.error(err);
        console.warn(`[ERROR] - ${file} failed to parse.`);
        continue;
      }

      if (!jsonData) continue;

      files.push(jsonData);
    }

    return new Pack(dirPath, files);
  }
}
