<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import LinkedDocumentsHelper from "../../utils/LinkedDocumentsHelper";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";
    import prepareLanguageProficiencies from "../../handlers/prepareLanguageProficiencies";

    import LanguageSelectDialog from "../../dialogs/initializers/LanguageSelectDialog";

    import DropArea from "../DropArea.svelte";
    import CustomTagGroup from "../CustomTagGroup.svelte";

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

    async function openLanguageSelectDialog() {
        const dialog = new LanguageSelectDialog($item.name, {
            selected: $item.system.proficiencies.languages,
        });

        dialog.render(true);
        const newLanguages = await dialog.promise;

        if (newLanguages) {
            $item.update({ "system.proficiencies.languages": newLanguages });
        }
    }

    const defaultLanguages = Object.entries(CONFIG.A5E.languages);
</script>

<article>
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

    <section class="section-wrapper">
        <CustomTagGroup
            heading="A5E.Languages"
            options={defaultLanguages}
            selected={$item.system.proficiencies.languages}
            name="system.proficiencies.languages"
            document={item}
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
                name="system.proficiencies.additionalLanguages"
                value={$item.system.proficiencies.additionalLanguages}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        target.name,
                        Number(target.value)
                    )}
            />
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
