export default function registerConsumerConfig(A5E) {
  A5E.configurableConsumers = new Set([
    'actionUses', 'itemUses', 'hitDice', 'spell'
  ]);

  A5E.resourceConsumerConfig = {
    exertion: { path: 'attributes.exertion.current', label: 'A5E.Exertion', type: 'value' },
    hp: { path: 'attributes.hp.value', label: 'A5E.HitPoints', type: 'value' },
    inspiration: { path: 'attributes.inspiration', label: 'A5E.Inspiration', type: 'boolean' },
    primaryResource: { path: 'resources.primary.value', label: 'A5E.ResourcesPrimary', type: 'value' },
    secondaryResource: { path: 'resources.secondary.value', label: 'A5E.ResourcesSecondary', type: 'value' },
    tertiaryResource: { path: 'resources.tertiary.value', label: 'A5E.ResourcesTertiary', type: 'value' },
    quaternaryResource: { path: 'resources.quaternary.value', label: 'A5E.ResourcesQuaternary', type: 'value' }

  };

  A5E.spellConsumerModes = {
    variable: 'A5E.ConsumerSpellModeVariable',
    pointsOnly: 'A5E.ConsumerSpellModePointsOnly',
    slotsOnly: 'A5E.ConsumerSpellModeSlotsOnly'
  };
}
