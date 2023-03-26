export default function toggleSheetLockedState(actor) {
  const currentLockState = actor.getFlag('a5e', 'sheetIsLocked') ?? true;
  actor.update({ 'flags.a5e.sheetIsLocked': !currentLockState });
}
