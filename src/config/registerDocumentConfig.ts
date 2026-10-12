import ArchetypeItemA5e from '../documents/item/archetype.ts';
import ClassItemA5e from '../documents/item/class.ts';
import OriginItemA5e from '../documents/item/origin.ts';

export default function registerDocumentConfig() {
	return {
		Actor: {
			documentClasses: {},
		},

		Item: {
			documentClasses: {
				archetype: ArchetypeItemA5e,
				background: OriginItemA5e,
				class: ClassItemA5e,
				culture: OriginItemA5e,
				destiny: OriginItemA5e,
				heritage: OriginItemA5e,
			},
		},
	};
}
