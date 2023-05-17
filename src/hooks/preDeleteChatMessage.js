export default function preDeleteChatMessage(message) {
  const flagData = message?.flags?.a5e;

  if (typeof flagData === 'object' && typeof message?._svelteComponent?.$destroy === 'function') {
    message._svelteComponent.$destroy();
  }
}
