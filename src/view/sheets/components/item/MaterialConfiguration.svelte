<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import getMaterialProperties from "#utils/summaries/getMaterialProperties.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);

    const { flaws, materialProperties, modPorts } = CONFIG.A5E;

    let editMode = $state(false);
    let selectedMaterialProperties = $derived(
        getMaterialProperties(item.reactive).filter(Boolean).join(", "),
    );
</script>

<Section
    heading="A5E.TabFeatureProperties"
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
        <CheckboxGroup
            heading="A5E.MaterialProperties"
            options={Object.entries(materialProperties)}
            selected={itemStore.materialProperties}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(
                    item,
                    "system.materialProperties",
                    value,
                )}
        />

        {#if itemStore.materialProperties.includes("flaw")}
            <CheckboxGroup
                heading="Flaw Properties"
                options={Object.entries(flaws)}
                selected={itemStore.flaws}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(item, "system.flaws", value)}
            />
        {/if}

        {#if itemStore.materialProperties.includes("spacefaring")}
            <RadioGroup
                heading="Spacefaring Mod Port Property"
                options={Object.entries(modPorts)}
                selected={itemStore.modPorts}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(item, "system.modPorts", value)}
            />
        {/if}
    {:else}
        <dl class="a5e-dl-box">
            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.MaterialProperties")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {selectedMaterialProperties || localize("A5E.None")}
                </dd>
            </div>

            {#if itemStore.materialProperties.includes("spacefaring")}
                <div class="a5e-dl-box__section">
                    <dt class="a5e-dl-box__header">Spacefaring Mod Port:</dt>

                    <dd class="a5e-dl-box__content">
                        {itemStore.modPorts || localize("A5E.None")}
                    </dd>
                </div>
            {/if}
        </dl>
    {/if}
</Section>
