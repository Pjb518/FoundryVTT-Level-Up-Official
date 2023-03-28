/* eslint-disable no-console */
export default function createActor(actor, options, userId) {
  if (!options.fromCompendium) { addBasicManuevers(actor, userId); }
}

async function addBasicManuevers(actor, userId) {
  const currentUser = game.user;
  if (currentUser.id !== userId) return;

  const uuids = [
    'Compendium.a5e.a5e-maneuvers.9umrahwm68f81d7l',
    'Compendium.a5e.a5e-maneuvers.jewmp4pzrg9cdui9',
    'Compendium.a5e.a5e-maneuvers.c0bv7fsy2akld5lp',
    'Compendium.a5e.a5e-maneuvers.zzg7j7cb0vkgctwi',
    'Compendium.a5e.a5e-maneuvers.210ihnnejao46r20',
    'Compendium.a5e.a5e-maneuvers.md35qozzy2fxy2o6'
  ];

  try {
    const manuevers = await Promise.all(uuids.map((uuid) => fromUuid(uuid)));
    await actor.createEmbeddedDocuments('Item', manuevers);
    console.info(`Added Manuevers to ${actor.name}`);
  } catch (e) {
    console.error(e);
    console.error(`Error while adding Manuevers to ${actor.name}`);
  }
}
