<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import DropArea from "../DropArea.svelte";

    const item = getContext("item");

    async function addFeature(event, path) {
        const [dragEvent] = event.detail;
        try {
            const { uuid } = JSON.parse(
                dragEvent.dataTransfer.getData("text/plain")
            );

            const doc = await fromUuid(uuid);
            if (
                doc?.type !== "feature" ||
                doc?.system?.featureType !== "destiny"
            )
                return ui.notifications.warn(
                    localize("A5E.validations.warnings.InvalidForeignDocument")
                );

            $item.update({ [`system.${path}`]: uuid });
        } catch (err) {
            console.error(err);
        }
    }

    function deleteFeature(event, path) {
        $item.update({ [`system.${path}`]: "" });
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
            uuids={[source]}
            singleDocument={true}
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
            uuids={[inspiration]}
            singleDocument={true}
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
            uuids={[fulfillment]}
            singleDocument={true}
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
