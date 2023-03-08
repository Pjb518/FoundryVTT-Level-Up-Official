import updateDocumentDataFromField from '../utils/updateDocumentDataFromField';

export default function updateAssociatedValues(
  document,
  key,
  value,
  associatedKey,
  excludeFilter = null,
  associatedValue = 1
) {
  updateDocumentDataFromField(document, key, value);

  if (excludeFilter && !excludeFilter.includes(value)) {
    updateDocumentDataFromField(document, associatedKey, Number(associatedValue));
  }
}
