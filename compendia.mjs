/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */

// Imports
import * as fs from 'fs';
import path from 'path';
import glob from 'glob';

const PACK_DEST = './public/packs';
const PACK_SRC = './packs';
const ids = new Set();

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * Generates a random id for a document
 * @param {Number} length
 * @returns {String} id
 */
function randomID(length = 16) {
  const rnd = () => Math.random().toString(36).substring(2);
  let id = '';
  while (id.length < length) { id += rnd(); }
  return id.substring(0, length);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function cleanDocument(data, { clearSourceId = false } = { }) {
  // Remove Flag data
  if (clearSourceId) delete data.flags?.core?.sourceId;
  delete data.flags?.exportSource;
  delete data.flags?.importSource;
  delete data?._stats;

  if (!data.flags) data.flags = {};
  Object.entries(data.flags).forEach(([flag, flagData]) => {
    if (!['core', 'a5e'].includes(flag)) {
      delete data.flags[flag];
      return;
    }
    if (Object.keys(flagData).length === 0) delete data.flags[flag];
  });

  // Remove Permission information
  if (data.ownership) data.ownership = { default: 0 };

  // Recurse for subDocuments
  if (data.effects) data.effects.forEach((doc) => cleanDocument(doc));
  if (data.items) data.effects.forEach((doc) => cleanDocument(doc));
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function generateId() {
  // Generate id
  let id = randomID();
  while (ids.has(id)) id = randomID();
  ids.add(id);

  return id;
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * Populates the internal id records with all existing ids to prevent duplicate ids
 */
function getExistingIds(filenames) {
  filenames.forEach((file) => {
    const json = JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' })).toString();
    if (json._id) { ids.add(json._id); }
  });
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * Compile json packs into a database entry
 * @returns
 */
function compilePacks() {
  const folders = fs.readdirSync(PACK_SRC, { withFileTypes: true })
    .filter((f) => f.isDirectory());

  folders.forEach((folder) => {
    const filePath = path.join(PACK_DEST, `${folder.name}.db`);
    fs.rmSync(filePath, { force: true });

    const db = fs.createWriteStream(filePath, { flags: 'a', mode: 0o664 });
    const data = [];

    const filenames = glob.sync(`${PACK_SRC}/${folder.name}/**/*.json`);

    getExistingIds(filenames);

    filenames.forEach((file) => {
      try {
        const json = JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }).toString());
        cleanDocument(json);

        if (!json._id) {
          const genId = generateId();
          json._id = genId;

          // Clear Source ID
          cleanDocument(json, { clearSourceId: true });

          // Edit original file with id and cleaned data
          fs.writeFileSync(file, JSON.stringify(json, null, '\t'), { encoding: 'utf-8' });
        }

        data.push(json);
      } catch (e) {
        console.warn(`${file} failed to parse.`);
      }
    });

    data.sort((lhs, rhs) => (lhs.name > rhs.name ? -1 : 1));
    data.forEach((entry) => {
      db.write(`${JSON.stringify(entry)}\n`);
    });
    console.log(`Created ${filePath} with ${data.length} entries.`);
  });
}

compilePacks();
