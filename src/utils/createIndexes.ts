import DND5ESpellCompendiumSheet from '../apps/DND5ESpellCompendiumSheet';
import ItemCompendiumSheet from '../apps/ItemCompendiumSheet';
import ManeuverCompendiumSheet from '../apps/ManeuverCompendiumSheet';
import MonsterCompendiumSheet from '../apps/MonsterCompendiumSheet';
import SpellCompendiumSheet from '../apps/SpellCompendiumSheet';

export async function createManeuverLikeIndex(packId: string) {
  const pack = game.packs.get(packId);

  pack.getIndex({
    fields: [
      'system.description',
      'system.exertionCost',
      'system.concentration',
      'system.degree',
      'system.isStance',
      'system.tradition'
    ]
  });

  pack.applicationClass = ManeuverCompendiumSheet;
}

export async function createMonsterLikeIndex(packId: string) {
  const pack = game.packs.get(packId);

  pack.getIndex({
    fields: [
      'system.description',
      'system.details.cr',
      'system.details.creatureTypes',
      'system.details.elite',
      'system.details.isSwarm',
      'system.traits.size'
    ]
  });

  pack.applicationClass = MonsterCompendiumSheet;
}

export async function create5eMonsterLikeIndex(packId: string) {
  const monsters = game.packs.get(packId);

  monsters.getIndex({
    fields: [
      'system.description',
      'system.details.cr',
      'system.details.creatureTypes',
      'system.details.elite',
      'system.details.isSwarm',
      'system.traits.size'
    ]
  });

  monsters.applicationClass = MonsterCompendiumSheet;
}

export async function createObjectLikeIndex(packId: string) {
  const pack = game.packs.get(packId);

  pack.getIndex({
    fields: [
      'system.requiresAttunement',
      'system.bulky',
      'system.objectType',
      'system.price',
      'system.rarity'
    ]
  });

  pack.applicationClass = ItemCompendiumSheet;
}

export async function createSpellLikeIndex(packId: string) {
  const pack = game.packs.get(packId);

  pack.getIndex({
    fields: [
      'system.concentration',
      'system.components',
      'system.classes',
      'system.description',
      'system.level',
      'system.rare',
      'system.ritual',
      'system.schools'
    ]
  });

  pack.applicationClass = SpellCompendiumSheet;
}

export async function create5eSpellLikeIndex(packId: string) {
  const pack = game.packs.get(packId);

  pack.getIndex({
    fields: [
      'system.concentration',
      'system.components',
      'system.description',
      'system.level',
      'system.ritual',
      'system.schools'
    ]
  });

  pack.applicationClass = DND5ESpellCompendiumSheet;
}
