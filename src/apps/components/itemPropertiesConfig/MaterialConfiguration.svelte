<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import FormSection from "../LegacyFormSection.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";

    function prepareMaterialProperties(item) {
        const properties = item.system.materialProperties.map(
            (property) => materialProperties[property] ?? property,
        );

        properties.sort((a, b) => a.localeCompare(b));

        return properties.join(", ");
    }

    const item = getContext("item");
    const { materialProperties } = CONFIG.A5E;

    let editMode = false;

    $: selectedMaterialProperties = prepareMaterialProperties($item);
</script>

<section>
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <header
        class="
            u-align-center
            u-flex
            u-font-serif
            u-gap-md
            u-mb-lg
            u-ml-xs
            u-pointer
            u-text-lg
            u-w-fit
        "
        on:click={() => (editMode = !editMode)}
    >
        <h3>{localize("A5E.MaterialProperties")}</h3>

        <i
            class="u-text-sm fas"
            class:fa-chevron-up={editMode}
            class:fa-edit={!editMode}
        />
    </header>

    {#if editMode}
        <div class="u-flex u-flex-col u-gap-md">
            <FormSection heading="A5E.MaterialProperties">
                <CheckboxGroup
                    options={Object.entries(materialProperties)}
                    selected={$item.system.materialProperties}
                    on:updateSelection={(event) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.materialProperties",
                            event.detail,
                        )}
                />
            </FormSection>
        </div>
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">
                    {localize("A5E.MaterialProperties")}:
                </dt>

                <dd class="u-m-0 u-p-0">
                    {selectedMaterialProperties || localize("A5E.None")}
                </dd>
            </div>
        </dl>
    {/if}
</section>
