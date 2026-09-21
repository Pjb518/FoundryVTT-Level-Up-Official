import ArchetypeItemA5e from '../documents/item/archetype.ts';
import ClassItemA5e from '../documents/item/class.ts';
import FeatureItemA5e from '../documents/item/feature.ts';
import ObjectItemA5e from '../documents/item/object.ts';
import OriginItemA5e from '../documents/item/origin.ts';
import SpellItemA5e from '../documents/item/spell.ts';

export default function registerDocumentConfig() {
	return {
		Actor: {
			documentClasses: {},
		},

		Item: {
			documentClasses: {
				feature: FeatureItemA5e,
				object: ObjectItemA5e,
				spell: SpellItemA5e,

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
