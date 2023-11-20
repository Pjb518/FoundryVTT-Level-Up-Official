export default function registerEncounterElements(A5E) {
  A5E.encounterElements = {
    acid: {
      name: 'A5E.encounterElements.acid',
      description: '<p>A creature that touches acid takes 5 (2d4) acid damage. When a creature first enters into an area of acid or starts its turn there, it takes 10 (4d4) ongoing acid damage. A creature submerged in acid takes 25 (10d4) ongoing acid damage. This damage persists for 3 rounds after the creature leaves the acid. A creature ends all ongoing damage from mundane acid by using its action to wipe away the corrosive liquid.</p>',
      crModifier: 2
    },
    brownMold: {
      name: 'A5E.encounterElements.brownMold',
      description: `<p>Brown mold subsists on heat, drawing away warmth from the environment and creatures around it. Most patches of brown mold have only a 10-foot radius, but the temperature in a 30-foot radius around it is unnaturally cold.</p>
      <p>When a creature moves within 5 feet of the brown mold for the first time on a turn or starts its turn there, it makes a DC 12 Constitution saving throw, taking 22 (4d10) cold damage on a failure, or half damage on a success.</p>
      <p>Brown mold is not only immune to fire damage but rapidly grows when exposed to flames. When any source of fire — the effects of a spell like fire bolt, a lit torch, and so on—happens within 5 feet of a patch of brown mold, the brown mold rapidly expands to surround it in a 10-foot radius. However, any amount of cold damage instantly destroys a patch of brown mold.</p>`,
      crModifier: 2
    },
    crowd: {
      name: 'A5E.encounterElements.crowd',
      description: `<p>Throngs of humanoids are difficult terrain, and a creature surrounded by a crowd has disadvantage on hearing- and sight-based checks to perceive outside of it.</p>
      <p>In addition, making attacks in a crowd risks collateral damage and the wrath of the throng. When a creature attacks from within a crowd or attacks a target within a crowd, on a miss by 10 or more the attack hits a crowd member and the creature makes a Deception, Intimidation, or Persuasion check (DC 13 + 2 per previous check) to convince the crowd not to attack it. On a failure, the crowd transforms into a commoner mob and attacks, fighting until the creature is reduced to 0 hit points or the commoner mob is bloodied.</p>`,
      crModifier: 1
    },
    darkness: {
      name: 'A5E.encounterElements.darkness',
      description: '<p>Darkness comes in two varieties: magical and nonmagical. In nonmagical darkness, creatures with darkvision can see out to the range specified by that trait as if it were dim light. In magical darkness, all vision is blocked. Creatures without darkvision cannot see in mundane or magical darkness. In addition, a frightened creature unable to see because of magical darkness is rattled.</p>',
      crModifier: 0.5
    },
    denseSmoke: {
      name: 'A5E.encounterElements.denseSmoke',
      description: '<p>Creatures and objects in an area of dense smoke are heavily obscured. When a creature that needs to breathe starts its turn in an area of dense smoke, if it is not holding its breath it makes a Constitution saving throw (DC 10 + 1 per round previous turn in the dense smoke, maximum DC 20) or it begins to suffocate (see Chapter 7: Adventuring, in the Adventurer’s Handbook). A creature that covers its mouth and nose with a damp cloth has advantage on this save. Finally, smell-based checks to perceive or track creatures that have spent more than 1 round in an area of dense smoke have advantage until the creature finishes a long rest or takes at least 10 minutes to clean the smoke from itself.</p>',
      crModifier: 1
    },
    extremeCold: {
      name: 'A5E.encounterElements.extremeCold',
      description: `<p>At the end of every hour a creature is exposed to temperatures at or below 0° Fahrenheit (–18° Celsius), it makes a DC 10 Constitution saving throw or suffers a level of fatigue. Resistance to cold damage, immunity to cold damage, or wearing cold weather gear grants an automatic success on this save. Creatures native to an extreme cold environment also automatically succeed on their saving throw.</p>
      <p>Saving throws made against effects or spells that deal cold damage have disadvantage.</p>`,
      crModifier: 1
    },
    extremeHeat: {
      name: 'A5E.encounterElements.extremeHeat',
      description: `<p>At the end of every hour a creature is exposed to temperatures at or above 100° Fahrenheit (38 Celsius), it makes a Constitution saving throw (DC 4 + 1 per hour spent in extreme heat) or suffers a level of fatigue. Resistance to fire damage, immunity to fire damage, or keeping a light pack (less than half carrying capacity) grants an automatic success on this save, whereas a creature wearing medium armor, heavy armor, or heavy clothing has disadvantage. Creatures native to an extreme heat environment also automatically succeed on their saving throw.</p>
      <p>Saving throws made against effects or spells that deal fire damage have disadvantage.</p>`,
      crModifier: 1
    },
    falling30: {
      name: 'A5E.encounterElements.falling30',
      description: '<p>The quickest way to severe harm (or even death) is from falling. Whether from a rooftop, cliff’s edge, treetop, or flying mount, falling can deal a devastating amount of damage. When a creature falls, it takes 1d6 bludgeoning damage for every 10 feet it falls (maximum 20d6) and lands prone.</p> equal to the distance it falls divided by 5).</p>',
      crModifier: 1
    },
    falling60: {
      name: 'A5E.encounterElements.falling60',
      description: '<p>The quickest way to severe harm (or even death) is from falling. Whether from a rooftop, cliff’s edge, treetop, or flying mount, falling can deal a devastating amount of damage. When a creature falls, it takes 1d6 bludgeoning damage for every 10 feet it falls (maximum 20d6) and lands prone.</p> equal to the distance it falls divided by 5).</p>',
      crModifier: 2
    },
    falling90: {
      name: 'A5E.encounterElements.falling90',
      description: '<p>The quickest way to severe harm (or even death) is from falling. Whether from a rooftop, cliff’s edge, treetop, or flying mount, falling can deal a devastating amount of damage. When a creature falls, it takes 1d6 bludgeoning damage for every 10 feet it falls (maximum 20d6) and lands prone.</p> equal to the distance it falls divided by 5).</p>',
      crModifier: 3
    },
    falling120: {
      name: 'A5E.encounterElements.falling120',
      description: '<p>The quickest way to severe harm (or even death) is from falling. Whether from a rooftop, cliff’s edge, treetop, or flying mount, falling can deal a devastating amount of damage. When a creature falls, it takes 1d6 bludgeoning damage for every 10 feet it falls (maximum 20d6) and lands prone.</p> equal to the distance it falls divided by 5).</p>',
      crModifier: 4
    },
    fire: {
      name: 'A5E.encounterElements.fire',
      description: '<p>An area of fire sheds bright light to 10 feet beyond its edges and dim light an additional 10 feet. A creature that touches fire takes 7 (2d6) ongoing fire damage. A creature may end ongoing damage from mundane fire by spending an action to extinguish the flames. Smoke and heat shimmer lightly obscure anything within or on the other side of an area of fire.</p>',
      crModifier: 2
    },
    frigidWater: {
      name: 'A5E.encounterElements.frigidWater',
      description: '<p>After being in frigid water for a number of minutes equal to its Constitution score, a creature makes a DC 10 Constitution saving throw at the end of each minute or it suffers a level of fatigue. Resistance or immunity to cold damage grants an automatic success on this save. Creatures native to an extreme cold environment also automatically succeed on their saving throw.',
      crModifier: 1
    },
    greenSlime: {
      name: 'A5E.encounterElements.greenSlime',
      description: `<p>This sticky, vibrantly green, slopping slime clings to and mercilessly eats away at flesh, plants, and even metal.</p>
      <p>Green slime covers a 5-foot square area or larger, though rarely greater in size than a 20-foot radius. Although it is alive and able to sense with blindsight to a range of 30 feet, green slime has no Intelligence or other ability scores. When green slime senses movement underneath it, it drops towards the ground. A creature in the green slime’s area makes a DC 10 Dexterity saving throw, becoming slimed on a failure.</p>
      <p>A slimed creature takes 5 (1d10) ongoing acid damage until the green slime is scraped off with an action. Green slime is destroyed by sunlight, any feature, spell, or trait that cures disease, or any amount of cold, fire, or radiant damage. Wood or metal exposed to green slime instead takes 11 (2d10) acid damage.</p>`,
      crModifier: 1
    },
    heavyPrecipitation: {
      name: 'A5E.encounterElements.heavyPrecipitation',
      description: '<p>Heavy snowfall makes an area lightly obscured, and Perception checks relying on sight are made with disadvantage. Heavy rain has the same effects, also affecting Perception checks that rely on hearing and extinguishing any open flames.</p>',
      crModifier: 0.5
    },
    highGravity: {
      name: 'A5E.encounterElements.highGravity',
      description: '<p>The ranges of ranged weapons are halved, as are all jump distances. When a creature makes its first attack in a round using a weapon that does not have the dual-wielding property, it makes a DC 12 Athletics check or subtracts 1d4 from its attack rolls for 1 round. Falling damage is treated as twice the distance in the area and there is no maximum amount of damage that can be taken from a fall. For every hour spent in the area, a creature not acclimated to it makes a Constitution saving throw (DC 8 + the number of hours spent in the area) or gain a level of fatigue (maximum 4 levels of fatigue).</p>',
      crModifier: 2
    },
    lava: {
      name: 'A5E.encounterElements.lava',
      description: '<p>A creature that touches lava takes 16 (3d10) ongoing fire damage. When a creature first enters into an area of lava or starts its turn there, it takes 33 (6d10) ongoing fire damage. A creature submerged in lava takes 55 (10d10) ongoing fire damage. This damage persists for 4 rounds after the creature leaves the lava. A creature ends all ongoing damage from lava by using its action to wipe away the molten rock.</p>',
      crModifier: 4
    },
    lowGravity: {
      name: 'A5E.encounterElements.lowGravity',
      description: '<p>The ranges of ranged weapons are doubled, as are all jump distances. Falling damage is treated as half the distance in the area. In addition, damage from bludgeoning weapons is reduced by half.</p>',
      crModifier: -1
    },
    magnetizedOre: {
      name: 'A5E.encounterElements.magnetizedOre',
      description: `<p>Magnetized ore wreaks havoc on the use of compasses or any natural sense of direction, making both useless within 500 feet.</p>
      <p>While within 50 feet of magnetized ore, a creature wearing heavy armor made from metal or attacking with a metal weapon has disadvantage on its attack rolls, Strength and Dexterity checks, and saving throws made against fatigue.</p>`,
      crModifier: 0.5
    },
    memoryCrystals: {
      name: 'A5E.encounterElements.memoryCrystals',
      description: `<p>Recognizing a memory crystal for what it is requires a DC 20 Arcana check. When a creature with prepared spells is within 30 feet of a memory crystal, at the start of its turn it must make a DC 15 spellcasting ability check or lose one randomly determined prepared spell.</p>
      <p>When destroyed (DC 17 Strength check, AC 7, 2 hit points) a memory crystal explodes with dangerous magic in a 10-foot radius. Each creature in the area makes a DC 20 Charisma saving throw, taking 14 (4d6) psychic damage on a failed save, or half as much damage on a successful one.</p>
      <p>An area filled with memory crystals requires a creature to succeed on a DC 8 Acrobatics check at the end of each of its turns to avoid breaking any of the dangerous gemstones.</p>`,
      crModifier: 0.5
    },
    miringGround: {
      name: 'A5E.encounterElements.miringGround',
      description: '<p>Sludge, tar, or sufficiently deep and sticky mud can provide real danger to creatures caught in them. Miring ground is difficult terrain. In addition, when a creature starts its turn in miring ground, it begins to sink and makes an Athletics check (DC 12 + 2 per round spent in the area) to continue moving. On a failure, its Speed is reduced by 10 feet. When this reduces a creature’s Speed to 5 feet or less it begins sinking 1 foot deeper into the miring ground at the end of each of its turns. A sinking creature can be freed with an Athletics check equal to the DC of its last failed check against the miring ground. A sinking creature that becomes submerged begins suffocating if it is unable to hold its breath. Any creature trying to aid a sinking creature must have a solid surface to stand on or a fly speed, but can use ropes or similar means to do so at a distance.</p>',
      crModifier: 3
    },
    poisonousPlants: {
      name: 'A5E.encounterElements.poisonousPlants',
      description: `<p>Spotting the telltale signs of dangerous vegetation requires a DC 15 Nature check. Poisonous plants can be as sparse as a few shrubs or as pervasive as fields of harmful groundcover.</p>
      <p>When a creature starts its turn within the area or enters the area for the first time on a turn, it makes a DC 10 Constitution saving throw, taking 3 (1d6) poison damage on a failure, or half damage on a success.</p>`,
      crModifier: 1
    },
    rushingLiquid: {
      name: 'A5E.encounterElements.rushingLiquid',
      description: '<p>Standing in rushing liquid halves the speed of a creature moving against the current and doubles the speed of creatures moving with it. At the start of each of its turns, a creature in knee-high rushing liquid makes an Acrobatics or Athletics check to keep its footing. On a failure, it is knocked prone and moves a number of feet in the direction of the current equal to the amount it failed the check by (rounded up to the nearest 5 feet). The check is DC 11 if the rushing liquid is knee-high, DC 14 if waist-high, DC 17 if chest-high, and DC 20 if the creature\'s feet cannot touch the bottom. A creature moving with the current has disadvantage on this check. A creature driven into a solid object by the current (such as a rock) takes damage as if it had fallen a number of feet equal to the distance it was moved by the current (minimum 1d6 bludgeoning, piercing, or slashing damage). Standing up from prone in rushing liquid requires an Acrobatics or Athletics check with a DC equal to DC to keep footing. A creature that loses its footing is considered underwater (see below) until it regains its footing.</p>',
      crModifier: 2
    },
    strongWinds: {
      name: 'A5E.encounterElements.strongWinds',
      description: '<p>Ranged weapon attacks and Perception checks that rely on hearing have disadvantage in high winds. In addition, it extinguishes any open flames, disperses fogs and smoke, and forces any flying creature to land before the end of its turn or fall.</p>',
      crModifier: 0.5
    },
    underwater: {
      name: 'A5E.encounterElements.underwater',
      description: '<p>A creature that cannot breathe water begins to suffocate underwater once it cannot hold its breath. In addition, creatures without swim speeds have disadvantage on attacks made using any weapon other than a dagger, dueling dagger, javelin, shortsword, spear, or trident. Ranged weapon attacks automatically miss beyond their normal range underwater, and bludgeoning and fire damage are halved. A creature that takes damage while holding its breath underwater must succeed on a concentration check or immediately begin suffocating as if its breath had run out.</p>',
      crModifier: 1
    },
    vacuum: {
      name: 'A5E.encounterElements.vacuum',
      description: '<p>An area of vacuum has no air, so creatures that need to breathe must use another source of air or begin to suffocate once they cannot hold their breath. In addition, the area carries no sound, so hearing-based checks made to perceive automatically fail and spells with vocalized components cannot be cast. A creature with its own air supply may cast spells with vocalized components, but still cannot hear. Vacuum is also utterly chilling, dealing 11 (3d6) cold damage to a creature at the start of each of its turns in the area.</p>',
      crModifier: 3
    },
    webs: {
      name: 'A5E.encounterElements.webs',
      description: `<p>Whether created by massive insects or swarms of smaller creatures, these sticky strands ensnare and capture creatures that fall afoul of them. An area of webs is difficult terrain, and when a creature starts its turn within the area or enters the area for the first time on a turn, it makes a DC 12 Dexterity saving throw or becomes restrained. Restrained creatures can use an action to make a DC 12 Acrobatics or Athletics check, escaping on a success.</p>
      <p>A 10-foot cube of webs has AC 10, 15 hit points, vulnerability to fire, and immunity to bludgeoning, piercing, and psychic damage.</p>`,
      crModifier: 0.5
    },
    yellowMold: {
      name: 'A5E.encounterElements.yellowMold',
      description: `<p>This sickeningly yellow mold only grows in dark places and is extremely sensitive to movement nearby.</p>
      <p>Yellow mold covers a 10-foot radius area. When a creature moves within 30 feet of a patch of yellow mold, at the start of its turn spores are released and it makes a DC 15 Constitution saving throw. On a failure, the creature takes 11 (2d10) ongoing poison damage and becomes poisoned for 1 minute, continuing to take ongoing damage until it is no longer poisoned. At the end of each of its turns, the poisoned creature can repeat the saving throw, ending the effect on itself on a success.</p>
      <p>Yellow mold is destroyed by sunlight or any amount of fire damage.</p>`,
      crModifier: 2
    }
  };
}
