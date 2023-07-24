<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import LinkedDocumentsHelper from "../../../utils/LinkedDocumentsHelper";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import CustomTagGroup from "../CustomTagGroup.svelte";
    import DropArea from "../DropArea.svelte";

    const item = getContext("item");

    const linkedFeatures = new LinkedDocumentsHelper($item, "features", {
        validate: (obj) =>
            obj.type === "feature" && obj.system.featureType === "culture",
    });

    function handleAddFeature(event) {
        const [dragEvent, _] = event.detail;

        try {
            const { uuid } = JSON.parse(
                dragEvent.dataTransfer.getData("text/plain")
            );
            linkedFeatures.add({ uuid, optional: false });
        } catch (err) {
            console.error(err);
        }
    }

    async function handleReplaceFeature(event) {
        const [dragEvent, feature] = event.detail;

        try {
            const oldUuid = feature.get().uuid;
            const { uuid } = JSON.parse(
                dragEvent.dataTransfer.getData("text/plain")
            );

            if (linkedFeatures.replace(oldUuid, { uuid, optional: false })) {
                feature.setFromUUID(uuid);
            }
        } catch (err) {
            console.error(err);
        }
    }

    function handleDeleteFeature(event) {
        const [_, feature] = event.detail;

        try {
            const { uuid } = feature.get();
            linkedFeatures.remove(uuid);
            feature.setFromUUID(null);
        } catch (err) {
            console.error(err);
        }
    }

    const defaultLanguages = Object.entries(CONFIG.A5E.languages);

    $: languages = $item.system.proficiencies.languages;
</script>

<article>
    <section class="section-wrapper">
        <CustomTagGroup
            heading="A5E.Languages"
            options={defaultLanguages}
            selected={languages.fixed}
            on:updateSelection={({ detail }) =>
                updateDocumentDataFromField(
                    $item,
                    "system.proficiencies.languages.fixed",
                    detail
                )}
        />
    </section>

    <section class="section-wrapper">
        <h3 class="section-title">
            {localize("A5E.AdditionalLanguages")}
        </h3>

        <div class="a5e-input-container a5e-input-container--numeric">
            <input
                class="a5e-input a5e-input--small"
                type="number"
                name="system.proficiencies.languages.count"
                value={$item.system.proficiencies.languages.count -
                    languages.fixed.length ?? 0}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        target.name,
                        Number(target.value) + (languages.fixed.length ?? 0)
                    )}
            />
        </div>
    </section>

    <section class="section-wraper">
        <h3 class="section-title">
            {localize("A5E.TabFeatures")}
        </h3>

        <div class="drop-area__container">
            <DropArea uuid={null} on:item-dropped={handleAddFeature} />

            {#each Object.values($item.system.features) as feature (feature.uuid)}
                <DropArea
                    uuid={feature.uuid}
                    on:item-dropped={handleReplaceFeature}
                    on:item-deleted={handleDeleteFeature}
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
    .section-title {
        font-size: 0.833rem;
        font-family: "Signika", sans-serif;
        font-weight: bold;
        margin-bottom: 0.125rem;
    }
</style>
