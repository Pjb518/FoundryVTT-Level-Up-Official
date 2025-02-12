import ItemCard from '../apps/chat/ItemCard.svelte';
import RollCard from '../apps/chat/RollCard.svelte';
import RollTableCard from '../apps/chat/RollTableCard.svelte';

// import A5eChatCard from '../apps/chat/ChatCard.svelte';

export default function renderChatMessage(message, html) {
	// Add svelte component
	let Component: any;
	const target = $(html)[0];

	if (!target) return;

	switch (message.type) {
		case 'item':
			Component = ItemCard;
			break;
		case 'roll':
			Component = RollCard;
			break;
		case 'rollTableOutput':
			Component = RollTableCard;
			break;
		default:
			return;
	}

	const isBlind = message.blind;
	const isWhisper = message.whisper.length && !message.whisper.includes(game.userId);
	const isSelfRoll = message.whisper.length === 1 && message.whisper?.[0] !== game.userId;

	// Don't render card if it shouldn't be visible
	if (((isBlind || isWhisper) && !game.user?.isGM) || isSelfRoll) {
		target.classList.add('a5e-chat-card--hidden');
		return;
	}

	target.classList.add('a5e-chat-card--background-regular');
	if (isBlind) target.classList.add('a5e-chat-card--background-blind');
	if (isWhisper || isSelfRoll) target.classList.add('a5e-chat-card--background-regular');

	target.classList.add('a5e-chat-card');
	$(html).find('.message-header')[0]?.remove();
	$(html).find('.message-content')[0]?.remove();

	message._svelteComponent = new Component({
		target,
		props: { messageDocument: message },
	});
}
