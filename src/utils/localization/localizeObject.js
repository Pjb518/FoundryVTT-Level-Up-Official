// eslint-disable-next-line import/no-unresolved
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

export default function localizeObject(obj) {
  Object.entries(obj).forEach((key, value) => {
    const type = typeof value;

    if (type === 'string') {
      obj[key] = localize(value);
    }
  });
}
