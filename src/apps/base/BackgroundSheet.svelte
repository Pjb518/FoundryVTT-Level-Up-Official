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

    function onFeatureDrop(event) {
        const [dragEvent, feature] = event.detail;

        try {
            const { uuid } = JSON.parse(
                dragEvent.dataTransfer.getData("text/plain")
            );

            $item.update({ "system.feature": uuid });
            feature.setFromUUID(uuid);
        } catch (err) {
            console.error(err);
        }
    }

    function onFeatureDeleted(event) {
        const [dragEvent, feature] = event.detail;

        try {
            $item.update({ [`system.feature`]: "" });
            feature.set();
        } catch (err) {
            console.error(err);
        }
    }

    setContext("item", item);
</script>

<ApplicationShell bind:elementRoot>
    <main>
        <BackgroundSheetHeader />

        <section class="main-config-wrapper">
            <div class="drop-area-wrapper">
                <h3>Feature</h3>
                <DropArea
                    uuid={$item.system.feature}
                    on:item-dropped={onFeatureDrop}
                    on:item-deleted={onFeatureDeleted}
                />
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

    .equipment-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .main-config-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0.75rem;
    }
</style>
