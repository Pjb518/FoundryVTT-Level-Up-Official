export default async function fromUuidMulti(uuids: string[], options: Record<string, any> = {}) {
  const { relative, invalid = false, parent = null } = options;

  const parsedData = uuids.map((uuid) => foundry.utils.parseUuid(uuid, { relative }));
  const documents: any[] = [];
  const folders: any[] = [];
  const collections = new Map<any, Record<string, any>>();

  for (const {
    collection, documentId, documentType, doc
  } of parsedData) {
    if (collection instanceof CompendiumCollection) {
      if (documentType === 'Folder') {
        folders.push(collection.folders.get(documentId!));
      } else {
        if (!collections.has(collection)) collections.set(collection, []);
        collections.get(collection)?.push(documentId);
      }
    } else {
      documents.push(doc ?? collection?.get(documentId!, { invalid }));
    }
  }

  const queries = [...collections.entries()].map(([collection, ids]) => ({
    collection,
    query: { _id__in: ids }
  }));

  const results = (await Promise.all(
    queries.map(({ collection, query }) => collection.getDocuments(query))
  )).flat();

  const docs = results.concat(documents, folders).reduce((acc, doc) => {
    if (!doc) {
      acc.push(undefined);
      return acc;
    }

    // eslint-disable-next-line new-cap
    const item = new Item.implementation(doc.toObject(), { parent, keepId: true });
    item.updateSource({ 'flags.core.sourceId': doc.uuid });
    acc.push(item);
    return acc;
  }, []);

  return docs;
}
