import { localize } from "#utils/localization/localize.ts";

export function prepareAlignment(data: any): string[] {
  const alignments = data.system.traits.alignment?.sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase()),
  );

  return alignments.map((type) =>
    localize(CONFIG.A5E.alignments[type] ?? type),
  );
}
