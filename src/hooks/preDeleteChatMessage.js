export default function preDeleteChatMessage(message) {
  if (typeof message?._svelteComponent?.$destroy === 'function') {
    message._svelteComponent.$destroy();
  }
}
