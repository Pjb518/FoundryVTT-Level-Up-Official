import { isObject } from "#utils/isObject.ts";
import { localize } from "#utils/localization/localize.ts";

type ScalingData = {
  formula: Record<string, any> | string;
  mode: string;
};

export function prepareScalingSummary(
  type: string,
  data: ScalingData,
  extra: Record<string, any> = {},
) {
  if (!data) return "";
  const { mode } = data;
  if (!mode) return "";

  const baseSummary = `A5E.scaling.summaries.${mode}.${type}`;
  const formula = isObject(data.formula)
    ? data.formula
    : { formula: data.formula };

  const localized = localize(baseSummary, {
    ...formula,
    ...extra,
  });

  return localized;
}
