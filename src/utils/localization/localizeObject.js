// eslint-disable-next-line import/no-unresolved
import { localize } from '#runtime/svelte/helper';

export default function localizeObject(obj) {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string') {
      obj[key] = localize(value);
    }
  });
}
