const gulp = require('gulp');
const through2 = require('through2');
const fs = require('fs');
const path = require('path');

const PACK_DEST = './public/packs';
const PACK_SRC = './packs';

async function compilePacks() {
  const folders = fs.readdirSync(PACK_SRC, { withFileTypes: true })
    .filter((f) => f.isDirectory());

  const packs = folders.map((folder) => {
    const filePath = path.join(PACK_DEST, `${folder.name}.db`);
    fs.rmSync(filePath, { force: true });

    const db = fs.createWriteStream(filePath, { flags: 'a', mode: 0o664 });
    const data = [];

    return gulp.src(path.join(PACK_SRC, folder.name, '/**/*.json'))
      .pipe(through2.obj((file, enc, callback) => {
        const json = JSON.parse(file.contents.toString());
        // TODO: Possibly clean the data

        data.push(json);
        callback(null, file);
      }, (callback) => {
        // eslint-disable-next-line no-underscore-dangle
        data.sort((lhs, rhs) => (lhs._id > rhs._id ? 1 : -1));
        data.forEach((entry) => db.write(`${JSON.stringify(entry)}\n`));
        callback();
      }));
  });

  return packs;
}

exports.default = gulp.series(compilePacks);
exports.buildCompendia = gulp.series(compilePacks);
