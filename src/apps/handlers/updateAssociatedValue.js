import updateDocumentDataFromField from '../utils/updateDocumentDataFromField';

export default function updateAssociatedValue(
  document,
  key,
  value,
  associatedKey,
  associatedValue = 1
) {
  updateDocumentDataFromField(document, key, value);
  updateDocumentDataFromField(document, associatedKey, associatedValue);
}
