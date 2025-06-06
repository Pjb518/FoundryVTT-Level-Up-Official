<script lang="ts">
    import { setContext } from "svelte";

    import { actorSheetTempSettings } from "#stores/ActorSheetTempSettingsStore.svelte.ts";

    import type { Tab } from "../navigation/data.ts";

    import ActorSidebar from "./components/actor/ActorSidebar.svelte";
    import ActorSheetHeader from "./components/ActorSheetHeader.svelte";
    import NavigationBar from "../navigation/NavigationBar.svelte";

    import ActorCorePage from "./pages/ActorCorePage.svelte";
    import ActorSkillsPage from "./pages/ActorSkillsPage.svelte";
    import ActorInventoryPage from "./pages/ActorInventoryPage.svelte";
    import ActorFeaturesPage from "./pages/ActorFeaturesPage.svelte";
    import ActorManeuversPage from "./pages/ActorManeuversPage.svelte";
    import ActorSpellsPage from "./pages/ActorSpellsPage.svelte";
    import ActorNotesPage from "./pages/ActorNotesPage.svelte";
    import ActorEffectsPage from "./pages/ActorEffectsPage.svelte";
    import ActorBonusesPage from "./pages/ActorBonusesPage.svelte";
    import ActorSettingsPage from "./pages/ActorSettingsPage.svelte";

    let { actor, sheet } = $props();

    function updateCurrentTab(name: string) {
        const { uuid } = actor;
        const newTabName = name ?? "core";

        currentTab = tabs.find((tab) => tab.name === newTabName) ?? tabs[0];

        actorSheetTempSettings[uuid].currentTab = newTabName;
    }

    function getTabs(flags: any): Tab[] {
        return [
            {
                name: "core",
                label: "A5E.TabCore",
                icon: "fa-solid fa-home",
                component: ActorCorePage,
            },
            {
                name: "skills",
                label: "A5E.TabSkills",
                icon: "fa-solid fa-graduation-cap",
                component: ActorSkillsPage,
                display: flags?.a5e?.showFavoritesSection ?? true,
            },
            {
                name: "inventory",
                label: "A5E.TabInventory",
                icon: "fa-solid fa-box-open",
                component: ActorInventoryPage,
            },
            {
                name: "features",
                label: "A5E.TabFeatures",
                icon: "fa-solid fa-table-list",
                component: ActorFeaturesPage,
            },
            {
                name: "maneuvers",
                label: "A5E.TabManeuvers",
                icon: "fa-solid fa-hand-fist",
                component: ActorManeuversPage,
                display: flags?.a5e?.showManeuverTab,
            },
            {
                name: "spells",
                label: "A5E.TabSpells",
                icon: "fa-solid fa-wand-sparkles",
                component: ActorSpellsPage,
                display: flags?.a5e?.showSpellTab,
            },
            // {
            //     name: "biography",
            //     label: "A5E.TabBiography",
            //     component: ActorBioPage,
            //     display: actor.type === "character",
            // },
            {
                name: "notes",
                label: "A5E.TabNotes",
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
                label: "A5E.TabEffects",
                icon: "fa-solid fa-person-rays",
                component: ActorEffectsPage,
            },
            {
                name: "settings",
                label: "A5E.TabSettings",
                icon: "fas fa-cog",
                component: ActorSettingsPage,
                hasSubNavigation: true,
                display:
                    !actor.pack &&
                    actor.permission !==
                        CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
            },
        ];
    }

    let flags = $derived(actor.reactive.flags?.a5e ?? {});

    let tabs = $derived(getTabs(actor.reactive.flags));
    let currentTab = $derived(
        tabs.find(
            (tab) =>
                tab.name === actorSheetTempSettings[actor.uuid]?.currentTab,
        ) ?? tabs[0],
    );

    let sheetIsLocked = $derived(
        !actor.isOwner ? true : (flags?.sheetIsLocked ?? true),
    );

    setContext("actor", actor);
    setContext("sheet", sheet);
    setContext("sheetIsLocked", () => sheetIsLocked);
</script>

<main class="a5e-actor-sheet">
    <ActorSidebar />

    <ActorSheetHeader />

    <NavigationBar
        {currentTab}
        {tabs}
        showLock={true}
        onTabChange={updateCurrentTab}
    />

    <!-- <section>Test</section> -->

    <section class="a5e-actor-sheet__page">
        <currentTab.component />
    </section>
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
        grid-template-rows: min-content min-content min-content 1fr 2rem;

        &__page {
            grid-area: page;
            padding-inline: 0.5rem;
            padding-block: 0.75rem;
            overflow-x: hidden;
        }
    }
</style>
