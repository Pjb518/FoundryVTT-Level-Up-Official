export default function getDocumentSourceTooltip(source) {
  if (!source) return null;

  let innerHTML = `<header class="a5e-tooltip__heading a5e-tooltip__heading--source">${source.title}</header>`;
  if (source.affiliate) innerHTML += ' <small class="a5e-tooltip__note">Note: This is an affiliate link.</small>';

  return innerHTML;
}
