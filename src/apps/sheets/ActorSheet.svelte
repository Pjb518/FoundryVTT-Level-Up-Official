<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
    import { getContext, setContext } from "svelte";

    import ActorCorePage from "../components/pages/ActorCorePage.svelte";
    import ActorBioPage from "../components/pages/ActorBioPage.svelte";
    import ActorEffectsPage from "../components/pages/ActorEffectsPage.svelte";
    import ActorFeaturesPage from "../components/pages/ActorFeaturesPage.svelte";
    import ActorInventoryPage from "../components/pages/ActorInventoryPage.svelte";
    import ActorManeuversPage from "../components/pages/ActorManueversPage.svelte";
    import ActorNotesPage from "../components/pages/ActorNotesPage.svelte";
    import ActorSheetHeader from "../components/ActorSheetHeader/ActorSheetHeader.svelte";
    import ActorSettingsPage from "../components/pages/ActorSettingsPage.svelte";
    import ActorSidebar from "../components/actorSidebar/ActorSidebar.svelte";
    import ActorSkillsPage from "../components/pages/ActorSkillsPage.svelte";
    import ActorSpellsPage from "../components/pages/ActorSpellsPage.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";

    export let { document, sheet } = getContext("#external").application;
    export let elementRoot;

    const actor = document;

    function updateCurrentTab(event) {
        currentTab = tabs[event.detail];

        if (
            !$actor.pack &&
            $actor.permission !== CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER
        ) {
            $actor.update({ "flags.a5e.currentTab": currentTab.name });
        }
    }

    async function onDrop(event) {
        const transferData = event.dataTransfer.getData("text/plain");
        if (!transferData) return;

        const dragData = JSON.parse(transferData);
        if (dragData?.actorId === $actor.id) return;

        const { uuid } = dragData;
        const document = await fromUuid(uuid);

        sheet._onDropDocument(document);
    }

    function getTabs(actor) {
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
            // {
            //     name: "effects",
            //     label: "A5E.TabEffects",
            //     component: ActorEffectsPage,
            // },
            {
                name: "settings",
                label: "A5E.TabSettings",
                component: ActorSettingsPage,
                display:
                    !actor.pack &&
                    actor.permission !==
                        CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER,
            },
        ];
    }

    // Required to get the tabs to update as the actor flags change
    let tabs = getTabs($actor);
    $: tabs = getTabs($actor);

    let currentTab =
        tabs.find((tab) => tab.name === $actor.flags?.a5e?.currentTab) ??
        tabs[0];

    setContext("actor", actor);
</script>

<ApplicationShell bind:elementRoot>
    <main on:drop|preventDefault|stopPropagation={(event) => onDrop(event)}>
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
        background: rgba(246, 242, 235, 0.5);
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
