/* eslint-disable no-console */
export default function createActor(actor, options, userId) {
	if (!options.fromCompendium) {
		addBasicManuevers(actor, userId);
    addDefaultInteractions(actor, userId);
	}
}

// TODO: V1 - Move to preCreate
async function addBasicManuevers(actor, userId) {
	const currentUser = game.user;
	if (currentUser.id !== userId) return;

	const existing = actor.items.find((i) => i.type === 'maneuver' && i.system.degree === 0);
	if (existing) return;

	const uuids = [
		'Compendium.a5e.a5e-maneuvers.9umrahwm68f81d7l',
		'Compendium.a5e.a5e-maneuvers.jewmp4pzrg9cdui9',
		'Compendium.a5e.a5e-maneuvers.c0bv7fsy2akld5lp',
		'Compendium.a5e.a5e-maneuvers.zzg7j7cb0vkgctwi',
		'Compendium.a5e.a5e-maneuvers.210ihnnejao46r20',
		'Compendium.a5e.a5e-maneuvers.md35qozzy2fxy2o6',
	];

	try {
		const manuevers = await Promise.all(
			uuids.map(async (uuid) => {
				const doc = await fromUuid(uuid);
				doc._stats.compendiumSource = uuid;
				return doc;
			}),
		);

		await actor.createEmbeddedDocuments('Item', manuevers);
		console.info(`Added Manuevers to ${actor.name}`);
	} catch (e) {
		console.error(e);
		console.error(`Error while adding Manuevers to ${actor.name}`);
	}
}

// TODO: V1 - Move to preCreate
async function addDefaultInteractions(actor, userId) {
	const showFavorPoints = game.settings.get("a5e", "showFavorPoints");

	const currentUser = game.user;
	if (currentUser.id !== userId) return;

	const existing = actor.items.find((i) => i.type === 'interaction');
	if (existing) return;

	const uuids = [
    'Compendium.a5e.a5e-interactions.Item.LTqX56OBfR8yXOOQ',
    'Compendium.a5e.a5e-interactions.Item.hiOLwAemTfjkqdjU',
    'Compendium.a5e.a5e-interactions.Item.mrBB6aHoawLItPHe',
    'Compendium.a5e.a5e-interactions.Item.lctpftDNP4vULPiR',
    'Compendium.a5e.a5e-interactions.Item.n1NrQ4LYAWIc1hZq',
    'Compendium.a5e.a5e-interactions.Item.5E8zslR8LlMnpzay',
    'Compendium.a5e.a5e-interactions.Item.Q5C1re55J27oUyMF',
    'Compendium.a5e.a5e-interactions.Item.d1dU5SDu0Z8tSRBn',
    'Compendium.a5e.a5e-interactions.Item.gWWPlqlSWRwVNbRK',
    'Compendium.a5e.a5e-interactions.Item.Q6fwmMroGk0aMnoR',
    'Compendium.a5e.a5e-interactions.Item.OcPK6F30k28lUZcS',
    'Compendium.a5e.a5e-interactions.Item.JzsYBHWtsPQT3dHh',
    'Compendium.a5e.a5e-interactions.Item.J8fyIvGoKtnENXnI',
    'Compendium.a5e.a5e-interactions.Item.Y5Q4qpP4IZ9sdDx1',
    'Compendium.a5e.a5e-interactions.Item.YdXD7EbjBVibT4zj',
    'Compendium.a5e.a5e-interactions.Item.HOA5RjRV4X6h0l2l',
    'Compendium.a5e.a5e-interactions.Item.L00RxOHwIuINQZ5e',
    'Compendium.a5e.a5e-interactions.Item.KiXaYpeI9bAk1BDP',
    'Compendium.a5e.a5e-interactions.Item.VbaGtPoDbMZbBCju',
    'Compendium.a5e.a5e-interactions.Item.VMq49ePIORrwEiqu',
    'Compendium.a5e.a5e-interactions.Item.05G1Mu3N7Cp5ZzHM',
    'Compendium.a5e.a5e-interactions.Item.FAwy4lWwNJpAAgrO',
    'Compendium.a5e.a5e-interactions.Item.MpEfNxp04oAlsMe0',
    'Compendium.a5e.a5e-interactions.Item.hvWV7oi2QNfdkPa4',
    'Compendium.a5e.a5e-interactions.Item.iGAfOTgrIDsAwDEd',
    'Compendium.a5e.a5e-interactions.Item.hLOL2LS93RgdIGVm',
    'Compendium.a5e.a5e-interactions.Item.Cl1lq9pGggF9IQFi',
    'Compendium.a5e.a5e-interactions.Item.5m3jcUYaWQh94tx5',
    'Compendium.a5e.a5e-interactions.Item.uvXydteIZ242VIX4',
    'Compendium.a5e.a5e-interactions.Item.C2boQIUT2kr9wUdH',
    'Compendium.a5e.a5e-interactions.Item.iP1Wprm3MLHYurJM',
    'Compendium.a5e.a5e-interactions.Item.gdcBx5igCdYJV69A',
    'Compendium.a5e.a5e-interactions.Item.mdWVb05sdqxtwkQi',
    'Compendium.a5e.a5e-interactions.Item.ZS33ajylExuqXeUj',
    'Compendium.a5e.a5e-interactions.Item.tBTGoP8j4MkUVggx',
    'Compendium.a5e.a5e-interactions.Item.kJGpsGxk0jFlDUa6',
    'Compendium.a5e.a5e-interactions.Item.I4JdDjTtPWOoTZUp',
    'Compendium.a5e.a5e-interactions.Item.dc1HUU3mHT3PlChY',
    'Compendium.a5e.a5e-interactions.Item.B5WlqQfe3WauHIsy',
    'Compendium.a5e.a5e-interactions.Item.G3AZgPRJuCzNAi8v',
    'Compendium.a5e.a5e-interactions.Item.NMl7RMJURpMuGI7T',
    'Compendium.a5e.a5e-interactions.Item.iaUwC2LW7Fw6tgHB',
    'Compendium.a5e.a5e-interactions.Item.M3kiz6eooJdcv1Cm',
    'Compendium.a5e.a5e-interactions.Item.W3YiQqFSsgVazjTf',
    'Compendium.a5e.a5e-interactions.Item.NKC3yUEICuo0uflN',
    'Compendium.a5e.a5e-interactions.Item.BVFnhGsk41LvXeVd',
    'Compendium.a5e.a5e-interactions.Item.rrMBjCBjIapcg0Zp',
  ];

  if (showFavorPoints) {
		uuids.push('Compendium.a5e.a5e-interactions.Item.8ysPqygBCvjoMZlQ');
	}

	try {
		const interactions = await Promise.all(
			uuids.map(async (uuid) => {
				const doc = await fromUuid(uuid);
				doc._stats.compendiumSource = uuid;
				return doc;
			}),
		);

		await actor.createEmbeddedDocuments('Item', interactions);
		console.info(`Added Interactions to ${actor.name}`);
	} catch (e) {
		console.error(e);
		console.error(`Error while adding Interactions to ${actor.name}`);
	}
}
