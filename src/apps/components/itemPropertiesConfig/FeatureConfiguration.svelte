<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    const item = getContext("item");

    let editMode = false;

    function toggleEditMode() {
        editMode = !editMode;
    }

    const featureTypes = CONFIG.A5E.featureTypes;
</script>

<section>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
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
        on:click={toggleEditMode}
    >
        <h3>{localize("A5E.TabFeatureProperties")}</h3>
        <i
            class="u-text-sm fas"
            class:fa-chevron-up={editMode}
            class:fa-edit={!editMode}
        />
    </header>

    {#if editMode}
        <div class="u-flex u-flex-col u-gap-md">
            <FormSection heading="A5E.FeatureTypePrompt">
                <RadioGroup
                    options={Object.entries(featureTypes)}
                    selected={$item.system.featureType}
                    on:updateSelection={(event) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.featureType",
                            event.detail
                        )}
                />
            </FormSection>
        </div>
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">
                    {localize("A5E.FeatureTypePrompt")}:
                </dt>
                <dd class="u-m-0 u-p-0">
                    {featureTypes[$item.system.featureType] ??
                        localize("A5E.None")}
                </dd>
            </div>
        </dl>
    {/if}
</section>
