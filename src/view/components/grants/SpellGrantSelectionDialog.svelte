<script lang="ts">
  import { SpellGrant } from "#data/item/Grants/SpellGrant.ts";

  import { constructFilters } from "#view/dialogs/compendium-browser/utils/constructFilters.ts";
  import { CompendiumBrowser } from "#view/dialogs/initializers/CompendiumBrowser.svelte.ts";
  import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
  import DropArea from "#view/snippets/DropArea.svelte";
  import DropTag from "#view/snippets/DropTag.svelte";
  import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
  import RadioGroup from "#view/snippets/RadioGroup.svelte";
  import Section from "#view/snippets/Section.svelte";

  type Props = {
    grant: SpellGrant;
    base: string[];
    choices: string[];
    count: number;
    selected: string[];
    selectedBook: string;
    actor: Character;
    updateSelectionFunc?: (value: any) => void;
  };

  function getGrantSummary(selected: string[]) {
    // return ` This grant provides a bonus of ${bonus} to ${selected
    //     .map((s) => configObject[s])
    //     .join(", ")}.`;
    return "";
  }

  function getDefaultBook() {
    if (preSelectedBook) return preSelectedBook;
    const spellBooks = Object.keys(actor.system.spellBooks ?? {});
    if (spellBooks.length) return spellBooks[0];
    return "new";
  }

  function getSpellBookOptions() {
    const spellBooks = Object.entries(actor.system.spellBooks ?? {}).map(
      ([id, sb]) => {
        return [id, sb.name];
      },
    );

    spellBooks.unshift(["new", "Create New Spell Book"]);
    return spellBooks as string[][];
  }

  function onDropDocument(uuid: string) {
    if (remainingSelections === 0) {
      ui.notifications.warn("Max Selection Count Reached.");
      return;
    }

    // Validate
    const doc = fromUuidSync(uuid);
    if (doc?.type !== "spell") {
      ui.notifications.error("Dropped document needs to be a spell.");
      return;
    }

    if (!filters.every((filter) => filter(doc))) {
      ui.notifications.error("Dropped document doesn't satisfy filters.");
      return;
    }

    onUpdateSelection("selected", [...selected, uuid]);
  }

  function onUpdateSelection(key: string, value: any) {
    if (key === "selected") selected = value;
    else if (key === "selectedBook") selectedBook = value;
    updateSelectionFunc?.({
      spellBook: selectedBook,
      uuids: selected,
      summary,
    });
  }

  async function openBrowser() {
    CompendiumBrowser.openWithFilters("spell", {
      selections: filtersSelections,
    });
  }

  async function openDocument(uuid: string) {
    const doc = await fromUuid(uuid);
    doc.sheet.render(true);
  }

  let {
    grant,
    actor,
    base,
    choices,
    count,
    selected: preSelected,
    selectedBook: preSelectedBook,
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

  const spellBookOpts = getSpellBookOptions();
  let selectedBook = $state(getDefaultBook());

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

<Section heading="Spell Grant - {grant.name}" --a5e-section-body-gap="0.75rem">
  <FieldWrapper
    heading="Spell Selection"
    buttons={[
      {
        htmlString: '<i class="fa-solid fa-books"></i>',
        tooltip: "Open Compendium Browser",
        handler: () => openBrowser(),
      },
    ]}
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
        onUpdateSelection={(values) => onUpdateSelection("selected", values)}
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
        onUpdateSelection={(value) => onUpdateSelection("selected", value)}
      />
    {/if}
  </FieldWrapper>

  <FieldWrapper heading="Spell Book Selection">
    <RadioGroup
      options={spellBookOpts}
      selected={selectedBook}
      onUpdateSelection={(value) => onUpdateSelection("selectedBook", value)}
    />
  </FieldWrapper>

  <FieldWrapper>
    {summary}
  </FieldWrapper>
</Section>
