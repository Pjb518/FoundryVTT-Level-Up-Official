<script lang="ts">
  import { getContext } from "svelte";

  import type { SkillSpecialtyGrant } from "#types/itemGrants.d.ts";

  import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
  import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
  import Section from "#view/snippets/Section.svelte";

  type Pick = { skill: string; specialty: string };

  type Props = {
    grant: SkillSpecialtyGrant;
    selectionType?: "limited" | "pool";
    base: string[];
    choices: string[];
    count: number;
    skill: string;
    proficientOnly?: boolean;
    selected: string[];
    poolSelected?: Pick[];
    updateSelectionFunc?: (value: any) => void;
  };

  function getGrantSummary(selected: string[]) {
    return selected
      .map((key) => skillSpecialties[skill]?.[key] ?? key)
      .join(", ");
  }

  function getPoolSummary(picks: Pick[]) {
    return picks
      .map(({ skill: s, specialty }) => skillSpecialties[s]?.[specialty] ?? specialty)
      .join(", ");
  }

  function onUpdateSelection(value: any) {
    selected = value;
    updateSelectionFunc?.({ selected, summary });
  }

  function onUpdatePoolSelection(skillKey: string, value: string[]) {
    const others = poolPicks.filter((pick) => pick.skill !== skillKey);
    poolPicks = [
      ...others,
      ...value.map((specialty) => ({ skill: skillKey, specialty })),
    ];

    updateSelectionFunc?.({ pool: poolPicks, summary: poolSummary });
  }

  let {
    grant,
    selectionType = "limited",
    base,
    choices,
    count,
    skill,
    proficientOnly = true,
    selected: preSelected,
    poolSelected = [],
    updateSelectionFunc = undefined,
  }: Props = $props();

  const actor: Character = getContext("actor");
  const { skills, skillSpecialties } = CONFIG.A5E;
  let choicesLocked = $state(true);

  // Limited
  let selected = $derived([...new Set(base.concat(preSelected))]);
  let totalCount = $derived(count + base.length);
  let remainingSelections = $derived(totalCount - selected.length);
  let summary = $derived(getGrantSummary(selected));

  // Pool
  let poolPicks: Pick[] = $state(poolSelected);
  let poolRemaining = $derived(count - poolPicks.length);
  let poolSummary = $derived(getPoolSummary(poolPicks));
  let poolSkills = $derived(
    Object.keys(skills).filter(
      (key) =>
        !proficientOnly || (actor?.system.skills[key]?.proficient ?? 0) > 0,
    ),
  );

  function getSkillSelected(skillKey: string) {
    return poolPicks
      .filter((pick) => pick.skill === skillKey)
      .map((pick) => pick.specialty);
  }

  function getOwned(skillKey: string): string[] {
    return actor?.system.skills[skillKey]?.specialties ?? [];
  }
</script>

{#if selectionType === "pool"}
  <Section heading="Skill Specialty Grant - {grant.name}">
    {#if !poolSkills.length}
      <p>No eligible skills.</p>
    {:else}
      <FieldWrapper
        warning={poolRemaining === 1
          ? `1 choice remaining`
          : `${poolRemaining} choices remaining.`}
        showWarning={poolRemaining > 0}
      >
        {#each poolSkills as skillKey (skillKey)}
          {@const owned = getOwned(skillKey)}
          {@const skillSelected = getSkillSelected(skillKey)}
          <Section
            heading={skills[skillKey]}
            --a5e-section-margin="0.25rem 0"
          >
            <CheckboxGroup
              options={Object.entries(skillSpecialties[skillKey] ?? {})}
              selected={[...skillSelected, ...owned]}
              disabled={poolRemaining <= 0}
              disabledOptions={owned}
              onUpdateSelection={(value) =>
                onUpdatePoolSelection(
                  skillKey,
                  value.filter((key) => !owned.includes(key)),
                )}
            />
          </Section>
        {/each}
      </FieldWrapper>
    {/if}
  </Section>
{:else}
  <Section
    heading="Skill Specialty Grant - {grant.name}"
    headerButtons={[
      {
        classes: "add-button",
        handler: () => (choicesLocked = !choicesLocked),
        htmlString: `<i class="icon fa-solid ${
          choicesLocked ? "fa-plus" : "fa-minus"
        }" />`,
        tooltip: choicesLocked
          ? "Locked to Grant Options"
          : "Free Selection Mode",
      },
    ]}
  >
    <FieldWrapper
      warning={remainingSelections === 1
        ? `1 choice remaining`
        : `${remainingSelections} choices remaining.`}
      showWarning={selected.length < totalCount}
    >
      <CheckboxGroup
        options={Object.entries(skillSpecialties[skill])}
        {selected}
        orange={choices}
        disabled={selected.length >= totalCount}
        {onUpdateSelection}
      />
    </FieldWrapper>
  </Section>
{/if}
