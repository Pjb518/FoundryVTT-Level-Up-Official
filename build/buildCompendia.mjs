import fs from 'fs';
import path from 'path';
import url from 'url';

// eslint-disable-next-line import/extensions
import Pack from './lib/Pack.mjs';

function main() {
  const dirName = url.fileURLToPath(new URL('.', import.meta.url));
  const dataPath = path.resolve(dirName, '../packs');
  const dirPaths = fs.readdirSync(dataPath)
    .map((name) => path.resolve(dirName, dataPath, name));

  const packs = dirPaths.reduce((acc, pack) => {
    if (pack.endsWith('json')) return acc;
    acc.push(Pack.loadJSONFiles(pack));
    return acc;
  }, []);

  packs.map((p) => p.saveAsPack());

  // console.log(packs);
}

main();
