import updateDocumentDataFromField from '../../utils/updateDocumentDataFromField';

export default function updateAssociatedValues(
  document,
  key,
  value,
  associatedKey,
  excludeFilter = null,
  associatedValue = 1
) {
  if (excludeFilter && !excludeFilter.includes(value)) {
    document.update({
      [key]: value,
      [associatedKey]: associatedValue
    });
  } else if (!excludeFilter) {
    document.update({
      [key]: value,
      [associatedKey]: associatedValue
    });
  } else {
    updateDocumentDataFromField(document, key, value);
  }
}
