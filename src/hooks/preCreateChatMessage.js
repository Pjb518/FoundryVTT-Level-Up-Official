export default function preCreateChatMessage(message, user, options, userId) {
  if (game.user.id !== userId) return;

  message.updateSource({
    'flags.core.canPopout': true
  });
}
