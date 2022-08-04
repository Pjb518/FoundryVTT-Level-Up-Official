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
            <div class="drop-area-wrapper">
                <h3>Base Feature</h3>
                <DropArea updatePath="base" />
            </div>

            <div class="drop-area-wrapper">
                <h3>Advancement Feature</h3>
                <DropArea updatePath="advancement" />
            </div>
        </section>
    </main>
</ApplicationShell>

<style lang="scss">
    .drop-area-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-family: "Modesto Condensed", serif;
        font-size: 1rem;
    }

    .main-config-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0.75rem;
    }
</style>
