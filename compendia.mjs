/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */

import * as fs from 'fs';
import path from 'path';
import glob from 'glob';

const PACK_DEST = './public/packs';
const PACK_SRC = './packs';
const IDS_FILE_PATH = './packs/ids.json';
const ids = new Set();

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * Generates a random id for a document
 * @param {Number} length
 * @returns {String} id
 */
export function randomID(length = 16) {
  const rnd = () => Math.random().toString(36).substring(2);
  let id = '';
  while (id.length < length) { id += rnd(); }
  return id.substring(0, length);
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
function cleanDocument(document, { clearSourceId = false } = {}) {
  // Remove Flag data
  if (clearSourceId) delete document.flags?.core?.sourceId;
  delete document.flags?.exportSource;
  delete document.flags?.importSource;
  delete document._stats;
  delete document.system?._stats;

  if (!document.flags) document.flags = {};
  Object.entries(document.flags).forEach(([flag, flagData]) => {
    if (!['core', 'a5e'].includes(flag)) {
      delete document.flags[flag];
      return;
    }
    if (Object.keys(flagData).length === 0) delete document.flags[flag];
  });

  // Remove Permission information
  if (document.ownership) document.ownership = { default: 0 };

  // Recurse for subDocuments
  if (document.effects) document.effects.forEach((doc) => cleanDocument(doc));
  if (document.items) document.effects.forEach((doc) => cleanDocument(doc));
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * Populates the internal id records with all existing ids to prevent duplicate ids
 */
function getExistingIds() {
  console.info('[INFO] - Extracting existing ids...');

  const folders = fs.readdirSync(PACK_SRC, { withFileTypes: true })
    .filter((f) => f.isDirectory());

  folders.forEach((folder) => {
    const filePath = path.join(PACK_DEST, `${folder.name}.db`);
    fs.rmSync(filePath, { force: true });

    const filenames = glob.sync(`${PACK_SRC}/${folder.name}/**/*.json`);

    filenames.forEach((file) => {
      const json = JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }).toString());
      if (json._id) { ids.add(json._id); }
    });
  });

  console.info(`[INFO] - Extracted ${ids.size} existing ids.\n`);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * Save ids for compendia
 */
export function saveIds() {
  console.info('[INFO] - Running Save IDs...');

  let numAdds = 0;

  // Load saved ids.
  const savedIdData = JSON.parse(
    fs.readFileSync(IDS_FILE_PATH, { encoding: 'utf-8' }).toString()
  );

  // Iterate over each folder getting every json file
  const folders = fs.readdirSync(PACK_SRC, { withFileTypes: true })
    .filter((f) => f.isDirectory());

  folders.forEach((folder) => {
    const filePath = path.join(PACK_DEST, `${folder.name}.db`);
    fs.rmSync(filePath, { force: true });

    const filenames = glob.sync(`${PACK_SRC}/${folder.name}/**/*.json`);

    // Iterate over each json file getting their ids
    filenames.forEach((file) => {
      try {
        const jsonData = JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }).toString());
        const currentId = jsonData._id;

        if (!currentId) return;

        const filename = path.parse(file).name;
        const savedId = savedIdData[folder.name][filename];

        if (currentId === savedId) return;

        savedIdData[folder.name][filename] = currentId;
        numAdds += 1;
      } catch (e) {
        console.warn(`[ERROR] - ${file} failed to parse.`);
      }
    });
  });

  // Update saved file data
  console.info('[WARN] - Updated saved ids data - Please check.');
  fs.writeFileSync(IDS_FILE_PATH, JSON.stringify(savedIdData, null, '\t'), { encoding: 'utf-8' });

  // Info Log
  console.info(`[INFO] - Changed/Saved ${numAdds} ids.\n`);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * Fix ids for compendia
 */
export function fixIds() {
  console.info('[INFO] - Running Fix IDs ...');

  let numNewIds = 0;
  let numChangedIds = 0;

  // Load saved ids.
  const savedIdData = JSON.parse(
    fs.readFileSync(IDS_FILE_PATH, { encoding: 'utf-8' }).toString()
  );

  // Add ids to existing id map
  Object.values(savedIdData)
    .flatMap((obj) => Object.values(obj))
    .forEach((id) => ids.add(id));

  // Iterate over each folder getting every json file
  const folders = fs.readdirSync(PACK_SRC, { withFileTypes: true })
    .filter((f) => f.isDirectory());

  folders.forEach((folder) => {
    const filePath = path.join(PACK_DEST, `${folder.name}.db`);
    fs.rmSync(filePath, { force: true });

    const filenames = glob.sync(`${PACK_SRC}/${folder.name}/**/*.json`);

    // Iterate over each json file getting their ids
    filenames.forEach((file) => {
      try {
        const jsonData = JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }).toString());
        const currentId = jsonData._id;

        // If current id doesn't exist generate one.
        if (!currentId) {
          jsonData._id = generateId();
          numNewIds += 1;

          // Edit original file with new Id.
          fs.writeFileSync(file, JSON.stringify(jsonData, null, '\t'), { encoding: 'utf-8' });
          return;
        }

        const filename = path.parse(file).name;
        const savedId = savedIdData[folder.name][filename];

        // If savedId does not exist generate one and save it.
        if (!savedId) {
          const newId = generateId();
          jsonData._id = newId;
          numNewIds += 1;

          // Update savedId data
          savedIdData[folder.name][filename] = newId;

          // Edit original file with new Id.
          fs.writeFileSync(file, JSON.stringify(jsonData, null, '\t'), { encoding: 'utf-8' });
          return;
        }

        if (currentId !== savedId) {
          jsonData._id = savedId;
          numChangedIds += 1;

          // Edit original file with saved id
          fs.writeFileSync(file, JSON.stringify(jsonData, null, '\t'), { encoding: 'utf-8' });
        }
      } catch (e) {
        console.warn(`[ERROR] - ${file} failed to parse.`);
      }
    });
  });

  // Update saved file data
  console.info('Updated saved ids data - Please check.');
  fs.writeFileSync(IDS_FILE_PATH, JSON.stringify(savedIdData, null, '\t'), { encoding: 'utf-8' });

  // Info Log
  console.info(`[INFO] - Generated ${numNewIds} ids.`);
  console.info(`[INFO] - Fixed ${numChangedIds} ids.\n`);
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * Compile json packs into a database entry
 * @returns
 */
export function compilePacks() {
  let numNewIds = 0;
  let numMappedIds = 0;

  const folders = fs.readdirSync(PACK_SRC, { withFileTypes: true })
    .filter((f) => f.isDirectory());

  // Get existing ids
  getExistingIds();

  // Iterate over each folder and get files.
  folders.forEach((folder) => {
    const filePath = path.join(PACK_DEST, `${folder.name}.db`);
    fs.rmSync(filePath, { force: true });

    const db = fs.createWriteStream(filePath, { flags: 'a', mode: 0o664 });
    const data = [];

    const filenames = glob.sync(`${PACK_SRC}/${folder.name}/**/*.json`);

    // Iterate over each json file in the folder.
    filenames.forEach((file) => {
      try {
        const jsonData = JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }).toString());

        if (!jsonData._id) {
          const sourceId = jsonData.flags?.core?.sourceId;
          const prevId = sourceId ? sourceId.split('.').pop().slice() : null;
          const newId = prevId && !ids.has(prevId) ? prevId : generateId();
          jsonData._id = newId;

          // Clear source ID if isn't unique
          if (newId === prevId) {
            cleanDocument(jsonData);
            numMappedIds += 1;
          } else {
            cleanDocument(jsonData, { clearSourceId: true });
            numNewIds += 1;
          }

          // Edit original file with id and cleaned data
          fs.writeFileSync(file, JSON.stringify(jsonData, null, '\t'), { encoding: 'utf-8' });
        } else {
          cleanDocument(jsonData);
        }

        // Adds to creation data
        data.push(jsonData);
      } catch (e) {
        console.warn(`[ERROR] - ${file} failed to parse.`);
      }
    });

    // Sort and write to files
    data.sort((lhs, rhs) => (lhs.name > rhs.name ? -1 : 1));
    data.forEach((entry) => {
      db.write(`${JSON.stringify(entry)}\n`);
    });

    console.info(`[INFO] - Created ${folder.name}.db with ${data.length} entries.`);
  });

  // Info Log
  console.info(`\n[INFO] - Generated ${numNewIds} new ids.`);
  console.info(`[INFO] - Mapped ${numMappedIds} ids from sourceId to _id.\n`);
}
