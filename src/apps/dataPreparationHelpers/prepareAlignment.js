import { localize } from '#runtime/svelte/helper';

export default function prepareAlignment(data) {
  const alignments = data.system.traits.alignment?.sort(
    (a, b) => a.toLowerCase().localeCompare(b.toLowerCase())
  );

  return alignments.map(
    (type) => localize(CONFIG.A5E.alignments[type] ?? type)
  );
}
