import { changes, flags } from './conditionsConfig';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                     Conditions Object
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export default function setupConditions() {
  const conditions = Object.keys(CONFIG.A5E.conditions);

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
  const enabledConditions = game.settings.get('a5e', 'automatedConditions');
  return [
  // Blinded
    {
      id: 'blinded',
      label: 'A5E.ConditionBlinded',
      icon: 'icons/svg/blind.svg',
      // TODO: Impose adv and disadv on attacks.
      changes: changes.blinded,
      duration: {},
      flags: { a5e: flags.blinded }
    },
    // Bloodied
    {
      id: 'bloodied',
      label: 'A5E.ConditionBloodied',
      icon: 'icons/svg/blood.svg',
      changes: [],
      duration: {},
      flags: { a5e: {} }
    },
    // Charmed
    {
      id: 'charmed',
      label: 'A5E.ConditionCharmed',
      icon: 'icons/magic/symbols/arrowhead-green.webp',
      changes: [],
      duration: {},
      flags: { a5e: {} }
    },
    // Concentration
    {
      id: 'concentration',
      label: 'A5E.ConditionConcentration',
      icon: 'icons/magic/symbols/runes-star-blue .webp',
      changes: [],
      duration: {},
      flags: { a5e: {} }
    },
    // Confused
    {
      id: 'confused',
      label: 'A5E.ConditionConfused',
      icon: 'icons/svg/stoned.svg',
      changes: [],
      duration: {},
      flags: { a5e: {} }
    },
    // Deafened
    {
      id: 'deafened',
      label: 'A5E.ConditionDeafened',
      icon: 'icons/svg/deaf.svg',
      changes: [],
      duration: {},
      flags: { a5e: {} }
    },
    // Doomed
    {
      id: 'doomed',
      label: 'A5E.ConditionDoomed',
      icon: 'icons/svg/skull.svg',
      changes: [],
      duration: {},
      flags: { a5e: {} }
    },
    // Encumbered
    {
      id: 'encumbered',
      label: 'A5E.ConditionEncumbered',
      icon: 'icons/svg/downgrade.svg',
      changes: changes.encumbered,
      duration: {},
      flags: { a5e: flags.encumbered }
    },
    // Fatigue
    {
      id: 'fatigue',
      label: 'A5E.ConditionFatigue',
      icon: 'icons/magic/symbols/circle-ouroboros.webp',
      changes: changes.fatigue,
      duration: {},
      flags: { a5e: flags.fatigue }
    },
    // Frightened
    {
      id: 'frightened',
      label: 'A5E.ConditionFrightened',
      icon: 'icons/svg/terror.svg',
      changes: changes.frightened,
      duration: {},
      flags: { a5e: flags.frightened }
    },
    // Grappled
    {
      id: 'grappled',
      label: 'A5E.ConditionGrappled',
      icon: 'icons/magic/symbols/clover-luck-white-green.webp',
      changes: changes.grappled,
      duration: {},
      flags: { a5e: flags.grappled }
    },
    // Incapacitated
    {
      id: 'incapacitated',
      label: 'A5E.ConditionIncapacitated',
      icon: 'icons/magic/symbols/cog-orange-red.webp',
      changes: [],
      duration: {},
      flags: { a5e: {} }
    },
    // Invisible
    {
      id: 'invisible',
      label: 'A5E.ConditionInvisible',
      icon: 'icons/svg/invisible.svg',
      changes: changes.invisible,
      duration: {},
      flags: { a5e: flags.invisible }
    },
    // Paralyzed
    {
      id: 'paralyzed',
      label: 'A5E.ConditionParalyzed',
      icon: 'icons/svg/paralysis.svg',
      changes: changes.paralyzed,
      duration: {},
      flags: { a5e: flags.paralyzed }
    },
    // Petrified
    {
      id: 'petrified',
      label: 'A5E.ConditionPetrified',
      icon: 'icons/skills/wounds/injury-body-pain-gray.webp',
      changes: changes.petrified,
      duration: {},
      flags: { a5e: flags.petrified }
    },
    // Poisoned
    {
      id: 'poisoned',
      label: 'A5E.ConditionPoisoned',
      icon: 'icons/svg/poison.svg',
      changes: changes.poisoned,
      duration: {},
      flags: { a5e: flags.poisoned }
    },
    // Prone
    {
      id: 'prone',
      label: 'A5E.ConditionProne',
      icon: 'icons/svg/falling.svg',
      changes: changes.prone,
      duration: {},
      flags: { a5e: flags.prone }
    },
    // Rattled
    {
      id: 'rattled',
      label: 'A5E.ConditionRattled',
      icon: 'icons/skills/wounds/injury-face-impact-orange.webp',
      changes: changes.rattled,
      duration: {},
      flags: { a5e: flags.rattled }
    },
    // Restrained
    {
      id: 'restrained',
      label: 'A5E.ConditionRestrained',
      icon: 'icons/svg/net.svg',
      changes: changes.restrained,
      duration: {},
      flags: { a5e: flags.restrained }
    },
    // Slowed
    {
      id: 'slowed',
      label: 'A5E.ConditionSlowed',
      icon: 'icons/magic/symbols/cog-shield-white-blue.webp',
      changes: changes.slowed,
      duration: {},
      flags: { a5e: flags.slowed }
    },

    // Strife
    {
      id: 'strife',
      label: 'A5E.ConditionStrife',
      icon: 'icons/magic/symbols/cog-glowing-green.webp',
      changes: changes.strife,
      duration: {},
      flags: { a5e: flags.strife }
    },
    // Stunned
    {
      id: 'stunned',
      label: 'A5E.ConditionStunned',
      icon: 'icons/svg/daze.svg',
      changes: changes.stunned,
      duration: {},
      flags: { a5e: flags.stunned }
    },
    // Unconscious
    {
      id: 'unconscious',
      label: 'A5E.ConditionUnconscious',
      icon: 'icons/svg/unconscious.svg',
      changes: changes.unconscious,
      duration: {},
      flags: { a5e: flags.unconscious }
    }
  ].map((c) => {
    if (!enabledConditions.includes(c.id)) {
      c.changes = [];
      c.flags.a5e.rollModifiers = {};
    }

    return c;
  });
}
