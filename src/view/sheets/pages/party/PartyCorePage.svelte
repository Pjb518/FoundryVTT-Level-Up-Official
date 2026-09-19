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

  function getActorSkills(actor: Creature) {
    const skills = Object.entries(actor.reactive.system.skills ?? {}).reduce(
      (acc, [key, s]) => {
        if (!s.proficient) {
          if (!["prc", "ins", "inv"].includes(key)) return acc;
        }
        let label = `${s.deterministicBonus}`;
        if (["prc", "ins", "inv"].includes(key)) label += ` (${s.passive})`;
        acc[key] = label;
        return acc;
      },
      {} as Record<string, string>,
    );

    const priority = ["prc", "ins", "inv"];

    return Object.entries(skills).sort(([a], [b]) => {
      const ai = priority.indexOf(a);
      const bi = priority.indexOf(b);

      if (ai !== -1 || bi !== -1) {
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      }

      return a.localeCompare(b);
    });
  }

  function getActorTraits(actor: Creature) {
    const actorData = actor.reactive.system;
    const damageTraits: Record<
      string,
      { res?: boolean; imm?: boolean; vul?: boolean }
    > = {};

    actorData.traits.damageImmunities.forEach((d) => {
      d = CONFIG.A5E.damageTypes[d] || d;
      damageTraits[d] ??= {};
      damageTraits[d].imm = true;
    });

    actorData.traits.damageResistances.forEach((d) => {
      d = CONFIG.A5E.damageTypes[d] || d;
      damageTraits[d] ??= {};
      damageTraits[d].res = true;
    });

    actorData.traits.damageVulnerabilities.forEach((d) => {
      d = CONFIG.A5E.damageTypes[d] || d;
      damageTraits[d] ??= {};
      damageTraits[d].vul = true;
    });

    return Object.entries(damageTraits).sort((a, b) =>
      a[0].localeCompare(b[0]),
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
<section class="a5e-party-sheet__core-overview">
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

    <!-- ----------------------------- -->
    <!-- Image & HP -->
    <!-- ----------------------------- -->
    <div class="a5e-party-sheet__core-member">
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

      <!-- ----------------------------- -->
      <!-- Name and Details -->
      <!-- ----------------------------- -->
      <div class="a5e-party-sheet__core-member__intro">
        <div class="a5e-party-sheet__core-member__name">
          <span>
            {actor.reactive.name}
          </span>

          <button class="a5e-button a5e-button--transparent">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>

        <span class="a5e-party-sheet__core-member__details">
          {getActorDetails(actor)}
        </span>

        <button class="a5e-party-sheet__core-member__inspiration">
          <!-- Inspiration -->
          <i class="fa-solid fa-dice-d20"></i>
        </button>
      </div>

      <!-- ----------------------------- -->
      <!-- AC, SAVES & SENSES -->
      <!-- ----------------------------- -->
      <div class="a5e-party-sheet__core-member__defense">
        <div class="a5e-party-sheet__core-member__ac">
          {actorData.attributes.ac.value}
        </div>

        <div class="a5e-party-sheet__core-member__saves">
          {const saves = $derived(getActorSaves(actor))}
          {#each Object.entries(saves) as [abl, save]}
            <div class="a5e-party-sheet__core-member__save">
              <span>
                {CONFIG.A5E.abilityAbbreviations[abl] || abl}
              </span>

              <span>
                +{save.deterministicBonus}
              </span>
            </div>
          {/each}
        </div>

        <!-- Traits -->
        <div class="a5e-party-sheet__core-member__traits">
          {const traits = $derived(getActorTraits(actor))}
          {#if traits.length}
            <ul class="a5e-party-sheet__tag-list">
              {#each traits as [damage, { res, imm, vul }]}
                <Tag
                  label={damage}
                  displayOnly={true}
                  red={vul}
                  active={res}
                  disabled={imm}
                />
              {/each}
            </ul>
          {:else}
            <span>No Damage Traits</span>
          {/if}
        </div>
      </div>

      <!-- ----------------------------- -->
      <!-- Skills -->
      <!-- ----------------------------- -->
      <div class="a5e-party-sheet__core-member__skills">
        {const skills = $derived(getActorSkills(actor))}
        <ul class="a5e-party-sheet__tag-list">
          {#each skills as [skl, label]}
            <Tag label="{CONFIG.A5E.skills[skl] || skl} +{label}" />
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
      align-content: center;
      gap: 0.25rem;

      padding: 0;
      margin: 0;
      list-style-type: none;
    }
  }
</style>
