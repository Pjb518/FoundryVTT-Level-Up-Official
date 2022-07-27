<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";
    import { getContext, setContext } from "svelte";

    import ActorSheetHeader from "../components/actorSheetHeader/ActorSheetHeader.svelte";
    import ActorSidebar from "../components/actorSidebar/ActorSidebar.svelte";

    export let { actorDocument } = getContext("external").application;
    export let elementRoot;

    setContext("actor", new TJSDocument(actorDocument));
</script>

<ApplicationShell bind:elementRoot>
    <main>
        <ActorSidebar />
        <ActorSheetHeader />
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
        background: rgba(246, 242, 235, 0.5);
    }
</style>
