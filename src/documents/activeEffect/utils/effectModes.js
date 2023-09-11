import A5E from '../../../config';

const MODES = A5E.ACTIVE_EFFECT_MODES;
const DEFAULT_MODES = Object.keys(MODES)
  .filter((k) => k !== 'CUSTOM')
  .sort((a, b) => a.localeCompare(b));

const DEFAULT_STRING_MODES = Object.keys(MODES)
  .filter((k) => !['CUSTOM', 'MULTIPLY', 'ADD', 'SUBTRACT', 'PREDICATE'].includes(k))
  .sort((a, b) => a.localeCompare(b));

const OVERRIDE_ONLY = ['OVERRIDE'];
const CUSTOM_ONLY = ['CUSTOM'];
const PREDICATE_ONLY = ['PREDICATE'];

export default {
  MODES,
  DEFAULT_MODES,
  DEFAULT_STRING_MODES,
  OVERRIDE_ONLY,
  CUSTOM_ONLY,
  PREDICATE_ONLY
};
