<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import LinkedDocumentsHelper from "../../utils/LinkedDocumentsHelper";

    import DropArea from "../DropArea.svelte";

    const item = getContext("item");

    const linkedEquipment = new LinkedDocumentsHelper($item, "equipment", {
        validate: (obj) => obj.type === "object",
    });

    function addEquipmentItem(event) {
        const [dragEvent, _] = event.detail;

        try {
            const { uuid } = JSON.parse(
                dragEvent.dataTransfer.getData("text/plain")
            );
            console.log(uuid);

            linkedEquipment.add({ uuid });
        } catch (err) {
            console.error(err);
        }
    }

    function replaceEquipmentItem(event) {
        const [dragEvent, feature] = event.detail;

        try {
            const oldUuid = feature.get().uuid;
            const { uuid } = JSON.parse(
                dragEvent.dataTransfer.getData("text/plain")
            );

            if (linkedEquipment.replace(oldUuid, { uuid }))
                feature.setFromUUID(uuid);
        } catch (err) {
            console.error(err);
        }
    }

    function deleteEquipmentItem(event) {
        const [_, feature] = event.detail;

        try {
            const { uuid } = feature.get();
            linkedEquipment.remove(uuid);
            feature.setFromUUID(null);
        } catch (err) {
            console.error(err);
        }
    }
</script>

<article>
    <section class="section-wrapper">
        <DropArea uuid={null} on:item-dropped={addEquipmentItem} />

        <div class="drop-area__container">
            {#each Object.values($item.system.equipment) as equipment (equipment.uuid)}
                <DropArea
                    uuid={equipment.uuid}
                    on:item-dropped={replaceEquipmentItem}
                    on:item-deleted={deleteEquipmentItem}
                />
            {/each}
        </div>
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

    .drop-area__container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
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
