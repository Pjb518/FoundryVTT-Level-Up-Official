<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";
    import { getContext, setContext } from "svelte";

    import BackgroundSheetHeader from "../components/backgroundSheetHeader/BackgroundSheetHeader.svelte";
    import DropArea from "../components/DropArea.svelte";

    export let { itemDocument } = getContext("external").application;
    export let elementRoot;

    const item = new TJSDocument(itemDocument);

    setContext("item", item);
</script>

<ApplicationShell bind:elementRoot>
    <main>
        <BackgroundSheetHeader />

        <section class="main-config-wrapper">
            <DropArea updatePath="features.base" />
            <DropArea updatePath="features.advancement" />
        </section>
    </main>
</ApplicationShell>

<style lang="scss">
    .main-config-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
    }
</style>
