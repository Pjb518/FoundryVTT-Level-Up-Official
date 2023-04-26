<svelte:options accessors={true} />

<script>
    import { getContext, setContext } from "svelte";
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";

    import EffectSheetHeader from "../components/EffectSheetHeader.svelte";

    export let { appId, document, sheet } = getContext("#external").application;
    export let elementRoot;

    const effect = document;

    setContext("effect", effect);
    setContext("appId", appId);
</script>

<ApplicationShell bind:elementRoot>
    <main>
        <EffectSheetHeader />
    </main>
</ApplicationShell>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
    }
</style>
