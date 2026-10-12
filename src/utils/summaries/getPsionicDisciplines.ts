import { localize } from "#utils/localization/localize.ts";

import type Item.OfType<'spell'> from '../../documents/item/spell';

export default function getPsionicDisciplines(item: Item.OfType<'spell'>) {
	const { psionicDisciplines } = CONFIG.A5E;
	const { disciplines } = item.system;

	const disciplineArray = disciplines.map(
		(discipline) => localize(psionicDisciplines[discipline]) ?? discipline,
	) as string[];

	disciplineArray.sort((a, b) => a.localeCompare(b));

	return disciplineArray.join(", ");
}
