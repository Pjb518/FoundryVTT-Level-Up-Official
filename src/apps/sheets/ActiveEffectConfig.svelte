<svelte:options accessors={true} />

<script>
    import { getContext, setContext } from "svelte";
    import { ApplicationShell } from "#runtime/svelte/component/core";

    import EffectsDescriptionTab from "../components/pages/EffectsDescriptionTab.svelte";
    import EffectsEffectTab from "../components/pages/EffectsEffectTab.svelte";
    import EffectsPropertiesTab from "../components/pages/EffectsPropertiesTab.svelte";
    import EffectSheetHeader from "../components/EffectSheetHeader.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";

    export let { appId, document, sheet } = getContext("#external").application;
    export let elementRoot;

    const effect = document;

    function updateCurrentTab(event) {
        currentTab = tabs[event.detail];
    }

    const tabs = [
        {
            name: "description",
            label: "A5E.ItemSheetLabelDescriptionTab",
            component: EffectsDescriptionTab,
        },
        {
            name: "properties",
            label: "A5E.ItemSheetLabelPropertiesTab",
            component: EffectsPropertiesTab,
        },
        {
            name: "effects",
            label: "A5E.TabEffects",
            component: EffectsEffectTab,
        },
    ];

    let currentTab = tabs[0];

    setContext("appId", appId);
    setContext("effect", effect);
    setContext("sheet", sheet);
</script>

<ApplicationShell bind:elementRoot>
    <main>
        <EffectSheetHeader />

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
