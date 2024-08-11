import CheckCard from '../apps/chat/CheckCard.svelte';

// import A5eChatCard from '../apps/chat/ChatCard.svelte';

export default function renderChatMessage(message, html) {
  // Add svelte component
  let Component: any;
  const target = $(html)[0];

  if (!target) return;

  switch (message.type) {
    case 'roll':
      Component = CheckCard;
      break;
    default:
      return;
  }

  target.classList.add('a5e-chat-card');
  $(html).find('.message-header')[0]?.remove();
  $(html).find('.message-content')[0]?.remove();

  message._svelteComponent = new Component({
    target,
    props: { messageDocument: message }
  });
}
