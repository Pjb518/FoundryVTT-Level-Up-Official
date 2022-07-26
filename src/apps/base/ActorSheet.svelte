<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";
    import { getContext, setContext } from "svelte";

    import ActorSheetHeader from "../components/ActorSheetHeader/ActorSheetHeader.svelte";

    export let { actorDocument } = getContext("external").application;
    export let elementRoot;

    setContext("actor", new TJSDocument(actorDocument));
</script>

<ApplicationShell bind:elementRoot>
    <main>
        <ActorSheetHeader />
    </main>
</ApplicationShell>

<style>
</style>
