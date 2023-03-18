export default function userHasLimitedAccess(user, actor) {
  if (user.isGM) return false;

  const limitedPermissions = CONST.DOCUMENT_PERMISSION_LEVELS.LIMITED;

  if (actor.ownership[user.id] && actor.ownership[game.user.id] === limitedPermissions) {
    return true;
  }

  return actor.ownership.default === limitedPermissions;
}
