<svelte:options accessors={true} />

<script>
    import { getContext, setContext } from "svelte";
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";

    export let { appId, document, sheet } = getContext("#external").application;
    export let elementRoot;

    const effect = document;

    setContext("effect", effect);
    setContext("appId", appId);
</script>

<ApplicationShell bind:elementRoot>
    <!--  -->
    <main>
        <!--  -->
    </main>
</ApplicationShell>

<style lang="scss"></style>
