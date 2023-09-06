<script>
    import { getContext } from "svelte";

    import DropArea from "../dropAreas/OriginDropArea.svelte";

    const item = getContext("item");

    async function updateHeritageFeatures(event) {
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

    async function deleteHeritageFeatures(event) {
        const [_, uuid] = event.detail;
        await $item.features.delete(uuid);
    }

    $: baseFeatures = Object.values($item.system.features).map((f) => f.uuid);
</script>

<article>
    <section class="section-wrapper">
        <DropArea
            uuids={baseFeatures}
            on:item-dropped={updateHeritageFeatures}
            on:item-deleted={deleteHeritageFeatures}
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
