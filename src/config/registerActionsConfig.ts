export default function registerActionsConfig() {
  // =================================================
  //  Consumers
  // =================================================

  // =================================================
  //  Consumers
  // =================================================
  const ACTION_CONSUMER_TYPES = [
    'actionUses', 'ammunition', 'hitDice', 'itemUses', 'quantity', 'resource', 'spell'
  ] as const;

  const SPELL_CONSUMER_MODES = [
    'variable', 'chargesOnly', 'inventionsOnly', 'slotsOnly', 'pointsOnly'
  ] as const;

  const configurableConsumers = new Set([
    'actionUses', 'itemUses', 'hitDice', 'spell'
  ]);

  const resourceConsumerConfig = {
    classResource: { path: 'resources.classResources', label: 'Class Resource', type: 'value' },
    exertion: { path: 'attributes.exertion.current', label: 'A5E.Exertion', type: 'value' },
    hp: { path: 'attributes.hp.value', label: 'A5E.HitPoints', type: 'value' },
    inspiration: { path: 'attributes.inspiration', label: 'A5E.Inspiration', type: 'boolean' },
    primaryResource: { path: 'resources.primary.value', label: 'A5E.ResourcesPrimary', type: 'value' },
    secondaryResource: { path: 'resources.secondary.value', label: 'A5E.ResourcesSecondary', type: 'value' },
    tertiaryResource: { path: 'resources.tertiary.value', label: 'A5E.ResourcesTertiary', type: 'value' },
    quaternaryResource: { path: 'resources.quaternary.value', label: 'A5E.ResourcesQuaternary', type: 'value' }

  };

  const spellConsumerModes = {
    variable: 'A5E.ConsumerSpellModeVariable',
    chargesOnly: 'A5E.ConsumerSpellModeChargesOnly',
    inventionsOnly: 'A5E.ConsumerSpellModeInventionsOnly',
    pointsOnly: 'A5E.ConsumerSpellModePointsOnly',
    slotsOnly: 'A5E.ConsumerSpellModeSlotsOnly'
  };

  return {
    // Constants
    ACTION_CONSUMER_TYPES,
    SPELL_CONSUMER_MODES,

    // Config
    configurableConsumers,
    resourceConsumerConfig,
    spellConsumerModes
  };
}
