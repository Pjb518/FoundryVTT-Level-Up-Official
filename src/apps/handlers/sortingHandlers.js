export async function sortAscending(document, reducer, documentName) {
  const entities = [...reducer];
  entities.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  const updateData = entities.map((entity, idx) => (documentName === 'ActiveEffect'
    ? { _id: entity.id, flags: { a5e: { sort: idx } } }
    : { _id: entity.id, sort: idx }));

  await document.updateEmbeddedDocuments(documentName, updateData);
}

export async function sortDescending(document, reducer, documentName) {
  const entities = [...reducer];
  entities
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    .reverse();

  const updateData = entities.map((entity, idx) => (documentName === 'ActiveEffect'
    ? { _id: entity.id, flags: { a5e: { sort: idx } } }
    : { _id: entity.id, sort: idx }));

  await document.updateEmbeddedDocuments(documentName, updateData);
}
