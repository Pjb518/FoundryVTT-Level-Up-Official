import CharacterActorA5E from '../documents/actor/character';
import NPCActorA5E from '../documents/actor/npc';

import ArchetypeItemA5e from '../documents/item/archetype';
import ClassItemA5e from '../documents/item/class';
import FeatureItemA5e from '../documents/item/feature';
import ObjectItemA5e from '../documents/item/object';
import OriginItemA5e from '../documents/item/origin';
import SpellItemA5e from '../documents/item/spell';

export default function registerDocumentConfig(A5E) {
  A5E.Actor = {
    documentClasses: {
      character: CharacterActorA5E,
      npc: NPCActorA5E
    }
  };

  A5E.Item = {
    documentClasses: {
      feature: FeatureItemA5e,
      object: ObjectItemA5e,
      spell: SpellItemA5e,

      archetype: ArchetypeItemA5e,
      background: OriginItemA5e,
      class: ClassItemA5e,
      culture: OriginItemA5e,
      destiny: OriginItemA5e,
      heritage: OriginItemA5e
    }
  };
}
