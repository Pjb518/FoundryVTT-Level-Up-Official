export default function toggleSheetLockedState(actor) {
  const currentLockState = actor.getFlag('a5e', 'sheetIsLocked') ?? false;
  actor.update({ 'flags.a5e.sheetIsLocked': !currentLockState });
}
