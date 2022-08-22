/* eslint-disable prefer-rest-params */
/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
import { changes, flags } from './conditionsConfig';

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

  // Change Default Conditions Interface
  const HUDRender = function (wrapped, ...args) {
    return wrapped(...args).then(() => {
      alterConditionInterface.call(this, this.element);
    });
  };

  // Optionally use libWrapper
  if (game.modules.get('lib-wrapper')?.active) {
    libWrapper.register('a5e', 'TokenHUD.prototype._render', HUDRender, 'WRAPPER');
    libWrapper.register('a5e', 'TokenHUD.prototype._getStatusEffectChoices', sortConditions, 'WRAPPER');
  } else {
    const defaultRender = TokenHUD.prototype._render;
    TokenHUD.prototype._render = function () {
      return HUDRender.call(this, defaultRender.bind(this), ...arguments);
    };

    const defaultChoices = TokenHUD.prototype._getStatusEffectChoices;
    TokenHUD.prototype._getStatusEffectChoices = function () {
      return sortConditions.call(this, defaultChoices.bind(this), ...arguments);
    };
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                    Create Active Effect
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
async function addSubConditions(conditionData) {
  const conditions = Object.keys(CONFIG.A5E.conditions);
  const token = conditionData?.parent?.parent;

  // Guards
  if (!token) return;
  if (!conditions.includes(conditionData.flags?.core?.statusId)) return;
  if (!conditionData.flags?.a5e?.conditions) return;

  // Set other conditions
  for (const c of conditionData.flags.a5e.conditions) {
    const effect = CONFIG.statusEffects.find((e) => e.id === c);
    await token.toggleActiveEffect(effect, { active: true });
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                    Delete Active Effect
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
async function removeSubConditions(conditionData) {
  const conditions = Object.keys(CONFIG.A5E.conditions);
  const token = conditionData?.parent?.parent;

  // Guards
  if (!token) return;
  if (!conditions.includes(conditionData.flags?.core?.statusId)) return;
  if (!conditionData.flags?.a5e?.conditions) return;

  // Set other conditions
  for (const c of conditionData.flags.a5e.conditions) {
    const effect = CONFIG.statusEffects.find((e) => e.id === c);
    await token.toggleActiveEffect(effect, { active: false });
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                    Sort Conditions
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function sortConditions(wrapped, ...args) {
  CONFIG.statusEffects = CONFIG.statusEffects.sort((a, b) => {
    const aid = (a.label !== undefined ? game.i18n.localize(a.label) : a.id || a);
    const bid = (b.label !== undefined ? game.i18n.localize(b.label) : b.id || b);
    // eslint-disable-next-line no-nested-ternary
    return (aid > bid ? 1 : (aid < bid ? -1 : 0));
  });

  return wrapped(...args);
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                    Conditions Interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
async function alterConditionInterface($html) {
  for (const img of $('.status-effects > img')) {
    const src = $(img).attr('src');
    if (src === '') {
      $(img).css({ visibility: 'hidden' });
    } else {
      const title = $(img).attr('title') || $(img).attr('data-condition');
      $('<div>')
        .addClass('condition-container')
        .attr('title', title)
        .insertAfter(img)
        .append(img)
        .append($('<div>')
          .addClass('condition-name')
          .html(title));
    }
  }

  $('.status-effects', $html).append(
    $('<div>')
      .addClass('clear-all-conditions')
      .html(`<i class="fa-solid fa-octagon-xmark"></i> ${game.i18n.localize('A5E.UIClearAll')}`)
      .click($.proxy(clearAllConditions, this))
  );
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                     Clear All Conditions
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
async function clearAllConditions(event) {
  event.stopPropagation();
  const conditions = this._getStatusEffectChoices();
  for (const condition of Object.values(conditions)) {
    if (condition.isActive) {
      await this.object.toggleEffect({ id: condition.id, icon: condition.src });
    }
  }
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
      flags: { a5e: flags.unconscious }
    }
  ].map((c) => {
    if (!enabledConditions.includes(c.id)) {
      if (c.changes.length !== 0) { c.changes = []; }
      if (c.flags.a5e.rollModifiers) { c.flags.a5e.rollModifiers = {}; }
    }

    return c;
  });
}
