<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";
    import { getContext, setContext } from "svelte";

    import ActorSheetCorePage from "../components/ActorSheetCorePage.svelte";
    import ActorSheetHeader from "../components/actorSheetHeader/actorSheetHeader.svelte";
    import ActorSidebar from "../components/actorSidebar/ActorSidebar.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";

    export let { actorDocument } = getContext("external").application;
    export let currentTab;
    export let elementRoot;

    function updateCurrentTab(event) {
        currentTab = tabs[event.detail];
    }

    const tabs = [
        {
            name: "core",
            label: "A5E.TabCore",
            component: ActorSheetCorePage,
        },
        {
            name: "skills",
            label: "A5E.TabSkills",
            component: ActorSheetCorePage,
        },
        {
            name: "inventory",
            label: "A5E.TabInventory",
            component: ActorSheetCorePage,
        },
        {
            name: "features",
            label: "A5E.TabFeatures",
            component: ActorSheetCorePage,
        },
        {
            name: "maneuvers",
            label: "A5E.TabManeuvers",
            component: ActorSheetCorePage,
        },
        {
            name: "spells",
            label: "A5E.TabSpells",
            component: ActorSheetCorePage,
        },
        {
            name: "biography",
            label: "A5E.TabBiography",
            component: ActorSheetCorePage,
        },
        {
            name: "journal",
            label: "A5E.TabJournal",
            component: ActorSheetCorePage,
        },
        {
            name: "settings",
            label: "A5E.TabSettings",
            component: ActorSheetCorePage,
        },
    ];

    $: currentTab = tabs[0];

    setContext("actor", new TJSDocument(actorDocument));
</script>

<ApplicationShell bind:elementRoot>
    <main>
        <ActorSidebar />

        <section class="main-container">
            <ActorSheetHeader />

            <NavigationBar
                {currentTab}
                {tabs}
                on:tab-change={updateCurrentTab}
            />

            <svelte:component this={currentTab.component} />
        </section>
    </main>
</ApplicationShell>

<style lang="scss">
    :global {
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
