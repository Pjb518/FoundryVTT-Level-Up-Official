<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import Section from "#view/snippets/Section.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    function prepareShieldProperties() {
        let properties = itemStore.shieldProperties.map(
            (key: string) => localize(shieldProperties[key]) ?? key,
        );

        properties.sort((a, b) => a.localeCompare(b));
        return properties.join(", ");
    }

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);
    const { shieldTypes, shieldProperties } = CONFIG.A5E;

    let editMode = $state(false);
    let selectedShieldProperties = $derived(prepareShieldProperties());
</script>

<Section
    heading="A5E.objects.shields.configuration"
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
            heading="A5E.objects.shields.category"
            options={Object.entries(shieldTypes)}
            selected={itemStore.shieldCategory}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(item, "system.shieldCategory", value)}
        />

        <CheckboxGroup
            heading="A5E.objects.shields.properties"
            options={Object.entries(shieldProperties)}
            selected={itemStore.shieldProperties}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(item, "system.shieldProperties", value)}
        />
    {:else}
        <dl class="a5e-dl-box">
            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.objects.shields.category")}:
                </dt>
                <dd class="a5e-dl-box__content">
                    {#if itemStore.shieldCategory}
                        {shieldTypes[itemStore.shieldCategory] ??
                            itemStore.shieldCategory}
                    {:else}
                        {localize("A5E.None")}
                    {/if}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.objects.shields.properties")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {#if itemStore.shieldProperties?.length}
                        {selectedShieldProperties}
                    {:else}
                        {localize("A5E.None")}
                    {/if}
                </dd>
            </div>
        </dl>
    {/if}
</Section>
