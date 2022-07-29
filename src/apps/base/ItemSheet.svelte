<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";
    import { getContext, setContext } from "svelte";

    export let { itemDocument } = getContext("external").application;
    export let elementRoot;

    setContext("item", new TJSDocument(itemDocument));
</script>

<ApplicationShell bind:elementRoot>
    <main>
        <div>WIP!!</div>
    </main>
</ApplicationShell>
