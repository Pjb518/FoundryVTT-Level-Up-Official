import { A5E } from '../../config';

const base = {
	bar: ['attributes.hp'],
	value: [
		...Object.keys(A5E.skills).map((s) => `skills.${s}.passive`),
		...Object.keys(A5E.abilities).map((a) => `abilities.${a}.value`),
		'attributes.hp.temp',
		'attributes.exertion.current',
	],
};

export default {
	base,
	character: {
		bar: [
			...base.bar,
			'resources.primary',
			'resources.secondary',
			'resources.tertiary',
			'resources.quaternary',
		],
		value: [...base.value],
	},
	npc: {
		bar: [...base.bar],
		value: [...base.value, 'details.cr'],
	},
};
