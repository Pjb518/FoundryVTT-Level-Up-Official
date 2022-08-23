export default function updateDocumentDataFromField(document, key, value) {
  document.update({ [key]: value });
}
