<script lang="ts">
    import { setContext } from "svelte";

    import type { Tab } from "#view/navigation/data.ts";

    import EffectDescriptionPage from "./pages/effect/EffectDescriptionPage.svelte";
    import EffectChangesPage from "./pages/effect/EffectChangesPage.svelte";
    import EffectPropertiesPage from "./pages/effect/EffectPropertiesPage.svelte";
    import EffectSheetHeader from "./components/effect/EffectSheetHeader.svelte";
    import NavigationBar from "#view/navigation/NavigationBar.svelte";

    type Props = {
        document: ActiveEffect;
        sheet: any;
    };

    function updateCurrentTab(name: string) {
        const newTabName = name ?? "description";
        currentTab = tabs.find((tab) => tab.name === newTabName) ?? tabs[0];
    }

    let { document, sheet }: Props = $props();

    let effect = document;

    const tabs: Tab[] = $state([
        {
            name: "description",
            label: "A5E.tabs.description",
            icon: "fa-solid fa-info-circle",
            component: EffectDescriptionPage,
        },
        {
            name: "properties",
            label: "A5E.tabs.properties",
            icon: "fa-solid fa-cog",
            component: EffectPropertiesPage,
            display: effect.system.effectType === "onUse",
        },
        {
            name: "effects",
            label: "A5E.tabs.effects",
            icon: "fa-solid fa-magic",
            component: EffectChangesPage,
        },
    ]);

    let currentTab = $derived(tabs[0]);

    setContext("effect", effect);
    setContext("sheet", sheet);
</script>

<main class="a5e-effect-sheet">
    <EffectSheetHeader />

    <NavigationBar
        {currentTab}
        {tabs}
        showLock={false}
        onTabChange={updateCurrentTab}
    />

    <section class="a5e-effect-sheet__page">
        <currentTab.component />
    </section>
</main>

<style lang="scss">
    .a5e-effect-sheet {
        position: relative;
        width: 100%;
        height: 100%;

        display: grid;
        grid-template-areas:
            "header"
            "primaryNavigation"
            "page";

        grid-template-rows: min-content min-content 1fr;
        gap: 0.5rem;

        padding: 0.5rem;

        &__page {
            grid-area: page;
            overflow-y: auto;
        }
    }
</style>
