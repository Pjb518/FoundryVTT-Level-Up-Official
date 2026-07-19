import { localize } from "#utils/localization/localize.ts";

import { handleDocumentMigration } from "../migration/handlers/handleDocumentMigration.ts";
import { handlePackMigration } from "../migration/handlers/handlePackMigration.ts";

export default function getDocumentDirectoryContext(app, options, type) {
  options.push({
    name: localize("A5E.migration.migrateDocument", { type }),
    icon: '<i class="icon fa-solid fa-crow"></i>',
    condition: () => game.user.isGM,
    callback: (li) => callMigration(li, type),
  });
}

function callMigration(li, docType) {
  if (docType === "Pack") {
    const pack = game.packs.get(li.dataset.pack);
    console.log(pack);
    if (pack) {
      handlePackMigration(pack);
    }
  } else {
    const type = docType === "Actor" ? "actors" : "items";
    const document = game[type].get(li.dataset.entryId);
    if (document) {
      handleDocumentMigration(document);
    }
  }
}
