<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    function prepareProperties(
        properties: string[],
        config: Record<string, string>,
    ) {
        let props = properties.map(
            (property) => localize(config[property]) ?? property,
        );
        props.sort((a, b) => a.localeCompare(b));

        return props.join(", ");
    }

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);
    const {
        armor: armorTypes,
        armorProperties,
        armorMods,
        repairTools,
    } = CONFIG.A5E;

    let editMode = $state(false);
    let selectedArmorMods = $derived(
        prepareProperties(itemStore.armorMods, armorMods),
    );
    let selectedArmorProperties = $derived(
        prepareProperties(itemStore.armorProperties, armorProperties),
    );
    let selectedRepairabilityProperties = $derived(
        prepareProperties(itemStore.repairTools, repairTools),
    );
    let repairabilityDC = $derived(itemStore.repairabilityDC);
</script>

<Section
    heading="Armor Configuration"
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
            heading="A5E.ArmorCategory"
            options={Object.entries(armorTypes)}
            selected={itemStore.armorCategory}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(
                    item,
                    "system.armorCategory",
                    value,
                )}
        />

        <CheckboxGroup
            heading="A5E.ArmorProperties"
            options={Object.entries(armorProperties)}
            selected={itemStore.armorProperties}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(
                    item,
                    "system.armorProperties",
                    value,
                )}
        />

        <CheckboxGroup
            heading="A5E.ArmorMods"
            options={Object.entries(armorMods)}
            selected={itemStore.armorMods}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(item, "system.armorMods", value)}
        />

        <Section --a5e-section-body-direction="row">
            <FieldWrapper heading="A5E.RepairabilityDC">
                <input
                    class="a5e-input a5e-input--slim"
                    type="number"
                    id="{item.uuid}-repairabilityDC"
                    value={itemStore.repairabilityDC ?? 0}
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            item,
                            "system.repairabilityDC",
                            Number(currentTarget.value),
                        )}
                />
            </FieldWrapper>

            <CheckboxGroup
                heading="A5E.RepairabilityTools"
                options={Object.entries(repairTools)}
                selected={itemStore.repairTools}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(
                        item,
                        "system.repairTools",
                        value,
                    )}
            />
        </Section>
    {:else}
        <dl class="a5e-dl-box">
            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.ArmorCategory")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {#if itemStore.armorCategory}
                        {armorTypes[itemStore.armorCategory] ??
                            itemStore.armorCategory}
                    {:else}
                        {localize("A5E.None")}
                    {/if}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("Armor Properties")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {selectedArmorProperties || localize("A5E.None")}
                </dd>
            </div>

            {#if selectedArmorMods}
                <div class="a5e-dl-box__section">
                    <dt class="a5e-dl-box__header">
                        {localize("A5E.ArmorMods")}:
                    </dt>

                    <dd class="a5e-dl-box__content">
                        {selectedArmorMods}
                    </dd>
                </div>
            {/if}

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.RepairabilityDC")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {#if repairabilityDC != "0"}
                        DC {repairabilityDC},
                    {/if}

                    {selectedRepairabilityProperties}
                </dd>
            </div>
        </dl>
    {/if}
</Section>
