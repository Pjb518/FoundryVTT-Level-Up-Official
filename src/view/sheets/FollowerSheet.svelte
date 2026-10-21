<script lang="ts">
  import { setContext } from "svelte";
  import { localize } from "#utils/localization/localize.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";
  import { editDocumentImage } from "#utils/view/editDocumentImage.ts";
  import getUsesSummary, { getMaxUses } from "#utils/summaries/getUsesSummary.ts";
  import createItem from "#utils/createItem.ts";
  import { toggleSheetLockedState } from "#utils/view/toggleSheetLockedState.ts";
  import ItemListActionButtons from "#view/sheets/components/ItemListActionButtons.svelte";
  import DropArea from "#view/snippets/DropArea.svelte";
  import Section from "#view/snippets/Section.svelte";
  import { pressedKeys } from "#stores/pressedKeysStore.svelte.ts";
  import { getKeyPressAsOptions } from "#utils/view/getKeyPressAsOptions.ts";
  import Editor from "#view/components/Editor.svelte";
  import type { FollowerSheetA5E } from "#documents/sheets/FollowerSheet.svelte.ts";

  type Props = {
    follower: Actor.OfType<"follower">;
    sheet: FollowerSheetA5E;
  };

  function onEditImage(event: MouseEvent) {
    editDocumentImage(follower, { shiftKey: event.shiftKey });
  }

  async function onFeatureDropped({
    dragEvent,
    uuid,
  }: {
    dragEvent: DragEvent;
    uuid: string;
  }) {
    const item = await fromUuid(uuid);
    if (item) await sheet._onDropItem(dragEvent, item as any);
  }

  function onFeatureActivate(feature: any) {
    feature.activate(undefined, getKeyPressAsOptions(pressedKeys));
  }

  function resetUses() {
    if (!topFeature) return;

    const max = Number(getMaxUses(topFeature.reactive));
    if (Number.isNaN(max)) return;

    topFeature.update({ "system.uses.value": max });
  }

  function createFeature() {
    if (sheetIsLocked) return;
    createItem(follower, "feature", "followerFeature");
  }

  const rightClickConfigure =
    game.settings?.get("a5e", "itemRightClickConfigure") ?? false;

  let { follower, sheet }: Props = $props();

  const prose = ["personality", "quirk", "motivation"] as const;

  let system = $derived(follower.reactive.system);
  let editable = $derived(follower.isOwner);
  let sheetIsLocked = $derived(
    !follower.isOwner
      ? true
      : (follower.reactive.flags?.a5e?.sheetIsLocked ?? true),
  );

  setContext("actor", follower);
  setContext("sheetIsLocked", () => sheetIsLocked);

  let features = $derived(
    [...follower.reactive.items].filter(
      (i: any) =>
        i.type === "feature" && i.system.featureType === "followerFeature",
    ) as any[],
  );

  // The highest ranked feature supplies the sidebar description
  let topFeature = $derived.by(() => {
    const ranks: readonly string[] = CONFIG.A5E.FOLLOWER_EXPERIENCE_RANKS;
    let top: any = null;
    let topRank = -1;

    for (const feature of features) {
      const rank = ranks.indexOf(feature.reactive.system.experienceType);
      if (rank > topRank) {
        top = feature;
        topRank = rank;
      }
    }

    return top;
  });

  let summary = $derived.by(() => {
    if (!features.length) return "";

    const type = system.followerType
      ? localize(CONFIG.A5E.followerTypes[system.followerType])
      : "";
    const experience = system.experienceType
      ? localize(CONFIG.A5E.followerExperienceTypes[system.experienceType])
      : "";

    return type && experience ? `${type} (${experience})` : type || experience;
  });

  let usesSummary = $derived(
    topFeature ? getUsesSummary(topFeature.reactive) : "",
  );

  let description = $state("");

  $effect(() => {
    const source = topFeature?.reactive.system.description ?? "";
    const relativeTo = topFeature;

    foundry.applications.ux.TextEditor.enrichHTML(source, {
      secrets: follower.isOwner,
      relativeTo,
      rollData: {},
    }).then((enriched: string) => (description = enriched));
  });
</script>

<main class="a5e-follower-sheet">
  <aside class="a5e-follower-sheet__sidebar">
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <img
      class="a5e-follower-sheet__img"
      src={follower.reactive.img}
      alt={follower.reactive.name}
      onclick={editable ? onEditImage : undefined}
    />

    <h3 class="a5e-follower-sheet__sidebar-heading">
      {localize("A5E.follower.featureSummary")}
    </h3>

    <div class="a5e-follower-sheet__summary-box">
      {#if topFeature}
        {@html description}
      {:else}
        <p class="a5e-follower-sheet__empty">
          {localize("A5E.NoDescription")}
        </p>
      {/if}
    </div>

    <h3 class="a5e-follower-sheet__sidebar-heading">
      {localize("A5E.follower.uses")}
    </h3>

    <div class="a5e-follower-sheet__uses-row">
      <div class="a5e-follower-sheet__summary-box a5e-follower-sheet__uses-box">
        {#if usesSummary}
          <p class="a5e-follower-sheet__uses">{usesSummary}</p>
        {:else}
          <p class="a5e-follower-sheet__empty">{localize("A5E.None")}</p>
        {/if}
      </div>

      <button
        type="button"
        class="a5e-follower-sheet__icon-button"
        aria-label="Reset Uses"
        data-tooltip="Reset Uses"
        data-tooltip-direction="UP"
        disabled={!usesSummary || !editable}
        onclick={resetUses}
      >
        <i class="fa-solid fa-rotate-left"></i>
      </button>
    </div>
  </aside>

  <div class="a5e-follower-sheet__main">
    <header class="a5e-follower-sheet__header">
      <div class="a5e-follower-sheet__name-wrapper">
        <input
          class="a5e-follower-sheet__name"
          type="text"
          value={follower.reactive.name}
          placeholder={localize("A5E.Name")}
          spellcheck="false"
          autocomplete="off"
          disabled={!editable}
          onchange={({ currentTarget }) =>
            updateDocumentDataFromField(follower, "name", currentTarget.value)}
        />

        {#if summary}
          <p class="a5e-follower-sheet__subtitle">{summary}</p>
        {/if}
      </div>

      {#if editable}
        <button
          type="button"
          class="a5e-follower-sheet__icon-button"
          aria-label={sheetIsLocked ? "Unlock" : "Lock"}
          onclick={({ currentTarget }) => {
            toggleSheetLockedState(follower);
            currentTarget.blur();
          }}
        >
          <i class="fa-solid {sheetIsLocked ? 'fa-lock' : 'fa-lock-open'}"></i>
        </button>
      {/if}
    </header>

    <Section
      heading="A5E.follower.feature"
      headerButtons={[
        {
          classes: "icon fa-solid fa-plus",
          display: !sheetIsLocked,
          handler: createFeature,
        },
      ]}
    >
      {#if features.length}
        <ul class="a5e-follower-sheet__features">
          {#each features as feature (feature.id)}
            {@const reactiveFeature = feature.reactive}
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <li
              class="a5e-follower-sheet__feature-item"
              onauxclick={() => {
                if (rightClickConfigure) feature.configureItem();
              }}
            >
              <button
                type="button"
                class="a5e-item__roll-button"
                class:a5e-item__roll-button--shift={pressedKeys.Shift}
                class:a5e-item__roll-button--ctrl={pressedKeys.Control}
                class:disable-pointer-events={!editable}
                aria-label={reactiveFeature.name}
                onclick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.blur();
                  onFeatureActivate(feature);
                }}
              >
                <img
                  class="a5e-item__image"
                  src={reactiveFeature.img ?? "icons/svg/item-bag.svg"}
                  alt={reactiveFeature.name}
                />
                <img
                  class="a5e-item__image--die"
                  src="/icons/svg/d20.svg"
                  alt="Roll"
                />
              </button>
              <span class="a5e-follower-sheet__feature-name">
                {reactiveFeature.name}
              </span>
              <ItemListActionButtons item={feature} />
            </li>
          {/each}
        </ul>
      {:else}
        <DropArea
          type="uuid"
          documentType="Item"
          onDocumentDropped={onFeatureDropped}
          onclick={createFeature}
        />
      {/if}
    </Section>

    {#each prose as field (field)}
      <Section heading="A5E.follower.{field}">
        {#key `${field}::${system[field]}`}
          <Editor
            content={system[field] ?? ""}
            document={follower}
            documentUuid={follower.uuid}
            field="system.{field}"
            manageSecrets={follower.isOwner}
          />
        {/key}
      </Section>
    {/each}
  </div>
</main>
