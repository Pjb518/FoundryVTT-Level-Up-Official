// @ts-ignore
import { localize } from '#runtime/svelte/helper';

export default function localizeObject(obj: { [key: string]: any }): void {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string') {
      obj[key] = localize(value);
    }
  });
}
