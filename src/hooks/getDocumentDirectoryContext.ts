import { localize } from "#utils/localization/localize.ts";

import { handleDocumentMigration } from "../migration/handlers/handleDocumentMigration";
import { handlePackMigration } from "../migration/handlers/handlePackMigration";

export default function getDocumentDirectoryContext(dialog, html, data, type) {
  if (!game.user.isGM) return;

  const menu = {
    name: localize("A5E.migration.migrateDocument", { type }),
    icon: '<i class="icon fa-solid fa-crow"></i>',
    callback: ($li) => callMigration($li, type),
  };

  html.push(menu);
}

function callMigration($li, docType) {
  if (docType === "Pack") {
    const pack = game.packs.get($li.data("pack"));
    if (pack) {
      handlePackMigration(pack);
    }
  } else {
    const type = docType === "Actor" ? "actors" : "items";
    const document = game[type].get($li.data("document-id"));
    if (document) {
      handleDocumentMigration(document);
    }
  }
}
