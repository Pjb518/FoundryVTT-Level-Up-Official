import registerConditionsConfig from '../config/registerConditionsConfig';
import { changes, flags } from './conditionsConfig';
import { addSubConditions, removeSubConditions, preventIfSourceActivated } from './utils/subConditions';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                     Conditions Object
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export default function setupConditions() {
  // Replace default conditions with system specific conditions.
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  // CONFIG.statusEffects = getConditions();
  CONFIG.statusEffects = registerConditionsConfig(CONFIG.A5E);

  // Setup Hook to apply sub-conditions
  Hooks.on('createActiveEffect', addSubConditions);

  // Setup Hook to prevent deletion of condition id source is active
  Hooks.on('preDeleteActiveEffect', preventIfSourceActivated);

  // Setup Hook to remove sub-conditions
  Hooks.on('deleteActiveEffect', removeSubConditions);

  // Apply Bloodied & Unconscious Condition (Moved to actor).
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                     Conditions Object
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function getConditions() {
  const enabledConditions = new Set(game.settings.get('a5e', 'automatedConditions'));
  return [
    // Blinded
    {
      id: 'blinded',
      label: 'A5E.ConditionBlinded',
      icon: 'icons/svg/blind.svg',
      changes: changes.blinded,
      duration: {},
      flags: { a5e: flags.blinded }
    },
    // Bloodied
    {
      id: 'bloodied',
      label: 'A5E.ConditionBloodied',
      icon: 'icons/svg/blood.svg',
      changes: changes.bloodied,
      duration: {},
      flags: { a5e: {} }
    },
    // Charmed
    {
      id: 'charmed',
      label: 'A5E.ConditionCharmed',
      icon: 'systems/a5e/assets/icons/charmed.svg',
      changes: changes.charmed,
      duration: {},
      flags: { a5e: {} }
    },
    // Concentration
    {
      id: 'concentration',
      label: 'A5E.ConditionConcentration',
      icon: 'systems/a5e/assets/icons/concentration.svg',
      changes: changes.concentration,
      duration: {},
      flags: { a5e: {} }
    },
    // Confused
    {
      id: 'confused',
      label: 'A5E.ConditionConfused',
      icon: 'systems/a5e/assets/icons/confused.svg',
      changes: changes.confused,
      duration: {},
      flags: { a5e: {} }
    },
    // Deafened
    {
      id: 'deafened',
      label: 'A5E.ConditionDeafened',
      icon: 'icons/svg/deaf.svg',
      changes: changes.deafened,
      duration: {},
      flags: { a5e: {} }
    },
    // Dead
    {
      id: 'dead',
      label: 'EFFECT.StatusDead',
      icon: 'icons/svg/skull.svg',
      changes: changes.dead,
      duration: {},
      flags: { core: { overlay: true }, a5e: {} }
    },
    // Doomed
    {
      id: 'doomed',
      label: 'A5E.ConditionDoomed',
      icon: 'systems/a5e/assets/icons/doomed.svg',
      changes: changes.doomed,
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
      changes: changes.incapacitated,
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
    // Assign icon
    c.icon = CONFIG.A5E.ConditionIcons[c.id] ?? c.icon;
    if (!enabledConditions.has(c.id)) {
      if (c.changes.length !== 0) { c.changes = []; }
    }

    return c;
  });
}
