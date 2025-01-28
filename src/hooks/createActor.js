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
		'Compendium.a5e.a5e-basic-actions.Item.oNKXFSwR07C7zgWH',
		'Compendium.a5e.a5e-basic-actions.Item.S9oui6Voh1uXkHdw',
		'Compendium.a5e.a5e-basic-actions.Item.NP3OETYvKDKta6Ek',
		'Compendium.a5e.a5e-basic-actions.Item.RTv6AFj9ArifhFRQ',
		'Compendium.a5e.a5e-basic-actions.Item.Br4xG45dOA7XXWnn',
		'Compendium.a5e.a5e-basic-actions.Item.XYVf46LZcwqxEytd',
		'Compendium.a5e.a5e-basic-actions.Item.h7nd6QfXrmUNzwUT',
		'Compendium.a5e.a5e-basic-actions.Item.fW2r4SrJvcTbTTIl',
		'Compendium.a5e.a5e-basic-actions.Item.bRYgtIeBX41hRRcs',
		'Compendium.a5e.a5e-basic-actions.Item.ZEYgq9QTUS1kJ6aN',
		'Compendium.a5e.a5e-basic-actions.Item.XCz1a4q5x1IZ2Pi0',
		'Compendium.a5e.a5e-basic-actions.Item.49pXYv8PZ8YixKo4',
		'Compendium.a5e.a5e-basic-actions.Item.IXN4n0yuUZhyMPhU',
		'Compendium.a5e.a5e-basic-actions.Item.ZO3klo3vCYSGBuDu',
		'Compendium.a5e.a5e-basic-actions.Item.Eutx8vAs6TJEJ3uA',
		'Compendium.a5e.a5e-basic-actions.Item.oWSbMQvA4srtcMEa',
		'Compendium.a5e.a5e-basic-actions.Item.qe2XkHJDJqTGLyUs',
		'Compendium.a5e.a5e-basic-actions.Item.UJUzbihBE88XKCGA',
		'Compendium.a5e.a5e-basic-actions.Item.qbW6QqAUzbsaMXFP',
		'Compendium.a5e.a5e-basic-actions.Item.jow2ZcFwGPNAMH9Y',
		'Compendium.a5e.a5e-basic-actions.Item.LjGC63QKQSVSbJxf',
		'Compendium.a5e.a5e-basic-actions.Item.qJjoEGvCfiiVYPTG',
		'Compendium.a5e.a5e-basic-actions.Item.cFyJCQYaFA1hcZs9',
		'Compendium.a5e.a5e-basic-actions.Item.4ppE2MSu7d0AkElp',
		'Compendium.a5e.a5e-downtime-activities.Item.OwEmLdNSrO6yuvp0',
		'Compendium.a5e.a5e-downtime-activities.Item.0GDYJ4YcHC2at9Na',
		'Compendium.a5e.a5e-downtime-activities.Item.IW4xLuxgTqd2xDo0',
		'Compendium.a5e.a5e-downtime-activities.Item.QniihYwDU0bdEYPX',
		'Compendium.a5e.a5e-downtime-activities.Item.4j75Rpkjuhyc2zOk',
		'Compendium.a5e.a5e-downtime-activities.Item.uk8kp2FSa7eRzCoe',
		'Compendium.a5e.a5e-downtime-activities.Item.ZySBUq6XuTdsn7In',
		'Compendium.a5e.a5e-downtime-activities.Item.KCB3wHbqdzTnPtTb',
		'Compendium.a5e.a5e-downtime-activities.Item.12yg8FCR4IYljFFX',
		'Compendium.a5e.a5e-journey-activities.Item.DZk7OIACUbyT4gtl',
		'Compendium.a5e.a5e-journey-activities.Item.cmhk22hPuTGbEwzg',
		'Compendium.a5e.a5e-journey-activities.Item.tJoYToz3vcg7nRHZ',
		'Compendium.a5e.a5e-journey-activities.Item.Ysk61kLaAWAvOYnM',
		'Compendium.a5e.a5e-journey-activities.Item.k6HEq3aj3likFUDj',
		'Compendium.a5e.a5e-journey-activities.Item.8gJ2HC70JNzMst1C',
		'Compendium.a5e.a5e-journey-activities.Item.gTVQI8dMoJnTUAk0',
		'Compendium.a5e.a5e-journey-activities.Item.HSp52i8Pp7FRpEbn',
		'Compendium.a5e.a5e-journey-activities.Item.2l3T7qxF0UzVzji9',
		'Compendium.a5e.a5e-journey-activities.Item.W4f0evzCnTV6jR8U',
		'Compendium.a5e.a5e-journey-activities.Item.4SV3K2fdKzST223R',
		'Compendium.a5e.a5e-journey-activities.Item.99EiMjMJZmrVaKKu',
		'Compendium.a5e.a5e-journey-activities.Item.ghO1hwYTnBu4TydF',
		'Compendium.a5e.a5e-journey-activities.Item.ocGX10n1S97h4FgF',
	];

	if (showFavorPoints) {
		uuids.push('Compendium.a5e.a5e-journey-activities.Item.F3hpOQuuGOunq7SF');
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
