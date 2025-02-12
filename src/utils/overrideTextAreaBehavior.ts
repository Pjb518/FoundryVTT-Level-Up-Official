export default function overrideTextAreaBehavior(
	event: KeyboardEvent & {
		currentTarget: EventTarget & HTMLTextAreaElement;
	},
) {
	if (event.key !== 'Tab') return;
	event.preventDefault();

	const textArea = event.currentTarget;

	if (event.shiftKey) return;

	textArea.setRangeText('\t', textArea.selectionStart, textArea.selectionEnd, 'end');
}
