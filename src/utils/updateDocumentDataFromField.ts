export default async function updateDocumentDataFromField(
	document: any,
	key: string,
	value: any,
): Promise<void> {
	document.update({ [key]: value });
}
