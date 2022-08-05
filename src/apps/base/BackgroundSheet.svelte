<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";
    import { getContext, setContext } from "svelte";

    import BackgroundSheetHeader from "../components/backgroundSheetHeader/BackgroundSheetHeader.svelte";
    import DropArea from "../components/DropArea.svelte";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";
    import ActorSheet from "./ActorSheet.svelte";

    export let { itemDocument } = getContext("external").application;
    export let elementRoot;

    const item = new TJSDocument(itemDocument);

    function addEquipmentItem(event) {
        const [dragEvent, _] = event.detail;

        try {
            const { uuid } = JSON.parse(
                dragEvent.dataTransfer.getData("text/plain")
            );

            if ($item.system.equipment.includes(uuid)) {
                ui.notifications.warn(
                    "Cannot add two items with the same UUID to a Background document's equipment section."
                );

                throw "Cannot add two items with the same UUID to the Background document's equipment section.";
            }

            $item.update({
                "system.equipment": [...$item.system.equipment, uuid],
            });
        } catch (err) {
            console.error(err);
        }
    }

    function replaceEquipmentItem(event) {
        const [dragEvent, feature] = event.detail;

        try {
            const { uuid } = JSON.parse(
                dragEvent.dataTransfer.getData("text/plain")
            );

            if ($item.system.equipment.includes(uuid)) {
                ui.notifications.warn(
                    "Cannot add two items with the same UUID to a Background document's equipment section."
                );

                throw "Cannot add two items with the same UUID to the Background document's equipment section.";
            }

            $item.system.equipment.splice(
                $item.system.equipment.findIndex(
                    (item) => item.uuid === feature.uuid
                ),
                1,
                uuid
            );

            $item.update({
                "system.equipment": $item.system.equipment,
            });

            feature.setFromUUID(uuid);
        } catch (err) {
            console.error(err);
        }
    }

    function deleteEquipmentItem(event) {
        const [_, feature] = event.detail;

        const index = $item.system.equipment.findIndex((item) => {
            console.log(item, feature.get().uuid, item === feature.get().uuid);
            return item === feature.get().uuid;
        });

        console.log(index);

        $item.system.equipment.splice(index, 1);

        $item.update({
            "system.equipment": $item.system.equipment,
        });
    }

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

    setContext("item", item);
</script>

<ApplicationShell bind:elementRoot>
    <main>
        <BackgroundSheetHeader />

        <section class="main-config-wrapper">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <input
                    class="u-pointer"
                    type="checkbox"
                    name="system.includesASI"
                    id={`${$item.id}-includesASI`}
                    checked={$item.system.includesASI}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            target.name,
                            target.checked
                        )}
                />

                <label class="u-pointer" for={`${$item.id}-includesASI`}>
                    Includes ASI
                </label>
            </div>

            <div class="drop-area-wrapper">
                <h3>Feature</h3>
                <DropArea
                    uuid={$item.system.feature}
                    on:item-dropped={updateFeature}
                    on:item-deleted={deleteFeature}
                />
            </div>

            <div class="drop-area-wrapper">
                <h3>Suggested Starting Equipment</h3>

                <ul class="equipment-list">
                    {#each [...$item.system.equipment] as uuid (`${uuid}`)}
                        <li>
                            <DropArea
                                uuid={uuid ?? null}
                                on:item-dropped={replaceEquipmentItem}
                                on:item-deleted={deleteEquipmentItem}
                            />
                        </li>
                    {/each}

                    <li>
                        <DropArea
                            uuid={null}
                            on:item-dropped={addEquipmentItem}
                        />
                    </li>
                </ul>
            </div>
        </section>
    </main>
</ApplicationShell>

<style lang="scss">
    .drop-area-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-family: "Modesto Condensed", serif;
        font-size: 1rem;
    }

    .equipment-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .main-config-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0.75rem;
    }
</style>
