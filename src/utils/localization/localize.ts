import { isObject } from "../isObject.ts";

export function localize(stringId: string, data?: Record<string, string>) {
  const result = !isObject(data)
    ? game.i18n.localize(stringId)
    : game.i18n.format(stringId, data);

  return result !== undefined ? result : "";
}
