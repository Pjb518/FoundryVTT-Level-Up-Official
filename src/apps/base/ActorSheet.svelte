<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";
    import { getContext } from "svelte";

    import ActorSheetHeader from "../components/ActorSheetHeader.svelte";

    export let { actorDocument } = getContext("external").application;
    export let elementRoot;

    const actor = new TJSDocument(actorDocument);
</script>

<ApplicationShell bind:elementRoot>
    <main>
        <ActorSheetHeader {actor} />
    </main>
</ApplicationShell>

<style>
</style>
