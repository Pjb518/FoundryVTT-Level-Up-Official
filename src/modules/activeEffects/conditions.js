import { changes, flags } from './conditionsConfig';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                     Conditions Object
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export default function setupConditions() {
  const conditions = Object.keys(CONFIG.A5E.conditions);
  const settings = conditions.map((c) => game.settings.get('a5e', `enableCondition${c.capitalize()}`));

  console.log(settings);

  // Replace default conditions with system specific conditions.
  CONFIG.statusEffects = getConditions();

  // Setup Hook to apply sub-conditions
  Hooks.on('preCreateActiveEffect', (conditionData) => {
    const token = conditionData?.parent;

    console.log(conditionData);

    // Guards
    if (!token) return;
    if (!conditions.includes(conditionData.flags?.core?.statusId)) return;
    if (!conditionData.flags?.a5e?.conditions) return;

    // Set other conditions
    conditionData.flags.a5e.conditions.forEach((c) => {
      const effect = CONFIG.statusEffects.find((e) => e.id === c);
      console.log(effect);

      token.toggleActiveEffect(effect, { active: true });
    });
  });
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                     Conditions Object
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function getConditions() {
  return [
  // Blinded
    {
      id: 'blinded',
      label: 'A5E.ConditionBlinded',
      icon: 'icons/svg/blind.svg',
      // TODO: Impose adv and disadv on attacks.
      changes: game.settings.get('a5e', 'enableConditionBlinded') ? changes.blinded : [],
      duration: {},
      flags: game.settings.get('a5e', 'enableConditionBlinded') ? flags.blinded : {}
    },
    // Bloodied
    {
      id: 'bloodied',
      label: 'A5E.ConditionBloodied',
      icon: 'icons/svg/blood.svg',
      changes: [],
      duration: {}
    },
    // Charmed
    {
      id: 'charmed',
      label: 'A5E.ConditionCharmed',
      icon: 'icons/magic/symbols/arrowhead-green.webp',
      changes: [],
      duration: {}
    },
    // Concentration
    {
      id: 'concentration',
      label: 'A5E.ConditionConcentration',
      icon: 'icons/magic/symbols/runes-star-blue .webp',
      changes: [],
      duration: {}
    },
    // Confused
    {
      id: 'confused',
      label: 'A5E.ConditionConfused',
      icon: 'icons/svg/stoned.svg',
      changes: [],
      duration: {}
    },
    // Deafened
    {
      id: 'deafened',
      label: 'A5E.ConditionDeafened',
      icon: 'icons/svg/deaf.svg',
      changes: [],
      duration: {}
    },
    // Doomed
    {
      id: 'doomed',
      label: 'A5E.ConditionDoomed',
      icon: 'icons/svg/skull.svg',
      changes: [],
      duration: {}
    },
    // Encumbered
    {
      id: 'encumbered',
      label: 'A5E.ConditionEncumbered',
      icon: 'icons/svg/downgrade.svg',
      changes: game.settings.get('a5e', 'enableConditionEncumbered') ? changes.encumbered : [],
      duration: {},
      flags: game.settings.get('a5e', 'enableConditionEncumbered') ? flags.encumbered : {}
    },
    // Fatigue
    {
      id: 'fatigue',
      label: 'A5E.ConditionFatigue',
      icon: 'icons/magic/symbols/circle-ouroboros.webp',
      changes: game.settings.get('a5e', 'enableConditionFatigue') ? changes.fatigue : [],
      duration: {},
      flags: game.settings.get('a5e', 'enableConditionFatigue') ? flags.fatigue : {}
    },
    // Frightened
    {
      id: 'frightened',
      label: 'A5E.ConditionFrightened',
      icon: 'icons/svg/terror.svg',
      changes: game.settings.get('a5e', 'enableConditionFrightened') ? changes.frightened : [],
      duration: {},
      flags: game.settings.get('a5e', 'enableConditionFrightened') ? flags.frightened : {}
    },
    // Grappled
    {
      id: 'grappled',
      label: 'A5E.ConditionGrappled',
      icon: 'icons/magic/symbols/clover-luck-white-green.webp',
      changes: game.settings.get('a5e', 'enableConditionGrappled') ? changes.grappled : [],
      duration: {},
      flags: game.settings.get('a5e', 'enableConditionGrappled') ? flags.grappled : {}
    },
    // Incapacitated
    {
      id: 'incapacitated',
      label: 'A5E.ConditionIncapacitated',
      icon: 'icons/magic/symbols/cog-orange-red.webp',
      changes: [],
      duration: {}
    },
    // Invisible
    {
      id: 'invisible',
      label: 'A5E.ConditionInvisible',
      icon: 'icons/svg/invisible.svg',
      changes: game.settings.get('a5e', 'enableConditionInvisible') ? changes.invisible : [],
      duration: {},
      flags: game.settings.get('a5e', 'enableConditionInvisible') ? flags.invisible : {}
    },
    // Paralyzed
    {
      id: 'paralyzed',
      label: 'A5E.ConditionParalyzed',
      icon: 'icons/svg/paralysis.svg',
      changes: game.settings.get('a5e', 'enableConditionParalyzed') ? changes.paralyzed : [],
      duration: {},
      flags: game.settings.get('a5e', 'enableConditionParalyzed') ? flags.paralyzed : {}
    },
    // Petrified
    {
      id: 'petrified',
      label: 'A5E.ConditionPetrified',
      icon: 'icons/skills/wounds/injury-body-pain-gray.webp',
      changes: game.settings.get('a5e', 'enableConditionPetrified') ? changes.petrified : [],
      duration: {},
      flags: game.settings.get('a5e', 'enableConditionPetrified') ? flags.petrified : {}
    },
    // Poisoned
    {
      id: 'poisoned',
      label: 'A5E.ConditionPoisoned',
      icon: 'icons/svg/poison.svg',
      changes: game.settings.get('a5e', 'enableConditionPoisoned') ? changes.poisoned : [],
      duration: {},
      flags: game.settings.get('a5e', 'enableConditionPoisoned') ? flags.poisoned : {}
    },
    // Prone
    {
      id: 'prone',
      label: 'A5E.ConditionProne',
      icon: 'icons/svg/falling.svg',
      changes: game.settings.get('a5e', 'enableConditionProne') ? changes.prone : [],
      duration: {},
      flags: game.settings.get('a5e', 'enableConditionProne') ? flags.prone : {}
    },
    // Rattled
    {
      id: 'rattled',
      label: 'A5E.ConditionRattled',
      icon: 'icons/skills/wounds/injury-face-impact-orange.webp',
      changes: game.settings.get('a5e', 'enableConditionRattled') ? changes.rattled : [],
      duration: {},
      flags: game.settings.get('a5e', 'enableConditionRattled') ? flags.rattled : {}
    },
    // Restrained
    {
      id: 'restrained',
      label: 'A5E.ConditionRestrained',
      icon: 'icons/svg/net.svg',
      changes: game.settings.get('a5e', 'enableConditionRestrained') ? changes.restrained : [],
      duration: {},
      flags: game.settings.get('a5e', 'enableConditionRestrained') ? flags.restrained : {}
    },
    // Slowed
    {
      id: 'slowed',
      label: 'A5E.ConditionSlowed',
      icon: 'icons/magic/symbols/cog-shield-white-blue.webp',
      changes: game.settings.get('a5e', 'enableConditionSlowed') ? changes.slowed : [],
      duration: {},
      flags: game.settings.get('a5e', 'enableConditionSlowed') ? flags.slowed : {}
    },

    // Strife
    {
      id: 'strife',
      label: 'A5E.ConditionStrife',
      icon: 'icons/magic/symbols/cog-glowing-green.webp',
      changes: game.settings.get('a5e', 'enableConditionStrife') ? changes.strife : [],
      duration: {},
      flags: game.settings.get('a5e', 'enableConditionStrife') ? flags.strife : {}
    },
    // Stunned
    {
      id: 'stunned',
      label: 'A5E.ConditionStunned',
      icon: 'icons/svg/daze.svg',
      changes: game.settings.get('a5e', 'enableConditionStunned') ? changes.stunned : [],
      duration: {},
      flags: game.settings.get('a5e', 'enableConditionStunned') ? flags.stunned : {}
    },
    // Unconscious
    {
      id: 'unconscious',
      label: 'A5E.ConditionUnconscious',
      icon: 'icons/svg/unconscious.svg',
      changes: game.settings.get('a5e', 'enableConditionUnconscious') ? changes.unconscious : [],
      duration: {},
      flags: game.settings.get('a5e', 'enableConditionUnconscious') ? flags.unconscious : {}
    }
  ];
}
