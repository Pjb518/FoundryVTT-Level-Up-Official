<script>
    import { getContext, setContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import DropArea from "../DropArea.svelte";

    const item = getContext("item");

    async function updateHeritageFeatures(event, type) {
        const [dragEvent] = event.detail;
        try {
            const { uuid } = JSON.parse(
                dragEvent.dataTransfer.getData("text/plain")
            );
            await $item[type].add(uuid, { optional: false });
        } catch (err) {
            console.error(err);
        }
    }

    async function deleteHeritageFeatures(event, type) {
        const [_, uuid] = event.detail;
        await $item?.[type]?.delete(uuid);
    }

    $: baseFeatures = Object.values($item.system.features).map((f) => f.uuid);
    $: gifts = Object.values($item.system.gifts).map((f) => f.uuid);
    $: paragonGifts = Object.values($item.system.paragonGifts).map(
        (f) => f.uuid
    );
</script>

<article>
    <section class="section-wrapper">
        <h3 class="u-text-sm u-text-bold">
            {localize("A5E.originSheets.heritage.features.baseFeatures")}
        </h3>

        <DropArea
            uuids={baseFeatures}
            on:item-dropped={(e) => updateHeritageFeatures(e, "features")}
            on:item-deleted={(e) => deleteHeritageFeatures(e, "features")}
        />
    </section>

    <section class="section-wrapper">
        <h3 class="u-text-sm u-text-bold">
            {localize("A5E.originSheets.heritage.features.gifts")}
        </h3>

        <DropArea
            uuids={gifts}
            on:item-dropped={(e) => updateHeritageFeatures(e, "gifts")}
            on:item-deleted={(e) => deleteHeritageFeatures(e, "gifts")}
        />
    </section>

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
