// Imports
import * as fs from 'fs';
import path from 'path';
import glob from 'glob';

const PACK_DEST = './public/packs';
const PACK_SRC = './packs';
const ids = [];


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

  if (!data.flags) data.flags = {};
  Object.entries(data.flags).forEach(([flag, flagData]) => {
    if (!['core', 'a5e'].includes(flag)) {
      delete data.flags[flag]
      return;
    }
    if (Object.keys(flagData).length === 0) delete data.flags[flag];
  });

  // FIXME: Remove Later - Old area information
  if (!data?.data.target) data.data.target = {}
  Object.entries(data.data.target).forEach(([property, value]) => {
    if (!['quantity', 'type'].includes(property)) delete data.flags[property];
  });

  // Remove Permission information
  // TODO:Deprecated
  if (data.permission) data.permission = { default: 0 };
  if (data.ownership) data.ownership = { default: 0 };

  // Recurse for subDocuments
  if (data.effects) data.effects.forEach((doc) => cleanDocument(doc));
  if (data.items) data.effects.forEach((doc) => cleanDocument(doc));
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function generateId() {
  // Generate id
  let id = randomID();
  while (ids.includes(id)) id = randomID();
  ids.push(id);

  return id;
}


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * Compile json packs into a database entry
 * @returns
 */
function compilePacks() {
  const folders = fs.readdirSync(PACK_SRC, { withFileTypes: true })
    .filter((f) => f.isDirectory());

  const packs = folders.map((folder) => {
    const filePath = path.join(PACK_DEST, `${folder.name}.db`)
    fs.rmSync(filePath, {force: true});

    const db = fs.createWriteStream(filePath, {flags: 'a', mode: 0o664});
    const data = [];

    const filenames = glob.sync(`${PACK_SRC}/${folder.name}/**/*.json`);

    filenames.forEach((file) => {
      try{
        const json = JSON.parse(fs.readFileSync(file, {encoding:'utf-8'}).toString())
        cleanDocument(json)

        if (!json._id) {
          json._id = generateId()

          // Edit original file with id and cleaned data
          fs.writeFileSync(
            file, JSON.stringify(json, null, '\t'), {encoding: 'utf-8'}
          )
        }

        data.push(json)
      } catch (e){
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


compilePacks()
