export function sortAscending(document, reducer, documentName) {
  const entities = [...reducer];
  entities.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  const updateData = entities.map((entity, idx) => ({
    _id: entity.id,
    sort: idx
  }));

  document.updateEmbeddedDocuments(documentName, updateData);
}

export function sortDescending(document, reducer, documentName) {
  const entities = [...reducer];
  entities
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    .reverse();

  const updateData = entities.map((entity, idx) => ({
    _id: entity.id,
    sort: idx
  }));

  document.updateEmbeddedDocuments(documentName, updateData);
}
