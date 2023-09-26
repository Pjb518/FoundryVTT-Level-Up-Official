function parseOrString(raw: string): any {
  try {
    return JSON.parse(raw);
  } catch (err) {
    return raw;
  }
}

function castArray(value: any): Array<any> {
  let delta: Array<any>;
  try {
    delta = JSON.parse(value);
    delta = delta instanceof Array ? delta : [delta];
  } catch (err) {
    delta = [value];
  }

  return delta;
}

function castObject(value: any): Record<string, any> {
  let delta: Record<string, any>;
  try {
    delta = JSON.parse(value);
    delta = delta instanceof Object ? delta : {};
  } catch (err) {
    delta = {};
  }

  return delta;
}

function castSet(value: any): Set<any> {
  let delta: Set<any>;
  try {
    delta = parseOrString(value);
    delta = delta instanceof Set ? delta : new Set(delta);
  } catch (err) {
    delta = new Set([value]);
  }
  return delta;
}

export default function castType(value: any, targetType: any): any {
  if (targetType === 'Array') return castArray(value);
  if (targetType === 'Object') return castObject(value);
  if (targetType === 'Set') return castSet(value);

  if (targetType === 'boolean') return Boolean(parseOrString(value));

  if (targetType === 'number') {
    // @ts-ignore
    const delta = Number.fromString(value);
    return Number.isNaN(delta) ? 0 : delta;
  }

  if (targetType === 'string') return String(value);

  return parseOrString(value);
}
