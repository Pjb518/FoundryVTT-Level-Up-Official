<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";
    import { getContext, setContext } from "svelte";

    import ActorCorePage from "../components/ActorCorePage.svelte";
    import ActorSkillsPage from "../components/ActorSkillsPage.svelte";
    import ActorSheetHeader from "../components/actorSheetHeader/actorSheetHeader.svelte";
    import ActorSidebar from "../components/actorSidebar/ActorSidebar.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";

    export let { actorDocument, sheet } = getContext("external").application;
    export let currentTab;
    export let elementRoot;

    function updateCurrentTab(event) {
        currentTab = tabs[event.detail];
    }

    async function onDrop(event) {
        const { uuid } = JSON.parse(event.dataTransfer.getData("text/plain"));
        const item = await fromUuid(uuid);

        if (item.type === "background") {
            sheet._onDropBackground(item);
        }
    }

    const tabs = [
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
            component: ActorCorePage,
        },
        {
            name: "features",
            label: "A5E.TabFeatures",
            component: ActorCorePage,
        },
        {
            name: "maneuvers",
            label: "A5E.TabManeuvers",
            component: ActorCorePage,
        },
        {
            name: "spells",
            label: "A5E.TabSpells",
            component: ActorCorePage,
        },
        {
            name: "biography",
            label: "A5E.TabBiography",
            component: ActorCorePage,
        },
        {
            name: "journal",
            label: "A5E.TabJournal",
            component: ActorCorePage,
        },
        {
            name: "effects",
            label: "A5E.TabEffects",
            component: ActorCorePage,
        },
        {
            name: "settings",
            label: "A5E.TabSettings",
            component: ActorCorePage,
        },
    ];

    $: currentTab = tabs[0];

    setContext("actor", new TJSDocument(actorDocument));
</script>

<ApplicationShell bind:elementRoot>
    <main on:drop|preventDefault|stopPropagation={(event) => onDrop(event)}>
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
