<script lang="ts">
  import type { ItemGrant } from "#types/itemGrants.d.ts";

  import { constructFilters } from "#view/dialogs/compendium-browser/utils/constructFilters.ts";
  import { CompendiumBrowser } from "#view/dialogs/initializers/CompendiumBrowser.svelte.ts";
  import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
  import DropArea from "#view/snippets/DropArea.svelte";
  import DropTag from "#view/snippets/DropTag.svelte";
  import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
  import Section from "#view/snippets/Section.svelte";

  type Props = {
    grant: ItemGrant;
    base: string[];
    choices: string[];
    count: number;
    selected: string[];
    updateSelectionFunc?: (value: any) => void;
  };

  function getGrantSummary(selected: string[]) {
    // return ` This grant provides a bonus of ${bonus} to ${selected
    //     .map((s) => configObject[s])
    //     .join(", ")}.`;
    return "";
  }

  function onDropDocument(uuid: string) {
    if (remainingSelections === 0) {
      ui.notifications.warn("Max Selection Count Reached.");
      return;
    }

    // Validate
    const doc = fromUuidSync(uuid);
    if (doc?.type !== "object") {
      ui.notifications.error("Dropped document needs to be an object.");
      return;
    }

    if (!filters.every((filter) => filter(doc))) {
      ui.notifications.error("Dropped document doesn't satisfy filters.");
      return;
    }

    onUpdateSelection([...selected, uuid]);
  }

  function onUpdateSelection(value: string[]) {
    selected = value;
    updateSelectionFunc?.({ uuids: selected, summary });
  }

  async function openBrowser() {
    CompendiumBrowser.openWithFilters("object", {
      selections: filtersSelections,
    });
  }

  async function openDocument(uuid: string) {
    const doc = await fromUuid(uuid);
    doc.sheet.render(true);
  }

  let {
    grant,
    base,
    choices,
    count,
    selected: preSelected,
    updateSelectionFunc = undefined,
  }: Props = $props();

  const options = [...base, ...choices]
    .map((uuid) => {
      const doc = fromUuidSync(uuid);
      if (!doc) {
        ui.notifications?.error(
          `Could not find document with UUID ${uuid} in grant ${grant.name}.`,
        );
        return null;
      }

      return [uuid, doc.name];
    })
    .filter(Boolean) as [string, string][];

  const selectionType = grant.config.selectionType;
  const filtersSelections = grant.config.pool.filters;
  const { filters } = constructFilters(filtersSelections, "spell");

  let selected = $derived([...new Set(base.concat(preSelected))]);
  let totalCount = $derived(
    selectionType === "limited" ? base.length + count : count,
  );
  let remainingSelections = $derived(totalCount - selected.length);
  let summary = $derived(getGrantSummary(selected));
</script>

<Section heading="Item Grant - {grant.name}" --a5e-section-body-gap="0.75rem">
  <FieldWrapper
    warning={remainingSelections === 1
      ? "1 choice remaining"
      : `${remainingSelections} choices remaining.`}
    showWarning={selected.length < totalCount}
  >
    {#if selectionType === "limited"}
      <CheckboxGroup
        {options}
        {selected}
        orange={choices}
        disabled={selected.length >= totalCount}
        {onUpdateSelection}
        onTagToggleAux={openDocument}
      />
    {:else}
      {#if remainingSelections}
        <DropArea
          type="uuid"
          documentType="Item"
          onDocumentDropped={(value) => onDropDocument(value.uuid)}
          onclick={() => openBrowser()}
        />
      {/if}

      <DropTag
        embeddedData={selected}
        type="item"
        onUpdateSelection={(value) => onUpdateSelection(value)}
        --a5e-drop-tag-font-size="var(--a5e-sm-text)"
      />
    {/if}
  </FieldWrapper>

  <FieldWrapper>
    {summary}
  </FieldWrapper>
</Section>
