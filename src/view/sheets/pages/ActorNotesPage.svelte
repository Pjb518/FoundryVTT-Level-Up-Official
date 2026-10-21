<script lang="ts">
  import { getContext } from "svelte";
  import { actorSheetTempSettings } from "#stores/ActorSheetTempSettingsStore.svelte.ts";

  import { localize } from "#utils/localization/localize.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";
  import Editor from "#view/components/Editor.svelte";
  import type { Tab } from "#view/navigation/data.ts";
  import SecondaryNavigationBar from "#view/navigation/SecondaryNavigationBar.svelte";
  import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
  import Section from "#view/snippets/Section.svelte";

  function updateCurrentTab(name: string) {
    const { uuid } = actor;
    const newTabName = name ?? "appearance";
    currentTab = tabs.find((tab) => tab.name === newTabName) ?? tabs[0];

    actorSheetTempSettings[uuid].currentNotesTab = name;
  }

  let actor: any = getContext("actor");
  let actorStore = $derived(actor.reactive.system);
  let sheetIsLocked: () => boolean = getContext("sheetIsLocked");
  const isGM = game.user?.isGM ?? false;

  const tabs: Tab[] = [
    {
      name: "appearance",
      label: "Character Details",
      display: actor.type === "character",
    },
    {
      name: "bio",
      label: actor.type === "npc" ? "A5E.tabs.biography" : "Backstory",
      display: actor.type === "character" || (isGM && actor.type === "npc"),
    },
    {
      name: "notes",
      label: "A5E.tabs.notes",
    },
    {
      name: "privateNotes",
      label: "A5E.details.notesPrivate",
      display: isGM && actor.type === "npc",
    },
  ];

  const traitsLabel = {
    age: "A5E.details.age",
    eyeColor: "A5E.details.eyeColor",
    hairColor: "A5E.details.hairColor",
    skinColor: "A5E.details.skinColor",
    height: "A5E.details.height",
    weight: "A5E.details.weight",
    gender: "A5E.details.gender",
  };

  let showRollButton = $derived.by(() => {
    if (actor.type !== "character") return false;
    const { height, weight } = actorStore.details;
    if (height || weight) return false;
    const formulas = actor.heightWeightFormulas;
    return !!(formulas.height && formulas.weight);
  });

  function rollButtons(key: string) {
    if (!showRollButton || (key !== "height" && key !== "weight")) return [];

    return [
      {
        classes: "a5e-resource__btn icon fas fa-dice",
        tooltip: localize("A5E.details.rollHeightAndWeight"),
        handler: () => actor.rollHeightAndWeight(),
        htmlString: " ",
      },
    ];
  }

  const defaultTab = actor.type === "character" ? "appearance" : "notes";
  let currentTab = $derived(
    tabs.find(
      (tab) => tab.name === actorSheetTempSettings[actor.uuid]?.currentNotesTab,
    ) ??
      tabs.find((tab) => tab.name === defaultTab) ??
      tabs[0],
  );
</script>

<SecondaryNavigationBar
  currentTab={currentTab.name}
  {tabs}
  onTabChange={updateCurrentTab}
/>

<div class="a5e-page-wrapper a5e-page-wrapper--scrollable">
  {#if currentTab.name === "appearance"}
    <section
      class="a5e-section--bio-wrapper"
      class:a5e-section--has-roll-button={showRollButton}
    >
      {#each Object.entries(traitsLabel) as [key, label]}
        <FieldWrapper
          heading={label}
          buttons={rollButtons(key)}
          --a5e-field-wrapper-gap="0.25rem"
        >
          <input
            class="a5e-input a5e-input--slim"
            class:a5e-disable-pointer-events={!actor.isOwner}
            id="{actor.id}-details-{key}"
            type="text"
            name="system.details.{key}"
            value={actorStore.details[key]}
            onchange={({ currentTarget }) => {
              updateDocumentDataFromField(actor, currentTarget.name, currentTarget.value);
            }}
          />
        </FieldWrapper>
      {/each}
    </section>

    <heading class="a5e-section-header">
      <h3 class="a5e-section-header__heading">Appearance</h3>
    </heading>
  {/if}

  {#key `${currentTab.name}::${actorStore.details[currentTab.name]}`}
    <Editor
      content={actorStore.details[currentTab.name] ?? ""}
      document={actor}
      documentUuid={actor.uuid}
      field="system.details.{currentTab.name}"
      manageSecrets={actor.isOwner}
    />
  {/key}
</div>

<style lang="scss">
  .a5e-section--bio-wrapper {
    margin-block: 0.5rem;
    /* background: */
    display: grid;
    gap: 0.5rem 1rem;
    grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr));

    &.a5e-section--has-roll-button :global(.a5e-field-wrapper__header) {
      min-height: 2rem;
    }
  }
</style>
