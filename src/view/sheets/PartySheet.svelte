<script lang="ts">
  import { setContext } from "svelte";
  import type { PartySheetA5E } from "#documents/sheets/PartySheet.svelte.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";
  import { editDocumentImage } from "#utils/view/editDocumentImage.ts";
  import NavigationBar from "#view/navigation/NavigationBar.svelte";
  import type { Tab } from "../navigation/data.ts";
  import PartyActionsPage from "./pages/party/PartyActionsPage.svelte";
  import PartyAttributesPage from "./pages/party/PartyAttributesPage.svelte";
  import PartyCorePage from "./pages/party/PartyCorePage.svelte";
  import PartyInventoryPage from "./pages/party/PartyInventoryPage.svelte";
  import PartyResourcesPage from "./pages/party/PartyResourcesPage.svelte";

  type Props = {
    party: Actor.OfType<"party">;
    sheet: PartySheetA5E;
  };

  function onEditImage(event) {
    editDocumentImage(party, { shiftKey: event.shiftKey });
  }

  function updateCurrentTab(name: string) {
    currentTab = tabs.find((t) => t.name === name) ?? tabs[0];
  }

  let { party, sheet }: Props = $props();

  let tabs: Tab[] = [
    {
      name: "core",
      label: "A5E.tabs.core",
      icon: "fa-solid fa-home",
      component: PartyCorePage,
    },
    {
      name: "attributes",
      label: "A5E.tabs.attributes",
      icon: "fa-solid fa-khanda",
      component: PartyAttributesPage,
    },
    // {
    //   name: "resources",
    //   label: "A5E.tabs.resources",
    //   icon: "fa-solid fa-cogs",
    //   component: PartyResourcesPage,
    // },
    {
      name: "inventory",
      label: "A5E.tabs.inventory",
      icon: "fa-solid fa-box-open",
      component: PartyInventoryPage,
    },
    {
      name: "actions",
      label: "Party Actions",
      icon: "fa-solid fa-crosshairs",
      component: PartyActionsPage,
      display: game.user.isGM,
    },
  ] as const;

  let currentTab = $derived(tabs[0]);
  let partyData = $derived(party.reactive.system);
  let members = $derived(party.reactive.members);

  setContext("party", party);

  // We add these for inventory
  setContext("actor", party);
  setContext("sheetIsLocked", () => false);
</script>

<main class="a5e-party">
  <header class="a5e-party-sheet__header">
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <img
      class="a5e-party-sheet__header__img"
      src={party.reactive.img}
      alt={party.reactive.name}
      onclick={onEditImage}
    />

    <div>
      <input
        class="a5e-input a5e-input--character-name"
        type="text"
        value={party.reactive.name}
        spellcheck="false"
        autocomplete="off"
        onchange={({ currentTarget }) =>
          updateDocumentDataFromField(party, "name", currentTarget.value)}
      />
    </div>

    <div class="a5e-party-sheet__header__level">
      Level {partyData.details.level ?? 1}
    </div>

    <button
      type="button"
      class="a5e-button a5e-button--transparent a5e-party-sheet__header__rest"
      aria-label="Long Rest Party"
      data-tooltip="Long Rest Party"
      data-tooltip-direction="UP"
      onclick={() => party.triggerLongRest()}
    >
      <i class="fa-solid fa-campfire"></i>
    </button>
  </header>

  <!-- <hr class="a5e-party__seperator"> -->

  <NavigationBar {currentTab} {tabs} onTabChange={updateCurrentTab} />

  <!-- Start Main Section Here -->
  <section class="a5e-party-sheet__core">
    {#if members.length > 0}
      <currentTab.component {party} />
    {:else}
      <div class="a5e-party__instructions">
        Drop actors into this window to populate the party.
      </div>
    {/if}
  </section>

  <!-- Footer Goes Here -->
</main>

<style lang="scss">
  .a5e-party {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 80vh;

    &__instructions {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 5rem;
      padding: 1rem;
      margin: 1rem;
      font-size: var(--a5e-md-text);
      border: 2px dashed var(--a5e-border-color);
      border-radius: var(--a5e-border-radius-standard);
    }
  }
</style>
