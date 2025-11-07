<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    function getClassSummary() {
        const parentClass = itemStore.classes;

        return localize(classes[parentClass] ?? classes5e[parentClass]) || parentClass;
    }

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);
    const { classes, classes5e, featureTypes } = CONFIG.A5E;

    let editMode = $state(false);
</script>

<Section
    heading="A5E.objects.materialProperties"
    headerButtons={[
        {
            classes: `icon fa-solid ${editMode ? "fa-chevron-up" : "fa-edit"}`,
            handler: () => (editMode = !editMode),
        },
    ]}
    --a5e-section-body-gap="0.75rem"
    --a5e-section-heading-gap="0.5rem"
    --a5e-section-heading-template-columns="max-content max-content"
>
    {#if editMode}
        <RadioGroup
            heading="A5E.features.typePrompt"
            options={Object.entries(featureTypes)}
            selected={itemStore.featureType}
            allowDeselect={true}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(item, "system.featureType", value)}
        />

        {#if ["class", "knack"].includes(itemStore.featureType)}
            <RadioGroup
                heading="A5E Classes"
                options={Object.entries(classes)}
                selected={itemStore.classes}
                allowDeselect={true}
                onUpdateSelection={(value) => {
                    updateDocumentDataFromField(item, "system.classes", value);
                }}
            />

            <RadioGroup
                heading="5E Classes"
                options={Object.entries(classes5e)}
                selected={itemStore.classes}
                onUpdateSelection={(value) => {
                    updateDocumentDataFromField(item, "system.classes", value);
                }}
            />

            <FieldWrapper
                heading="Custom Class"
                hint="Enter the identifier for a custom class."
            >
                <input
                    class="a5e-input a5e-input--slim"
                    type="text"
                    value={itemStore.classes || ""}
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            item,
                            "system.classes",
                            currentTarget.value,
                        )}
                />
            </FieldWrapper>
        {/if}

        <FieldWrapper>
            <Checkbox
                label="A5E.SpellConcentration"
                checked={itemStore.concentration}
                onUpdateSelection={(value) => {
                    updateDocumentDataFromField(item, "system.concentration", value);
                }}
            />
        </FieldWrapper>

        <FieldWrapper>
            <Checkbox
                label="A5E.items.requiresBloodied"
                checked={itemStore.requiresBloodied}
                onUpdateSelection={(value) => {
                    updateDocumentDataFromField(item, "system.requiresBloodied", value);
                }}
            />
        </FieldWrapper>
    {:else}
        <dl class="a5e-dl-box">
            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.features.typePrompt")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {localize(featureTypes[itemStore.featureType]) ??
                        localize("A5E.None")}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">Requires Bloodied:</dt>

                <dd class="a5e-dl-box__content">
                    {itemStore.requiresBloodied ? "Yes" : "No"}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">Requires Concentration:</dt>

                <dd class="a5e-dl-box__content">
                    {itemStore.concentration ? "Yes" : "No"}
                </dd>
            </div>

            {#if ["class", "knack"].includes(itemStore.featureType) && itemStore.classes}
                <div class="a5e-dl-box__section">
                    <dt class="a5e-dl-box__header">"Class: "</dt>

                    <dd class="a5e-dl-box__content">
                        {getClassSummary()}
                    </dd>
                </div>
            {/if}
        </dl>
    {/if}
</Section>
