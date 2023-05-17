import './scss/main.scss';

import A5eChatCard from './apps/chat/ChatCard.svelte';

import canvasInit from './hooks/canvasInit';
import createActor from './hooks/createActor';
import createToken from './hooks/createToken';
import init from './hooks/init';
import ready from './hooks/ready';
import setup from './hooks/setup';

Hooks.once('init', init);
Hooks.once('setup', setup);
Hooks.once('ready', ready);
Hooks.on('canvasInit', canvasInit);

Hooks.on('createActor', createActor);
Hooks.on('createToken', createToken);

Hooks.on('renderChatMessage', (message, html) => {
  const target = $(html).find('.message-content article')[0];

  if (!target) return;

  if (CONFIG.A5E.chatCardTypes.includes(message.getFlag('a5e', 'cardType'))) {
    message._svelteComponent = new A5eChatCard({
      target: $(html).find('.message-content article')[0],
      props: { messageDocument: message }
    });
  }
});

Hooks.on('preDeleteChatMessage', (message) => {
  const flagData = message?.flags?.a5e;

  if (typeof flagData === 'object' && typeof message?._svelteComponent?.$destroy === 'function') {
    message._svelteComponent.$destroy();
  }
});
