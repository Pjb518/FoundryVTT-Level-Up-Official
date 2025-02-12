import { A5E } from '../../../config';

const MODES: Record<string, number> = A5E.ACTIVE_EFFECT_MODES;
const DEFAULT_MODES = Object.keys(MODES)
	.filter((k) => k !== 'CUSTOM')
	.sort((a, b) => a.localeCompare(b));

const DEFAULT_STRING_MODES = Object.keys(MODES)
	.filter((k) => !['CUSTOM', 'UPGRADE', 'DOWNGRADE', 'CONDITIONAL'].includes(k))
	.sort((a, b) => a.localeCompare(b));

const ADD_AND_OVERRIDE = ['ADD', 'OVERRIDE'];
const OVERRIDE_ONLY = ['OVERRIDE'];
const CUSTOM_ONLY = ['CUSTOM'];
const CONDITIONAL_ONLY = ['CONDITIONAL'];
const CONDITIONAL_AND_OVERRIDE = ['OVERRIDE', 'CONDITIONAL'];

export default {
	MODES,
	DEFAULT_MODES,
	DEFAULT_STRING_MODES,
	ADD_AND_OVERRIDE,
	OVERRIDE_ONLY,
	CUSTOM_ONLY,
	CONDITIONAL_ONLY,
	CONDITIONAL_AND_OVERRIDE,
};
