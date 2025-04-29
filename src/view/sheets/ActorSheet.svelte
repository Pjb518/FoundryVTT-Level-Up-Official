<script lang="ts">
    import { setContext } from "svelte";

    import { actorSheetTempSettings } from "#stores/ActorSheetTempSettingsStore.svelte.ts";

    import type { Tab } from "../navigation/data.ts";

    import ActorSidebar from "./components/ActorSidebar.svelte";
    import ActorSheetHeader from "./components/ActorSheetHeader.svelte";
    import NavigationBar from "../navigation/NavigationBar.svelte";

    let { actor, sheet } = $props();

    function updateCurrentTab(name: string) {
        const { uuid } = actor;
        const newTabName = name ?? "core";

        currentTab = tabs.find((tab) => tab.name === newTabName) ?? tabs[0];
    }

    function getTabs(flags: any): Tab[] {
        return [
            {
                name: "core",
                label: "A5E.TabCore",
                icon: "fa-solid fa-home",
                component: null, // ActorCorePage,
            },
            {
                name: "skills",
                label: "A5E.TabSkills",
                icon: "fa-solid fa-graduation-cap",
                component: null, //ActorSkillsPage,
                display: flags?.a5e?.showFavoritesSection ?? true,
            },
            {
                name: "inventory",
                label: "A5E.TabInventory",
                icon: "fa-solid fa-box-open",
                component: null, // ActorInventoryPage,
            },
            {
                name: "features",
                label: "A5E.TabFeatures",
                icon: "fa-solid fa-table-list",
                component: null, // ActorFeaturesPage,
            },
            {
                name: "maneuvers",
                label: "A5E.TabManeuvers",
                icon: "fa-solid fa-hand-fist",
                component: null, //ActorManeuversPage,
                display: flags?.a5e?.showManeuverTab,
            },
            {
                name: "spells",
                label: "A5E.TabSpells",
                icon: "fa-solid fa-wand-sparkles",
                component: null, //ActorSpellsPage,
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
                component: null, //ActorNotesPage,
                hasSubNavigation: true,
            },
            {
                name: "bonuses",
                label: "Bonuses",
                icon: "fa-solid fa-angles-up",
                component: null, //ActorBonusesPage,
            },
            {
                name: "effects",
                label: "A5E.TabEffects",
                icon: "fa-solid fa-person-rays",
                component: null, //ActorEffectsPage,
            },
            {
                name: "settings",
                label: "A5E.TabSettings",
                icon: "fas fa-cog",
                component: null, //ActorSettingsPage,
                hasSubNavigation: true,
                display:
                    !actor.pack &&
                    actor.permission !==
                        CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
            },
        ];
    }

    let flags = $derived(actor.reactive.flags?.a5e ?? {});
    let tempSettings = {};

    let tabs = $derived(getTabs(actor.reactive.flags));
    let currentTab =
        tabs.find((tab) => tab.name === tempSettings[actor.uuid]?.currentTab) ??
        tabs[0];

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

    <section></section>
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
            "aside body"
            "aside footer";
        grid-template-columns: 12rem 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    }
</style>
