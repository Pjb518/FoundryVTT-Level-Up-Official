export default function updateDocumentDataFromField(document: any, key: string, value: any): void {
  document.update({ [key]: value });
}
