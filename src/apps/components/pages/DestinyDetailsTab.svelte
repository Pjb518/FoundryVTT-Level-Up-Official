<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import DropArea from "../DropArea.svelte";

    const item = getContext("item");

    function addFeature(event) {
        const transferData =
            event.detail?.[0]?.dataTransfer?.getData("text/plain");

        if (!transferData)
            return ui.notifications.warn("The item is not a feature.");

        const { uuid } = JSON.parse(transferData);
        if (!uuid) return ui.notifications.warn("No UUID found on feature.");

        $item.update({
            "system.sourceOfInspiration": uuid,
        });
    }

    function deleteFeature(event) {
        $item.update({
            "system.sourceOfInspiration": "",
        });
    }

    $: source = $item.system.sourceOfInspiration;
    $: inspiration = $item.system.inspirationFeature;
    $: fulfillment = $item.system.fulfillmentFeature;
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

<style lang="scss"></style>
