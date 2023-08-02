<script>
    import { getContext } from "svelte";

    import DropArea from "../DropArea.svelte";

    const item = getContext("item");

    function updateBackgroundFeature(event) {
        const [dragEvent] = event.detail;
        try {
            const { uuid } = JSON.parse(
                dragEvent.dataTransfer.getData("text/plain")
            );

            // TODO: Validate that this is the correct feature type
            $item.update({ "system.feature": uuid });
        } catch (err) {
            console.error(err);
        }
    }

    async function deleteBackgroundFeature(event) {
        $item.update({ "system.feature": "" });
    }

    async function updateCultureFeatures(event) {
        const [dragEvent] = event.detail;
        try {
            const { uuid } = JSON.parse(
                dragEvent.dataTransfer.getData("text/plain")
            );
            await $item.features.add(uuid, { optional: false });
        } catch (err) {
            console.error(err);
        }
    }

    async function deleteCultureFeatures(event) {
        const [_, uuid] = event.detail;
        await $item.features.delete(uuid);
    }

    function updateFeatures(event) {
        if ($item.type === "background") updateBackgroundFeature(event);
        else updateCultureFeatures(event);
    }

    function deleteFeatures(event) {
        if ($item.type === "background") deleteBackgroundFeature(event);
        else deleteCultureFeatures(event);
    }

    $: uuids =
        $item.type === "background"
            ? [$item.system.feature]
            : Object.values($item.system.features).map((f) => f.uuid);
    $: singleDocument = $item.type === "background";
</script>

<article>
    <section class="section-wrapper">
        <DropArea
            {uuids}
            {singleDocument}
            on:item-dropped={updateFeatures}
            on:item-deleted={deleteFeatures}
        />
    </section>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow-y: auto;
    }

    .section-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.275rem;
    }
</style>
