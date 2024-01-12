<svelte:options accessors={true} />

<script lang="ts">
    import {
        getContext,
        setContext,
        type ComponentType,
        onDestroy,
    } from "svelte";

    import { ApplicationShell } from "#runtime/svelte/component/core";
    import type { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store/fvtt/document";
    import type { ActorSheetApplicationProps } from "../../../types/applicationProps";

    import ActorBonusesPage from "../components/pages/ActorBonusesPage.svelte";
    import ActorCorePage from "../components/pages/ActorCorePage.svelte";
    import ActorEffectsPage from "../components/pages/ActorEffectsPage.svelte";
    import ActorFeaturesPage from "../components/pages/ActorFeaturesPage.svelte";
    import ActorInventoryPage from "../components/pages/ActorInventoryPage.svelte";
    import ActorManeuversPage from "../components/pages/ActorManueversPage.svelte";
    import ActorNotesPage from "../components/pages/ActorNotesPage.svelte";
    import ActorSettingsPage from "../components/pages/ActorSettingsPage.svelte";
    import ActorSheetHeader from "../components/ActorSheetHeader/ActorSheetHeader.svelte";
    import ActorSidebar from "../components/actorSidebar/ActorSidebar.svelte";
    import ActorSkillsPage from "../components/pages/ActorSkillsPage.svelte";
    import ActorSpellsPage from "../components/pages/ActorSpellsPage.svelte";
    import NewNavigationBar from "../components/navigation/NewNavigationBar.svelte";

    import ActorSheetTempSettingsStore from "../../stores/ActorSheetTempSettingsStore";

    export const application: ActorSheetApplicationProps =
        getContext("#external");

    export let { document, sheet } = application;
    export let elementRoot;

    function updateCurrentTab(event) {
        const { uuid } = $actor;
        const newTabName = event?.detail ?? "core";

        currentTab = tabs.find((tab) => tab.name === newTabName) ?? tabs[0];

        ActorSheetTempSettingsStore.update((currentSettings) => ({
            ...currentSettings,
            [uuid]: {
                currentTab: event?.detail ?? "core",
            },
        }));
    }

    type Tab = {
        name: string;
        label?: string;
        icon?: string;
        component: ComponentType;
        display?: boolean;
        hasSubNavigation?: boolean;
    };

    function getTabs(actor: TJSDocument): Tab[] {
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
                display: actor.flags?.a5e?.showFavoritesSection ?? true,
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
                display: actor.flags?.a5e?.showManeuverTab,
            },
            {
                name: "spells",
                label: "A5E.TabSpells",
                icon: "fa-solid fa-wand-sparkles",
                component: ActorSpellsPage,
                display: actor.flags?.a5e?.showSpellTab,
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
                icon: "fas fa-gear",
                component: ActorSettingsPage,
                display:
                    !actor.pack &&
                    actor.permission !==
                        CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER.OBSERVER,
            },
        ];
    }

    let tempSettings = {};

    const unsubscribe = ActorSheetTempSettingsStore.subscribe((store) => {
        tempSettings = store;
    });

    const actor: TJSDocument = document;

    // Required to get the tabs to update as the actor flags change
    let tabs = getTabs($actor);
    $: tabs = getTabs($actor);

    let currentTab =
        tabs.find(
            (tab) => tab.name === tempSettings[$actor?.uuid]?.currentTab,
        ) ?? tabs[0];

    setContext("actor", actor);
    setContext("sheet", sheet);

    onDestroy(() => {
        unsubscribe();
    });
</script>

<ApplicationShell bind:elementRoot>
    <main
        on:drop|preventDefault|stopPropagation={(event) => sheet._onDrop(event)}
    >
        <ActorSidebar />

        <section class="main-container">
            <ActorSheetHeader />

            <NewNavigationBar
                {currentTab}
                {tabs}
                showLock={true}
                on:tab-change={updateCurrentTab}
            />

            <svelte:component this={currentTab.component} />
        </section>
    </main>
</ApplicationShell>

<style lang="scss">
    main {
        display: flex;
        height: 100%;
        background-color: rgba(246, 242, 235, 0.15);
    }

    .main-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        height: 100%;
        padding: 0.75rem;
        overflow: hidden;
    }
</style>
