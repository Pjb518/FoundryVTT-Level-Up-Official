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

    import ActorBioPage from "../components/pages/ActorBioPage.svelte";
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
    import NavigationBar from "../components/navigation/NavigationBar.svelte";

    import ActorSheetTempSettingsStore from "../../stores/ActorSheetTempSettingsStore";

    export const application: ActorSheetApplicationProps =
        getContext("#external");

    export let { document, sheet } = application;
    export let elementRoot;

    function updateCurrentTab(event) {
        const { uuid } = $actor;
        currentTab = tabs[event.detail];

        ActorSheetTempSettingsStore.update((currentSettings) => ({
            ...currentSettings,
            [uuid]: {
                currentTab: currentTab.name,
            },
        }));
    }

    type Tab = {
        name: string;
        label?: string;
        icon?: string;
        component: ComponentType;
        display?: boolean;
    };

    function getTabs(actor: TJSDocument): Tab[] {
        return [
            {
                name: "core",
                label: "A5E.TabCore",
                component: ActorCorePage,
            },
            {
                name: "skills",
                label: "A5E.TabSkills",
                component: ActorSkillsPage,
                display: actor.flags?.a5e?.showFavoritesSection ?? true,
            },
            {
                name: "inventory",
                label: "A5E.TabInventory",
                component: ActorInventoryPage,
            },
            {
                name: "features",
                label: "A5E.TabFeatures",
                component: ActorFeaturesPage,
            },
            {
                name: "maneuvers",
                label: "A5E.TabManeuvers",
                component: ActorManeuversPage,
                display: actor.flags?.a5e?.showManeuverTab,
            },
            {
                name: "spells",
                label: "A5E.TabSpells",
                component: ActorSpellsPage,
                display: actor.flags?.a5e?.showSpellTab,
            },
            {
                name: "biography",
                label: "A5E.TabBiography",
                component: ActorBioPage,
                display: actor.type === "character",
            },
            {
                name: "notes",
                label: "A5E.TabNotes",
                component: ActorNotesPage,
            },
            {
                name: "bonuses",
                label: "Bonuses",
                component: ActorBonusesPage,
            },
            {
                name: "effects",
                label: "A5E.TabEffects",
                component: ActorEffectsPage,
            },
            {
                name: "settings",
                // label: "A5E.TabSettings",
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

            <NavigationBar
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
    :global {
        .a5e-actor-sheet {
            min-width: 47.1875rem;
        }

        .a5e-sheet .window-content {
            padding: 0;
            overflow-y: hidden;
        }
    }

    main {
        display: flex;
        height: 100%;
        background: $color-sheet-background;
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
