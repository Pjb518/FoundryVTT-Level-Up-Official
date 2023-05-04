<script>
    import { getContext } from "svelte";

    import DropArea from "../DropArea.svelte";

    const item = getContext("item");

    function updateFeature(event) {
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

    function deleteFeature(event) {
        const [_, feature] = event.detail;

        try {
            $item.update({ [`system.feature`]: "" });
            feature.set();
        } catch (err) {
            console.error(err);
        }
    }
</script>

<article>
    <section class="section-wrapper">
        <DropArea
            uuid={$item.system.feature || null}
            on:item-dropped={updateFeature}
            on:item-deleted={deleteFeature}
        />
    </section>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-inline: 0.5rem;
        overflow-y: auto;
    }

    .section-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.275rem;
    }

    // .section-title {
    //     font-size: 0.833rem;
    //     font-family: "Signika", sans-serif;
    //     font-weight: bold;
    //     margin-bottom: 0.125rem;
    // }
</style>
