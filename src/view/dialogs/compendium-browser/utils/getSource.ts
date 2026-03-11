export function getSource(doc: any) {
  if (!doc.system) return null;

  if (typeof doc.system.source !== "string") return null;
  const source = CONFIG.A5E.products[doc.system.source];
  return source || null;
}
