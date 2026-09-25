<script lang="ts">
  import prepareProficiencyConfigObject from "#utils/prepareProficiencyConfigObject.ts";
  import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
  import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
  import Section from "#view/snippets/Section.svelte";
  import Tag from "#view/snippets/Tag.svelte";
  import type { ProficiencyGrant } from "../../../dataModels/item/Grants/ProficiencyGrant.ts";

  type Props = ProficiencyGrant.SelectionProps & {
    grant: ProficiencyGrant;
    selected: string[];
    updateSelectionFunc?: (value: any) => void;
  };

  function getGrantSummary(selected) {
    // return ` This grant provides a bonus of ${bonus} to ${selected
    //     .map((s) => configObject[s])
    //     .join(", ")}.`;
    return "";
  }

  function getValueLabel(value: string) {
    const parts = value.split(":");
    if (parts.length < 2) return value;
    const [profType, val] = parts;

    let conf: Record<string, string>;
    if (["tool", "weapon"].includes(profType)) {
      conf = Object.fromEntries(
        Object.entries(configObject[profType].config ?? {}).flatMap((e) =>
          Object.entries(e[1]),
        ),
      );
    } else {
      conf = Object.fromEntries(configObject[profType].config);
    }

    return _loc(conf[val]);
  }

  function onUpdateSelection() {
    updateSelectionFunc?.({ selected, summary });
  }

  let {
    grant,
    base,
    choices,
    selected: preSelected,
    updateSelectionFunc = undefined,
  }: Props = $props();

  const configObject = prepareProficiencyConfigObject();

  let globalOptsSelected = $state(choices.map(() => [] as string[]));
  let selected = $derived([...base, ...globalOptsSelected.flat()]);
  let summary = $derived(getGrantSummary(selected));
</script>

<Section
  heading="Proficiency Grant - {grant.name}"
  --a5e-section-body-gap="0.75rem"
>
  <FieldWrapper heading="Default Granted Options">
    <div class="a5e-default-selection">
      {#each base as value}
        <Tag
          label={getValueLabel(value)}
          {value}
          tight={true}
          displayOnly={true}
          optionStyles="
            max-width: 98%;
            border: 1px solid var(--a5e-border-color);
        "
          --a5e-tag-background-color="var(--a5e-actor-sidebar-pill-color)"
          --a5e-tag-border-color="var(--a5e-actor-sidebar-pill-border)"
        />
      {/each}
    </div>
  </FieldWrapper>

  <!-- Choices -->
  {#each choices as opt, idx (idx)}
    {const candidates = [...opt.candidates]}
    {let optSelected: string[] = $derived(globalOptsSelected[idx])}
    {let remainingSelections = $derived(opt.count - optSelected.length)}
    <FieldWrapper
      warning={remainingSelections === 1
        ? `1 choice remaining`
        : `${remainingSelections} choices remaining.`}
      showWarning={optSelected.length < opt.count}
      --direction="column"
    >
      <CheckboxGroup
        heading="Choice Set {idx + 1}"
        options={candidates.map((v) => [v, getValueLabel(v)])}
        selected={optSelected}
        disabled={optSelected.length >= opt.count}
        onUpdateSelection={(values) => {
          globalOptsSelected[idx] = values;
          onUpdateSelection();
        }}
      />
    </FieldWrapper>
  {/each}

  <FieldWrapper>
    {summary}
  </FieldWrapper>
</Section>

<style lang="scss">
  .a5e-default-selection {
    margin: 0;
    padding: 0;
    padding-block-end: 0.25rem;

    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;

    list-style: none;
    font-size: var(--a5e-xs-text);
  }
</style>
