/**
 * The function called by macros created by dragging an action to the macro hot bar.
 *
 * @param {string} itemName  The name of the owned item to be activated.
 * @param {string} actionId  The id of the action to be activated.
 * @returns {Promise}
 */
export default function activateActionMacro(itemName, actionId) {
	const speaker = ChatMessage.getSpeaker();

	let actor;
	if (speaker.token) actor = game.actors.tokens[speaker.token];
	if (!actor) actor = game.actors.get(speaker.actor);

	// Get matching items
	const items = actor ? actor.items.filter((item) => item.name === itemName) : [];

	if (items.length > 1) {
		ui.notifications.warn(
			`Your controlled Actor ${actor.name} has more than one Item with name ${itemName}. The first matched item will be chosen.`,
		);
	} else if (items.length === 0) {
		return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);
	}

	const item = items[0];
	const action = item.actions.get(actionId);
	if (!action) {
		return ui.notifications.warn(`Your selected Item does not have an action with id ${actionId}`);
	}

	return item.activate(actionId);
}
