<script lang="ts">
    import { setContext } from "svelte";
    import { actorSheetTempSettings } from "#stores/ActorSheetTempSettingsStore.svelte.ts";

    import type { Tab } from "../navigation/data.ts";

    import ActorSidebar from "./components/actor/ActorSidebar.svelte";
    import ActorSheetHeader from "./components/ActorSheetHeader.svelte";
    import NavigationBar from "../navigation/NavigationBar.svelte";

    import ActorCorePage from "./pages/ActorCorePage.svelte";
    import ActorFeaturesPage from "./pages/ActorFeaturesPage.svelte";
    import ActorInventoryPage from "./pages/ActorInventoryPage.svelte";

    import ActorNotesPage from "./pages/ActorNotesPage.svelte";
    import ActorEffectsPage from "./pages/ActorEffectsPage.svelte";
    import ActorBonusesPage from "./pages/ActorBonusesPage.svelte";

    let { actor, sheet } = $props();

    function getTabs(flags: any): Tab[] {
        return [
            {
                name: "core",
                label: "A5E.tabs.core",
                icon: "fa-solid fa-home",
                component: ActorCorePage,
                display: flags?.a5e?.showFavoritesSection ?? true,
            },
            {
                name: "inventory",
                label: "A5E.tabs.inventory",
                icon: "fa-solid fa-box-open",
                component: ActorInventoryPage,
                footerComponent: ActorInventoryFooter,
            },
            {
                name: "features",
                label: "A5E.tabs.features",
                icon: "fa-solid fa-table-list",
                component: ActorFeaturesPage,
                footerComponent: ActorFeaturesFooter,
            },
            {
                name: "notes",
                label: "A5E.tabs.notes",
                icon: "fa-solid fa-file-lines",
                component: ActorNotesPage,
                hasSubNavigation: true,
            },
            {
                name: "bonuses",
                label: "Bonuses",
                icon: "fa-solid fa-angles-up",
                component: ActorBonusesPage,
            },
            {
                name: "effects",
                label: "A5E.tabs.effects",
                icon: "fa-solid fa-person-rays",
                component: ActorEffectsPage,
            },
        ];
    }

    let flags = $derived(actor.reactive.flags?.a5e ?? {});

    let tabs = $derived(getTabs(actor.reactive.flags));

    let sheetIsLocked = $derived(!actor.isOwner ? true : (flags?.sheetIsLocked ?? true));

    setContext("actor", actor);
    setContext("sheet", sheet);
    setContext("sheetIsLocked", () => sheetIsLocked);
</script>

<main class="a5e-actor-sheet">
    <ActorSidebar />

    <ActorSheetHeader />

    <NavigationBar {currentTab} {tabs} showLock={true} onTabChange={updateCurrentTab} />

    <section class="a5e-actor-sheet__page">
        <currentTab.component />
    </section>

    {#if currentTab.footerComponent}
        <footer class="a5e-actor-sheet__footer">
            <currentTab.footerComponent />
        </footer>
    {/if}
</main>

<style lang="scss">
    .a5e-actor-sheet {
        position: relative;
        width: 100%;
        height: 100%;

        display: grid;
        grid-template-areas:
            "aside header"
            "aside primaryNavigation"
            "aside secondaryNavigation"
            "aside page"
            "aside footer";
        grid-template-columns: 12rem 1fr;
        grid-template-rows: min-content min-content min-content 1fr min-content;

        &__page {
            grid-area: page;
            padding-inline: 0.5rem;
            padding-block: 0.75rem;
            overflow-x: hidden;
        }

        &__footer {
            grid-area: footer;
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
            align-items: center;
            justify-content: space-between;
            font-size: var(--a5e-sm-text);
            padding-right: var(--a5e-actor-footer-padding-right, 0);
            padding-block: 0.5rem;
            padding-inline: 0.5rem;
        }
    }
</style>
