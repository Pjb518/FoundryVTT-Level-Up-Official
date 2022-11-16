<svelte:options accessors={true} />

<script>
  import { getContext, setContext } from "svelte";
  import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
  import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  import ItemDescriptionTab from "../../components/ItemDescriptionTab.svelte";
  import ItemSheetHeader from "../../components/itemSheetHeader/ItemSheetHeader.svelte";
  import NavigationBar from "../../components/navigation/NavigationBar.svelte";
  import { localizeLanguage } from "../../utils/languageHelpers";
  import CultureDetailTab from "./CultureDetailsTab.svelte";

  export let { itemDocument } = getContext("external").application;
  export let elementRoot;

  function updateCurrentTab(event) {
    currentTab = tabs[event.detail];
  }

  const tabs = [
    {
      name: "description",
      label: localize("A5E.TabDescription"),
      component: ItemDescriptionTab,
    },
    {
      name: "details",
      label: "A5E.TabDetails",
      component: CultureDetailTab,
    },
  ];

  $: currentTab = tabs[0];

  setContext("item", new TJSDocument(itemDocument));
</script>

<ApplicationShell bind:elementRoot>
  <main>
    <ItemSheetHeader />

    <NavigationBar {currentTab} {tabs} on:tab-change={updateCurrentTab} />

    <svelte:component this={currentTab.component} />
  </main>
</ApplicationShell>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0.75rem;
    gap: 0.5rem;
  }
</style>
