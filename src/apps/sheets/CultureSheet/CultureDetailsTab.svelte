<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import DropArea from "../../components/DropArea.svelte";

    import LinkedDocumentsHelper from "../../utils/LinkedDocumentsHelper";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";
    import { localizeLanguage } from "../../utils/languageHelpers";

    import LanguageSelectDialog from "../../dialogs/LanguageSelect/LanguageSelectDialog";

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

    function openLanguage() {
        let dialog = new LanguageSelectDialog({
            languages: $item.system.languages.base,
        });
        dialog.render(true);
        dialog.promise.then((langs) => {
            if (langs) $item.update({ "system.languages.base": langs });
        });
    }
</script>

<section class="main-config-wrapper">
    <div class="drop-area-wrapper">
        <h3>{localize("A5E.TabFeatures")}</h3>

        <ul class="drop-area-list">
            {#each Object.values($item.system.features) as feature (feature.uuid)}
                <li>
                    <DropArea
                        uuid={feature.uuid}
                        on:item-dropped={handleReplaceFeature}
                        on:item-deleted={handleDeleteFeature}
                    />
                </li>
            {/each}

            <li>
                <DropArea uuid={null} on:item-dropped={handleAddFeature} />
            </li>
        </ul>
    </div>

    <div class="config-wrapper">
        <h3>{localize("A5E.Languages")}</h3>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <i
            class="a5e-config-button config-button fa fa-cog"
            on:click|preventDefault|stopPropagation={openLanguage}
        />
        <ul class="tag-list">
            {#each $item.system.languages.base as lang}
                <li class="a5e-tag">{localizeLanguage(lang)}</li>
            {/each}
        </ul>
    </div>

    <div class="config-wrapper">
        <h3>{localize("A5E.AdditionalLanguages")}</h3>
        <input
            class="a5e-input"
            type="number"
            value={$item.system.languages.additional}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    "system.languages.additional",
                    parseInt(target.value)
                )}
        />
    </div>
</section>

<style lang="scss">
    .main-config-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0.75rem;
        overflow-y: auto;
    }

    .tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        list-style: none;
    }

    .config-wrapper {
        position: relative;
        h3 {
            border-bottom: 1px solid rgba(0, 0, 0, 0.2);
            margin-bottom: 0.5rem;
        }
    }

    .config-button {
        position: absolute;
        top: 0rem;
        right: 1rem;
    }

    .drop-area-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-family: "Modesto Condensed", serif;
        font-size: 1rem;
    }

    .drop-area-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }
</style>
