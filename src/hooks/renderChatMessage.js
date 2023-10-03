import A5eChatCard from '../apps/chat/ChatCard.svelte';

export default function renderChatMessage(message, html) {
  // Add svelte component
  const target = $(html).find('.message-content article')[0];
  // const target = html[0];

  if (!target) return;

  // target.innerHTML = '';
  if (CONFIG.A5E.chatCardTypes.includes(message.getFlag('a5e', 'cardType'))) {
    message._svelteComponent = new A5eChatCard({
      target,
      props: { messageDocument: message }
    });
  }
}
