export function sortAscending(document, reducer) {
  const items = [...reducer];
  items.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  const updateData = items.map((item, idx) => ({
    _id: item.id,
    sort: idx
  }));

  document.updateEmbeddedDocuments('Item', updateData);
}

export function sortDescending(document, reducer) {
  const items = [...reducer];
  items
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    .reverse();

  const updateData = items.map((item, idx) => ({
    _id: item.id,
    sort: idx
  }));

  document.updateEmbeddedDocuments('Item', updateData);
}
