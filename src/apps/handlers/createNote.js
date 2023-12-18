export default function createNote(actor, type, key) {
  if (!key) return;

  let path;

  if (type === 'abilityCheck') {
    path = `system.abilities.${key}.check.notes`;
  } else if (type === 'savingThrow') {
    path = `system.abilities.${key}.save.notes`;
  } else if (type === 'skillCheck') {
    path = `system.skills.${key}.notes`;
  }

  const notes = getProperty(actor, path);

  if (!notes) return;

  notes[foundry.utils.randomID()] = {
    title: 'New Note',
    content: ''
  };

  actor.update({ [path]: notes });
}
