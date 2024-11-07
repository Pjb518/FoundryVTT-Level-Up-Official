<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/util/i18n";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Section from "../Section.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";

    function getClassSummary() {
        const parentClass = $item.system.classes;
	
	return localize(classes[parentClass] ?? classes5e[parentClass]);
    }

    const item = getContext("item");
    const { classes, classes5e, featureTypes } = CONFIG.A5E;

    let editMode = false;
</script>

<Section
    heading="A5E.TabFeatureProperties"
    headerButtons={[
        {
            classes: `fa-solid ${editMode ? "fa-chevron-up" : "fa-edit"}`,
            handler: () => (editMode = !editMode),
        },
    ]}
    --a5e-section-body-gap="0.75rem"
    --a5e-section-heading-gap="0.5rem"
    --a5e-section-heading-template-columns="max-content max-content"
>
    {#if editMode}
        <RadioGroup
            heading="A5E.FeatureTypePrompt"
            options={Object.entries(featureTypes)}
            selected={$item.system.featureType}
            allowDeselect={true}
            on:updateSelection={(event) =>
                updateDocumentDataFromField($item, "system.featureType", event.detail)}
        />

        {#if ["class", "knack"].includes($item.system.featureType)}
            <RadioGroup
                heading="A5E Classes"
                options={Object.entries(classes)}
                selected={$item.system.classes}
                allowDeselect={true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField($item, "system.classes", detail);
                }}
            />

            <RadioGroup
                heading="5E Classes"
                options={Object.entries(classes5e)}
                selected={$item.system.classes}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField($item, "system.classes", detail);
                }}
            />

            <FieldWrapper
                heading="Custom Class"
                hint="Enter the identifier for a custom class."
            >
                <input
                    class="a5e-input a5e-input--slim"
                    type="text"
                    value={$item.system.classes || ""}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.classes",
                            target.value,
                        )}
                />
            </FieldWrapper>
        {/if}

        <FieldWrapper>
            <Checkbox
                label="A5E.SpellConcentration"
                checked={$item.system.concentration}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField($item, "system.concentration", detail);
                }}
            />
        </FieldWrapper>

        <FieldWrapper>
            <Checkbox
                label="A5E.RequiresBloodied"
                checked={$item.system.requiresBloodied}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField($item, "system.requiresBloodied", detail);
                }}
            />
        </FieldWrapper>
    {:else}
        <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
            <div class="u-flex u-gap-md">
                <dt class="u-text-bold">
                    {localize("A5E.FeatureTypePrompt")}:
                </dt>

                <dd class="u-m-0 u-p-0">
                    {featureTypes[$item.system.featureType] ?? localize("A5E.None")}
                </dd>
            </div>

            {#if ["class", "knack"].includes($item.system.featureType) && $item.system.classes}
                <div class="u-flex u-gap-md">
                    <dt class="u-text-bold">Class:</dt>
                    <dd class="u-m-0 u-p-0">{getClassSummary()}</dd>
                </div>
            {/if}
        </dl>
    {/if}
</Section>
