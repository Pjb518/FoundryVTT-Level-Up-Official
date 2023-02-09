/* eslint-disable no-underscore-dangle */
export function sortAscending(items) { }

export async function sortDescending(actor, items) {
  // Sort in descending order
  const sorted = [...items].sort((a, b) => {
    if (a.name > b.name) return -1;
    if (a.name < b.name) return 1;
    return 0;
  });

  const maxSortValue = sorted.length - 1;
  const updateData = [];

  sorted.forEach((item, idx) => {
    updateData.push({
      _id: item._id,
      sort: maxSortValue - idx
    });
  });

  console.log(updateData);
  // Update embedded documents
  await actor.updateEmbeddedDocuments('Item', updateData);
}

// TODO: Implement
export function sortCustom() { }
