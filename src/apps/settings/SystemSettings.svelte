<svelte:options accessors={true} />

<script>
    import { getContext, setContext } from "svelte";
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";

    import NavigationBar from "../components/navigation/NavigationBar.svelte";
    import SettingsEffectsTab from "./SettingsEffectsTab.svelte";

    export let { appId, settings } = getContext("#external").application;
    export let elementRoot;

    function updateCurrentTab(event) {
        currentTab = tabs[event.detail];
    }

    const tabs = [
        {
            name: "effects",
            label: "A5E.settings.navigation.activeEffects",
            component: SettingsEffectsTab,
        },
    ];

    let currentTab = tabs[0];

    setContext("settings", settings);
    setContext("appId", appId);
</script>

<ApplicationShell bind:elementRoot>
    <main>
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

        background: rgba(246, 242, 235, 0.5);
    }
</style>
