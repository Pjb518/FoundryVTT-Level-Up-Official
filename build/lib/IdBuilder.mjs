/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';
import { globSync } from 'glob';
import { getProperty, setProperty } from '../helpers.mjs';

export default class IdBuilder {
  constructor() {
    this.ids = {
      Actor: new Set(),
      Item: new Set(),
      Journal: new Set(),
      RollTable: new Set()
    };

    this.mappedIds = 0;
    this.generatedIds = 0;
  }

  get summary() {
    return `Generated ${this.generatedIds} ids and fixed ${this.mappedIds} ids.`;
  }

  loadIds() {
    const dirName = fileURLToPath(new URL('.', import.meta.url));
    const dataPath = path.resolve(dirName, '../../packs');
    const dirPaths = fs.readdirSync(dataPath).map((p) => path.resolve(dirName, dataPath, p));

    const savedIdsPath = path.resolve(dirName, '../../packs/ids.json');
    const savedIdData = JSON.parse(
      fs.readFileSync(savedIdsPath, { encoding: 'utf-8' }).toString()
    );

    dirPaths.forEach((folder) => {
      if (folder.endsWith('json')) return;

      const fileNames = globSync(`${folder}//**/*.json`);

      for (const file of fileNames) {
        let jsonData;

        try {
          jsonData = JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }).toString());
        } catch (err) {
          console.error(err);
          console.warn(`[ERROR] - ${file} failed to parse.`);
          continue;
        }

        if (!jsonData) continue;

        const originalId = jsonData._id;

        const docType = IdBuilder.documentType(jsonData);
        if (!docType) {
          console.warn(`[ERROR] - ${file} doesn't have a valid type.`);
          continue;
        }

        if (!originalId) {
          let id;

          const idPath = IdBuilder.getIdKey(file);
          const existingId = getProperty(savedIdData, idPath);

          if (existingId) {
            id = existingId;
            this.mappedIds += 1;
          } else {
            id = this.generateId(docType);
            this.generatedIds += 1;

            // Update save data
            setProperty(savedIdData, idPath, id);
          }

          // Update file
          jsonData._id = id;
          fs.writeFileSync(
            file,
            JSON.stringify(jsonData, null, '\t'),
            { encoding: 'utf-8' }
          );

          this.ids[docType].add(id);
        } else {
          this.ids[docType].add(originalId);
        }

        // This is for creating the ids file
        // const idPath = IdBuilder.getIdKey(file);
        // setProperty(savedIdData, idPath, jsonData._id);
        // this.generatedIds += 1;
      }
    });

    // Update ids.json
    if (this.generatedIds) {
      // TODO: Delete non existent keys

      // Sort ids key
      const replacer = (_, value) => (value instanceof Object && !(value instanceof Array)
        ? Object.keys(value)
          .sort()
          .reduce((sorted, key) => {
            sorted[key] = value[key];
            return sorted;
          }, {})
        : value);

      fs.writeFileSync(
        savedIdsPath,
        JSON.stringify(savedIdData, replacer, '\t'),
        { encoding: 'utf-8' }
      );
    }
  }

  /**
   *
   * @param {*} type
   * @returns {string}
   */
  generateId(type) {
    let id = IdBuilder.randomId();
    while (this.ids[type]?.has(id)) id = IdBuilder.randomId();
    return id;
  }

  /**
   * @param {any} doc
   * @returns { "Actor" | "Item" | "Journal" | "RollTable" | null}
   */
  static documentType(doc) {
    if (IdBuilder.#isActor(doc)) return 'Actor';
    if (IdBuilder.#isItem(doc)) return 'Item';
    if (IdBuilder.#isJournal(doc)) return 'Journal';
    if (IdBuilder.#isRollTable(doc)) return 'RollTable';
    return null;
  }

  /**
   * @param {string} filePath
   * @returns {string}
   */
  static getIdKey(filePath) {
    const parts = filePath.split(path.sep);
    parts.shift();
    parts.push(parts.pop().replace('.json', ''));

    return parts.join('.');
  }

  /**
   * @param {*} length
   * @returns {string}
   */
  static randomId(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const cutoff = 0x100000000 - (0x100000000 % chars.length);
    const random = new Uint32Array(length);
    do {
      crypto.getRandomValues(random);
    } while (random.some((x) => x >= cutoff));
    let id = '';
    for (let i = 0; i < length; i += 1) id += chars[random[i] % chars.length];
    return id;
  }

  /**
   * @param {any} doc
   * @returns {boolean}
   */
  static #isActor(doc) {
    return ('system' in doc && doc.system && 'items' in doc && Array.isArray(doc.items));
  }

  /**
   * @param {any} doc
   * @returns {boolean}
   */
  static #isItem(doc) {
    return (
      'system' in doc && doc.system && !IdBuilder.#isActor(doc) && !('text' in doc)
    );
  }

  /**
   * @param {any} doc
   * @returns {boolean}
   */
  static #isJournal(doc) {
    return 'pages' in doc;
  }

  /**
   * @param {any} doc
   * @returns {boolean}
   */
  static #isRollTable(doc) {
    return 'results' in doc;
  }
}
