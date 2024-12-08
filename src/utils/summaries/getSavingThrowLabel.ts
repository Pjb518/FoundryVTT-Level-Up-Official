import type { Action } from 'types/action';

import { localize } from '#runtime/util/i18n';

export default function getSavingThrowLabel(action: Action) {
	if (foundry.utils.isEmpty(action)) return '';

	const prompts = action?.prompts;

	if (foundry.utils.isEmpty(prompts) || Object.keys(prompts).length > 1 ) return null;

	const promptID = Object.keys(prompts);
	const ability = prompts[promptID]?.ability;
	const type = prompts[promptID]?.type;
	const onSave = prompts[promptID]?.onSave;

	let savingThrowLabel = '';

	if(type === "savingThrow"){
		if (onSave) {
			savingThrowLabel = `${localize(CONFIG.A5E.abilities[ability])} (${onSave})`;
		} else {
			savingThrowLabel = `${localize(CONFIG.A5E.abilities[ability])}`;
		}
	}

	return savingThrowLabel;
}
