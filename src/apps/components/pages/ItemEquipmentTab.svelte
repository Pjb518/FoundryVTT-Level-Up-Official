<script>
    import { getContext } from "svelte";

    import DropArea from "../dropAreas/OriginDropArea.svelte";

    const item = getContext("item");

    async function updateEquipment(event) {
        const [dragEvent] = event.detail;
        try {
            const { uuid } = JSON.parse(
                dragEvent.dataTransfer.getData("text/plain")
            );
            await $item.items.add(uuid, { optional: true });
        } catch (err) {
            console.error(err);
        }
    }

    async function deleteEquipment(event) {
        const [_, uuid] = event.detail;
        await $item.items.delete(uuid);
    }

    let showDropZone = $item.parent
        ? !["Actor", "ActorDelta"].includes($item?.parent?.documentName)
        : true;

    $: uuids = Object.values($item.system.items ?? {}).map((e) => e.uuid);
</script>

<article>
    <section class="section-wrapper">
        <DropArea
            {uuids}
            attribute="items"
            {showDropZone}
            on:item-dropped={updateEquipment}
            on:item-deleted={deleteEquipment}
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
