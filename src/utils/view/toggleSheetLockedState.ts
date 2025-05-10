export function toggleSheetLockedState(actor: any) {
  const currentLockState = actor.getFlag("a5e", "sheetIsLocked") ?? true;
  actor.update({ "flags.a5e.sheetIsLocked": !currentLockState });
}
