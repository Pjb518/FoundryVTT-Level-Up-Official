<svelte:options accessors={true} />

<script>
    import { setContext } from "svelte";

    import EffectsDescriptionTab from "../components/pages/EffectsDescriptionTab.svelte";
    import EffectsEffectTab from "../components/pages/EffectsEffectTab.svelte";
    import EffectsPropertiesTab from "../components/pages/EffectsPropertiesTab.svelte";
    import EffectSheetHeader from "../components/EffectSheetHeader.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";

    export let appId;
    export let document;
    export let sheet;

    const effect = document;

    function updateCurrentTab(event) {
        currentTab = tabs[event.detail];
    }

    let effectType = $effect.system.effectType;

    const tabs = [
        {
            name: "description",
            label: "A5E.tabs.description",
            component: EffectsDescriptionTab,
        },
        {
            name: "properties",
            label: "A5E.tabs.properties",
            component: EffectsPropertiesTab,
            display: effectType === "onUse",
        },
        {
            name: "effects",
            label: "A5E.tabs.effects",
            component: EffectsEffectTab,
        },
    ];

    let currentTab = tabs[0];

    setContext("appId", appId);
    setContext("effect", effect);
    setContext("sheet", sheet);
</script>

<main>
    <EffectSheetHeader />

    <NavigationBar {currentTab} {tabs} on:tab-change={updateCurrentTab} />

    <svelte:component this={currentTab.component} />
</main>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
    }
</style>
