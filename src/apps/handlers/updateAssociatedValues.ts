import updateDocumentDataFromField from '../../utils/updateDocumentDataFromField';

export default function updateAssociatedValues(
	document,
	key: string,
	value: any,
	associatedKey: string,
	excludeFilter: string[] | null = null,
	associatedValue: any = 1,
) {
	if (excludeFilter && !excludeFilter.includes(value)) {
		document.update({
			[key]: value,
			[associatedKey]: associatedValue,
		});
	} else if (!excludeFilter) {
		document.update({
			[key]: value,
			[associatedKey]: associatedValue,
		});
	} else {
		updateDocumentDataFromField(document, key, value);
	}
}
