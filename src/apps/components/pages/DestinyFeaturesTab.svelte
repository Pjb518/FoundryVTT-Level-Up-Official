<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import DropArea from "../DropArea.svelte";

    const item = getContext("item");

    function addFeature(event, path) {
        const [dragEvent, feature] = event.detail;
        const transferData = dragEvent.dataTransfer?.getData("text/plain");

        if (!transferData)
            return ui.notifications.warn("The item is not a feature.");

        const { uuid } = JSON.parse(transferData);
        if (!uuid) return ui.notifications.warn("No UUID found on feature.");

        $item.update({
            [`system.${path}`]: uuid,
        });

        feature?.setFromUUID(uuid);
    }

    function deleteFeature(event, path) {
        const [_, feature] = event.detail;

        $item.update({
            [`system.${path}`]: "",
        });

        feature.set();
    }

    $: source = $item.system.sourceOfInspiration || null;
    $: inspiration = $item.system.inspirationFeature || null;
    $: fulfillment = $item.system.fulfillmentFeature || null;
</script>

<article>
    <section class="section-wrapper drop-area">
        <h3 class="section-title">
            {localize("A5E.DestinyFeatureSource")}
        </h3>
        <DropArea
            uuid={source}
            on:item-dropped={(event) =>
                addFeature(event, "sourceOfInspiration")}
            on:item-deleted={(event) =>
                deleteFeature(event, "sourceOfInspiration")}
        />
    </section>

    <section class="section-wrapper drop-area">
        <h3 class="section-title">
            {localize("A5E.DestinyFeatureInspiration")}
        </h3>

        <DropArea
            uuid={inspiration}
            on:item-dropped={(event) => addFeature(event, "inspirationFeature")}
            on:item-deleted={(event) =>
                deleteFeature(event, "inspirationFeature")}
        />
    </section>

    <section class="section-wrapper drop-area">
        <h3 class="section-title">
            {localize("A5E.DestinyFeatureFulfillment")}
        </h3>

        <DropArea
            uuid={fulfillment}
            on:item-dropped={(event) => addFeature(event, "fulfillmentFeature")}
            on:item-deleted={(event) =>
                deleteFeature(event, "fulfillmentFeature")}
        />
    </section>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-inline: 0.5rem;
    }

    .section-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.275rem;
    }
    .section-title {
        font-size: 0.833rem;
        font-family: "Signika", sans-serif;
        font-weight: bold;
        margin-bottom: 0.125rem;
    }
</style>
