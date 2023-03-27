/* eslint-disable prefer-rest-params */
/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import { changes, flags } from './conditionsConfig';
import automateBloodied from './utils/bloodied';
import { addSubConditions, removeSubConditions } from './utils/subConditions';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                     Conditions Object
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export default function setupConditions() {
  // Replace default conditions with system specific conditions.
  CONFIG.statusEffects = getConditions();

  // Setup Hook to apply sub-conditions
  Hooks.on('createActiveEffect', addSubConditions);

  // Setup Hook to remove sub-conditions
  Hooks.on('deleteActiveEffect', removeSubConditions);

  // Apply Bloodied Condition.
  Hooks.on('updateActor', automateBloodied);
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
      icon: 'systems/a5e/assets/icons/charmed.svg',
      changes: [],
      duration: {},
      flags: { a5e: {} }
    },
    // Concentration
    {
      id: 'concentration',
      label: 'A5E.ConditionConcentration',
      icon: 'systems/a5e/assets/icons/concentration.svg',
      changes: [],
      duration: {},
      flags: { a5e: {} }
    },
    // Confused
    {
      id: 'confused',
      label: 'A5E.ConditionConfused',
      icon: 'systems/a5e/assets/icons/confused.svg',
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
    // Deafened
    {
      id: 'defeated',
      label: 'A5E.ConditionDefeated',
      icon: 'icons/svg/skull.svg',
      changes: [],
      duration: {},
      flags: { a5e: {} }
    },
    // Doomed
    {
      id: 'doomed',
      label: 'A5E.ConditionDoomed',
      icon: 'systems/a5e/assets/icons/doomed.svg',
      changes: [],
      duration: {},
      flags: { a5e: {} }
    },
    // Encumbered
    {
      id: 'encumbered',
      label: 'A5E.ConditionEncumbered',
      icon: 'systems/a5e/assets/icons/encumbered.svg',
      changes: changes.encumbered,
      duration: {},
      flags: { a5e: flags.encumbered }
    },
    // Fatigue
    {
      id: 'fatigue',
      label: 'A5E.ConditionFatigue',
      icon: 'systems/a5e/assets/icons/fatigue.svg',
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
      icon: 'systems/a5e/assets/icons/grappled.svg',
      changes: changes.grappled,
      duration: {},
      flags: { a5e: flags.grappled }
    },
    // Incapacitated
    {
      id: 'incapacitated',
      label: 'A5E.ConditionIncapacitated',
      icon: 'systems/a5e/assets/icons/incapacitated.svg',
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
      icon: 'systems/a5e/assets/icons/petrified.svg',
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
      icon: 'systems/a5e/assets/icons/rattled.svg',
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
      icon: 'systems/a5e/assets/icons/slowed.svg',
      changes: changes.slowed,
      duration: {},
      flags: { a5e: flags.slowed }
    },

    // Strife
    {
      id: 'strife',
      label: 'A5E.ConditionStrife',
      icon: 'systems/a5e/assets/icons/strife.svg',
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
      flags: {
        core: { overlay: true },
        a5e: flags.unconscious
      }
    },
    {
      id: 'generic1',
      label: 'A5E.ConditionGeneric1',
      icon: 'icons/magic/light/explosion-star-small-blue-yellow.webp',
      changes: [],
      duration: {},
      flags: { a5e: {} }
    },
    {
      id: 'generic2',
      label: 'A5E.ConditionGeneric2',
      icon: 'icons/magic/light/explosion-star-small-orange.webp',
      changes: [],
      duration: {},
      flags: { a5e: {} }
    },
    {
      id: 'generic3',
      label: 'A5E.ConditionGeneric3',
      icon: 'icons/magic/light/explosion-star-small-pink.webp',
      changes: [],
      duration: {},
      flags: { a5e: {} }
    },
    {
      id: 'generic4',
      label: 'A5E.ConditionGeneric4',
      icon: 'icons/magic/light/explosion-star-small-teal.webp',
      changes: [],
      duration: {},
      flags: { a5e: {} }
    },
    {
      id: 'generic5',
      label: 'A5E.ConditionGeneric5',
      icon: 'icons/magic/light/explosion-star-small-teal-purple.webp',
      changes: [],
      duration: {},
      flags: { a5e: {} }
    }
  ].map((c) => {
    if (!enabledConditions.includes(c.id)) {
      if (c.changes.length !== 0) { c.changes = []; }
      if (c.flags.a5e.rollModifiers) { c.flags.a5e.rollModifiers = {}; }
    }

    return c;
  });
}
