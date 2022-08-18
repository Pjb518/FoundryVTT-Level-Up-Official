/* eslint-disable no-underscore-dangle */
import { changes, flags } from './conditionsConfig';

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                     Conditions Object
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export default function setupConditions() {
  const conditions = Object.keys(CONFIG.A5E.conditions);

  // Replace default conditions with system specific conditions.
  CONFIG.statusEffects = getConditions();

  // Setup Hook to apply sub-conditions
  Hooks.on('createActiveEffect', (conditionData) => {
    const token = conditionData?.parent?.parent;

    // Guards
    if (!token) return;
    if (!conditions.includes(conditionData.flags?.core?.statusId)) return;
    if (!conditionData.flags?.a5e?.conditions) return;

    // Set other conditions
    conditionData.flags.a5e.conditions.forEach((c) => {
      const effect = CONFIG.statusEffects.find((e) => e.id === c);
      token.toggleActiveEffect(effect, { active: true });
    });
  });

  // Setup Hook to remove sub-conditions
  Hooks.on('deleteActiveEffect', (conditionData) => {
    const token = conditionData?.parent?.parent;

    // Guards
    if (!token) return;
    if (!conditions.includes(conditionData.flags?.core?.statusId)) return;
    if (!conditionData.flags?.a5e?.conditions) return;

    // Set other conditions
    conditionData.flags.a5e.conditions.forEach((c) => {
      const effect = CONFIG.statusEffects.find((e) => e.id === c);
      token.toggleActiveEffect(effect, { active: false });
    });
  });

  // Change Default Conditions Interface
  const HUDRender = function (wrapped, ...args) {
    return wrapped(...args).then(() => {
      alterConditionInterface.call(this, this.element);
    });
  };

  // TODO: Optionally use libWrapper
  // libWrapper.register('a5e', 'TokenHUD.prototype._render', HUDRender, 'WRAPPER');
  const defaultRender = TokenHUD.prototype._render;
  // eslint-disable-next-line func-names
  TokenHUD.prototype._render = function () {
    // eslint-disable-next-line prefer-rest-params
    return HUDRender.call(this, defaultRender.bind(this), ...arguments);
  };
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                    Conditions Interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
async function alterConditionInterface($html) {
  // eslint-disable-next-line no-restricted-syntax
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
function clearAllConditions() {
  const conditions = this._getStatusEffectChoices();
  // eslint-disable-next-line no-restricted-syntax
  for (const condition of Object.values(conditions)) {
    if (condition.isActive) {
      this.object.toggleEffect({ id: condition.id, icon: condition.src });
    }
  }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                     Sort Conditions
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function sortConditions() {

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
