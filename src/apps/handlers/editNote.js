import NoteConfigDialog from '../dialogs/initializers/NoteConfigDialog';

export default function createNote(actor, type, key, id) {
  if (!key) return;

  let dialog;
  let path;

  if (type === 'abilityCheck') {
    path = `system.abilities.${key}.check.notes.${id}`;
  } else if (type === 'savingThrow') {
    path = `system.abilities.${key}.save.notes.${id}`;
  } else if (type === 'skillCheck') {
    path = `system.skills.${key}.notes.${id}`;
  }

  const note = getProperty(actor, path);

  if (!note) return;

  dialog = actor.dialogs[id];

  if (!dialog) {
    dialog = new NoteConfigDialog(actor, path);
    actor.dialogs[id] = dialog;
  }

  dialog.render(true);
}
