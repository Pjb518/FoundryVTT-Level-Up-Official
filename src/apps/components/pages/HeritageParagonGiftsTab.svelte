<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import DropArea from "../DropArea.svelte";

    const item = getContext("item");

    async function updateHeritageFeatures(event) {
        const [dragEvent] = event.detail;
        try {
            const { uuid } = JSON.parse(
                dragEvent.dataTransfer.getData("text/plain")
            );
            await $item.paragonGifts.add(uuid, { optional: false });
        } catch (err) {
            console.error(err);
        }
    }

    async function deleteHeritageFeatures(event) {
        const [_, uuid] = event.detail;
        await $item.paragonGifts.delete(uuid);
    }

    $: paragonGifts = Object.values($item.system.paragonGifts).map(
        (f) => f.uuid
    );
</script>

<article>
    <section class="section-wrapper">
        <h3 class="u-text-sm u-text-bold">
            {localize("A5E.originSheets.heritage.features.paragonGifts")}
        </h3>

        <DropArea
            uuids={paragonGifts}
            on:item-dropped={(e) => updateHeritageFeatures(e, "paragonGifts")}
            on:item-deleted={(e) => deleteHeritageFeatures(e, "paragonGifts")}
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
