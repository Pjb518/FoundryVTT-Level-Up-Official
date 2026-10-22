import { A5EArchetypeData } from '../../dataModels/item/ArchetypeDataModel.ts';
import type { A5EClassData } from '../../dataModels/item/ClassDataModel.ts';
import { getDeterministicBonus } from '../../dice/getDeterministicBonus.ts';
import type ClassResourceManager from '../../managers/ClassResourceManager.ts';
import type ArchetypeItemA5e from './archetype.ts';
import type { ClassCastingData } from './data.ts';
import OriginItemA5e from './origin.ts';

export default class ClassItemA5e extends OriginItemA5e<'class'> {
	declare casting: ClassCastingData | null;

	declare resources: ClassResourceManager;
}
