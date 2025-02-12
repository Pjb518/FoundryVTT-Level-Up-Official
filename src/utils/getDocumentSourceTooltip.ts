export default function getDocumentSourceTooltip(source: { affiliate: boolean; title: string }) {
	if (!source) return undefined;

	let innerHTML = `<header class="a5e-tooltip__heading a5e-tooltip__heading--source">${source.title}</header>`;
	if (source.affiliate)
		innerHTML += ' <small class="a5e-tooltip__note">Note: This is an affiliate link.</small>';

	return innerHTML;
}
