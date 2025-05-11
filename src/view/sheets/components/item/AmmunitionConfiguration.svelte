<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    function prepareAmmunitionProperties() {
        const properties = itemStore.ammunitionProperties.map(
            (property) => ammunitionProperties[property] ?? property,
        );

        properties.sort((a, b) => a.localeCompare(b));

        return properties.join(", ");
    }

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);
    const { ammunitionProperties } = CONFIG.A5E;

    let editMode = $state(false);
    let selectedAmmunitionProperties = $derived(prepareAmmunitionProperties());
</script>

<Section
    heading="Ammunition Configuration"
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
            heading="A5E.AmmunitionProperties"
            options={Object.entries(ammunitionProperties)}
            selected={itemStore.ammunitionProperties}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(
                    item,
                    "system.ammunitionProperties",
                    value,
                )}
        />
    {:else}
        <dl class="a5e-dl-box">
            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.AmmunitionProperties")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {selectedAmmunitionProperties || localize("A5E.None")}
                </dd>
            </div>
        </dl>
    {/if}
</Section>
