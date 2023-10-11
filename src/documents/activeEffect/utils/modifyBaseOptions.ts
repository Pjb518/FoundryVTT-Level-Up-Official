// @ts-nocheck
import MODES from './effectModes';

// const [sampleValue, modes, effectOpts, componentType, phase] = specialOptions[key];
export default function modifyBaseOptions(options: Object) {
  // Setup options for boolean values
  options['system.attributes.inspiration'] = [false, MODES.OVERRIDE_ONLY, [[true, 'Has Inspiration'], [false, "Doesn't have Inspiration"]], 'RADIO'];
  options['system.attributes.exertion.recoverOnRest'] = [false, MODES.OVERRIDE_ONLY, [[true, 'Can Recover'], [false, 'Cannot recover']], 'RADIO'];
  options['system.attributes.movement.traits.hover'] = [false, MODES.OVERRIDE_ONLY, [[true, 'Can Hover'], [false, 'Cannot Hover']], 'RADIO'];
  options['system.attributes.senses.blindsight.otherwiseBlind'] = [false, MODES.OVERRIDE_ONLY, [[true, 'Blind Beyond Vision'], [false, 'Normal Vision']], 'RADIO'];
  options['system.details.elite'] = [false, MODES.OVERRIDE_ONLY, [[true, 'Elite Monster'], [false, 'Normal Monster']], 'RADIO'];
  options['system.details.isSwarm'] = [false, MODES.OVERRIDE_ONLY, [[true, 'Is Swarm'], [false, 'Not a Swarm']], 'RADIO'];

  // Setup options for abilities and skills
  Object.keys(CONFIG.A5E.abilities)
    .forEach((a) => {
      options[`system.abilities.${a}.save.proficient`] = [false, MODES.OVERRIDE_ONLY, [[true, 'Proficient'], [false, 'Not Proficient']], 'RADIO'];
    });

  Object.keys(CONFIG.A5E.skills)
    .forEach((s) => {
      options[`system.skills.${s}.proficient`] = [false, MODES.OVERRIDE_ONLY, [[true, 'Proficient'], [false, 'Not Proficient']], 'RADIO'];
      options[`system.skills.${s}.ability`] = ['', MODES.OVERRIDE_ONLY, [...Object.entries(CONFIG.A5E.abilities), ['@attributes.spellcasting', 'Spellcasting']], 'RADIO'];
    });

  // Add options for movement and sense units
  Object.keys(CONFIG.A5E.movement)
    .forEach((m) => {
      options[`system.attributes.movement.${m}.unit`] = ['', MODES.OVERRIDE_ONLY, Object.entries(CONFIG.A5E.distanceUnits), 'RADIO'];
    });

  Object.keys(CONFIG.A5E.senses)
    .forEach((s) => {
      options[`system.attributes.senses.${s}.unit`] = ['', MODES.OVERRIDE_ONLY, Object.entries(CONFIG.A5E.visionUnits), 'RADIO'];
    });

  // Add options for details
  options['system.details.creatureTypes'] = ['', MODES.DEFAULT_MODES, Object.entries(CONFIG.A5E.creatureTypes), 'TAG_GROUP'];

  // Add options for traits
  options['system.traits.conditionImmunities'] = ['', MODES.DEFAULT_MODES, Object.entries(CONFIG.A5E.conditions), 'TAG_GROUP'];
  options['system.traits.damageImmunities'] = ['', MODES.DEFAULT_MODES, Object.entries(CONFIG.A5E.damageTypes), 'TAG_GROUP'];
  options['system.traits.damageResistances'] = ['', MODES.DEFAULT_MODES, Object.entries(CONFIG.A5E.damageTypes), 'TAG_GROUP'];
  options['system.traits.damageVulnerabilities'] = ['', MODES.DEFAULT_MODES, Object.entries(CONFIG.A5E.damageTypes), 'TAG_GROUP'];
  options['system.traits.size'] = ['', MODES.OVERRIDE_ONLY, Object.entries(CONFIG.A5E.actorSizes), 'RADIO'];

  // Add options for proficiencies
  options['system.proficiencies.armor'] = ['', MODES.DEFAULT_MODES, Object.entries(CONFIG.A5E.armor), 'TAG_GROUP'];
  options['system.proficiencies.languages'] = ['', MODES.DEFAULT_MODES, Object.entries(CONFIG.A5E.languages), 'TAG_GROUP'];
  options['system.proficiencies.tools'] = ['', MODES.DEFAULT_MODES, Object.values(CONFIG.A5E.tools).flatMap((c) => Object.entries(c)), 'TAG_GROUP'];
  options['system.proficiencies.weapons'] = ['', MODES.DEFAULT_MODES, Object.values(CONFIG.A5E.weapons).flatMap((c) => Object.entries(c)), 'TAG_GROUP'];

  // Proficiency is prepared in base data so we add it here.
  options['system.attributes.prof'] = [0, MODES.DEFAULT_MODES];

  // Adds options for spell casting ability
  options['system.attributes.spellcasting'] = ['', MODES.OVERRIDE_ONLY, Object.entries(CONFIG.A5E.abilities), 'RADIO'];

  // TODO: Possibly need to add something for bonus to damage

  // Delete derived values
  Object.keys(CONFIG.A5E.abilities).forEach((a) => {
    delete options[`system.abilities.${a}.check.mod`];
    delete options[`system.abilities.${a}.save.mod`];
  });

  delete options['system.attributes.ac.baseFormula'];
  delete options['system.attributes.ac.value'];

  // Delete text details like bio, class, etc.
  delete options['system.details.age'];
  delete options['system.details.appearance'];
  delete options['system.details.background'];
  delete options['system.details.bio'];
  delete options['system.details.classes'];
  delete options['system.details.culture'];
  delete options['system.details.destiny'];
  delete options['system.details.eyeColor'];
  delete options['system.details.gender'];
  delete options['system.details.hairColor'];
  delete options['system.details.height'];
  delete options['system.details.heritage'];
  delete options['system.details.level'];
  delete options['system.details.notes'];
  delete options['system.details.prestige'];
  delete options['system.details.skinColor'];
  delete options['system.details.weight'];
  delete options['system.details.notes'];
  delete options['system.details.xp'];
  delete options['system.details.privateNotes'];
  delete options['system.source.link'];
  delete options['system.source.name'];
  delete options['system.source.publisher'];

  // Delete Configuration options
  delete options['system.resources.primary.hideMax'];
  delete options['system.resources.secondary.hideMax'];
  delete options['system.resources.tertiary.hideMax'];
  delete options['system.resources.quaternary.hideMax'];

  // Temporarily delete the damage and healing bonus fields
  delete options['system.bonuses.damage'];
  delete options['system.bonuses.healing'];

  // Delete schema information
  delete options['system.schemaVersion.version'];
  delete options['system.schemaVersion.lastMigration'];
}
