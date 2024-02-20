export default function getDocumentSourceTooltip(source) {
  if (!source) return null;

  let innerHTML = `<div class="a5e-document-source-tooltip">${source.title}`;
  if (source.affiliate) innerHTML += ' <small class="a5e-document-source-tooltip__notice">Note: This is an affiliate link.</small>';
  innerHTML += '</div>';

  return innerHTML;
}
