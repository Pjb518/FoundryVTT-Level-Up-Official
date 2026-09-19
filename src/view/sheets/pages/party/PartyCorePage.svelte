<script lang="ts">
  import { getContext } from "svelte";
  import RadioGroup from "#view/snippets/RadioGroup.svelte";
  import Tag from "#view/snippets/Tag.svelte";

  function getActorDetails(actor: Creature) {
    if (actor.type !== "character") return "";
    let label = "";

    if (actor.levels) label += `Level ${actor.levels.character}`;
    if (actor.heritage) label += ` ${actor.heritage.name}`;
    const classes = Object.entries(actor.classes ?? {});
    classes.forEach(([key, cls]) => {
      if (classes.length > 1) {
        label += ` ${cls.name}(${cls.system.classLevels})`;
      } else label += ` ${cls.name}`;
    });

    return label;
  }

  function getActorSaves(actor: Creature) {
    return Object.entries(actor.reactive.system.abilities ?? {}).reduce(
      (acc, [key, abl]) => {
        if (abl.save.proficient) acc[key] = abl.save;
        return acc;
      },
      {},
    );
  }

  function getActorSenses(actor: Creature) {
    return Object.entries(actor.reactive.system.attributes.senses ?? {}).reduce(
      (acc, [key, sense]) => {
        if (!sense.distance) return acc;
        let label = CONFIG.A5E.senses[key] || key;
        label += ` (${sense.distance} ${CONFIG.A5E.distanceUnits[sense.unit]})`;

        acc.push(label);
        return acc;
      },
      [] as string[],
    );
  }

  function getActorSkills(actor: Creature) {
    return Object.entries(actor.reactive.system.skills ?? {}).reduce(
      (acc, [key, s]) => {
        if (!s.proficient || ["prc, ins, inv"].includes(key)) return acc;
        acc[key] = { mod: s.deterministicBonus, passive: s.passive };
        return acc;
      },
      {},
    );
  }

  function getPartyLanguages() {
    const languages: Record<string, string[]> = {};

    members.forEach((m) => {
      m.reactive.system.proficiencies.languages.forEach((l) => {
        languages[l] ??= [];
        languages[l].push(m.name);
      });
    });

    return languages;
  }

  function getPartySkills() {
    const skills: Record<string, string[]> = {};

    members.forEach((m) => {
      Object.entries(m.reactive.system.skills ?? {}).forEach(([key, s]) => {
        if (!s.proficient) return;

        skills[key] ??= [];
        let label = m.name;
        if (s.expertiseDice)
          label += ` (d${CONFIG.A5E.expertiseDiceSidesMap[s.expertiseDice]})`;
        skills[key].push(label);
      });
    });

    return skills;
  }

  const overviewSections = [
    ["languages", "Languages"],
    ["skills", "Skills"],
    ["damages", "Damage Traits"],
    ["conditions", "Condition Immunities"],
  ];

  let party: Actor.OfType<"party"> = getContext("party");
  let members = $derived(party.reactive.members);

  let overviewSection = $state("languages");
  let partyLanguages = $derived(getPartyLanguages());
  let partySkills = $derived(getPartySkills());
</script>

<!-- Overview Section -->
<section>
  <RadioGroup
    options={overviewSections}
    selected={overviewSection}
    allowDeselect={false}
    onUpdateSelection={(value) => (overviewSection = value)}
  />

  {#if overviewSection === "languages"}
    <ul class="a5e-party-sheet__tag-list">
      {#each Object.entries(partyLanguages) as [lang, actors]}
        <Tag
          label={CONFIG.A5E.languages[lang] || lang}
          displayOnly={true}
          tooltipText={actors.join(", ")}
          tight={true}
          tooltipDirection="UP"
        />
      {/each}
    </ul>
  {:else if overviewSection === "skills"}
    <ul class="a5e-party-sheet__tag-list">
      {#each Object.entries(partySkills) as [skill, actors]}
        <Tag
          label={CONFIG.A5E.skills[skill] || skill}
          displayOnly={true}
          tooltipText={actors.join(", ")}
          tight={true}
          tooltipDirection="UP"
        />
      {/each}
    </ul>
  {/if}
</section>

<hr />

<!-- Member Section -->
<section class="a5e-party-sheet__core-members">
  {#each members as actor}
    {const actorData = $derived(actor.reactive.system)}
    <div class="a5e-party-sheet__core-member">
      <!-- Image & HP -->
      <div class="a5e-party-sheet__core-member__img">
        <img
          class="a5e-party-sheet__actor-img"
          src={actor.reactive.img}
          alt={actor.reactive.img}
        />

        <span>
          {actorData.attributes.hp.value}
          /
          {actorData.attributes.hp.max}
        </span>
      </div>

      <!-- Name and Details -->
      <div class="a5e-party-sheet__core-member__intro">
        <span>
          {actor.reactive.name}
        </span>

        <span>{getActorDetails(actor)}</span>

        <button class="a5e-party-sheet__core-member__inspiration">
          <!-- Inspiration -->
          <i class="fa-solid fa-dice-d20"></i>
        </button>
      </div>

      <!-- AC, SAVES & SENSES -->
      <div class="a5e-party-sheet__core-member__defense">
        <div class="a5e-party-sheet__core-member__ac">
          {actorData.attributes.ac.value}
        </div>

        <div class="a5e-party-sheet__core-member__saves">
          {const saves = $derived(getActorSaves(actor))}
          {#each Object.entries(saves) as [abl, save]}
            <div>
              <span>{CONFIG.A5E.abilityAbbreviations[abl] || abl}</span>
              <span>+{save.deterministicBonus}</span>
            </div>
          {/each}
        </div>

        <!-- Senses -->
        <div class="a5e-party-sheet__core-member__senses">
          {const senses = $derived(getActorSenses(actor))}
          {#each senses as sense}
            <span>{sense}</span>
          {/each}
        </div>
      </div>

      <!-- Skills -->
      <div class="a5e-party-sheet__core-member__skills">
        {const skills = $derived(getActorSkills(actor))}
        <ul class="a5e-party-sheet__tag-list">
          {#each Object.entries(skills) as [skl, { mod, passive }]}
            <Tag label="{CONFIG.A5E.skills[skl] || skl} +{mod} ({passive})" />
          {/each}
        </ul>
      </div>
    </div>
  {/each}
</section>

<style lang="scss">
  .a5e-party-sheet {
    &__tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;

      padding: 0;
      list-style-type: none;
      font-size: var(--a5e-sm-text);
    }
  }
</style>
