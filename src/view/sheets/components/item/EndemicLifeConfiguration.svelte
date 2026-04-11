<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import Section from "#view/snippets/Section.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);
    const {
        actorSizes,
        biomes,
        creatureTypes,
        endemicProperties,
        endemicTypes,
        regions,
    } = CONFIG.A5E;

    let editMode = $state(false);
</script>

<Section
    heading="A5E.objects.endemicLife.configuration"
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
            heading="A5E.objects.endemicLife.labels.type"
            options={Object.entries(endemicTypes)}
            selected={itemStore.endemicLifeProperties.type}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(
                    item,
                    "system.endemicLifeProperties.type",
                    value,
                )}
        />

        <RadioGroup
            heading="A5E.objects.endemicLife.labels.size"
            options={Object.entries(actorSizes)}
            selected={itemStore.endemicLifeProperties.size}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(
                    item,
                    "system.endemicLifeProperties.size",
                    value,
                )}
        />

        {#if itemStore.endemicLifeProperties.type === "creature"}
            <RadioGroup
                heading="A5E.details.creature.labels.type"
                options={Object.entries(creatureTypes)}
                selected={itemStore.endemicLifeProperties.creatureType}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(
                        item,
                        "system.endemicLifeProperties.creatureType",
                        value,
                    )}
            />
        {/if}

        <CheckboxGroup
            heading="A5E.objects.endemicLife.labels.biomes"
            options={Object.entries(biomes)}
            selected={itemStore.endemicLifeProperties.biomes}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(
                    item,
                    "system.endemicLifeProperties.biomes",
                    value,
                )}
        />

        <CheckboxGroup
            heading="A5E.objects.endemicLife.labels.regions"
            options={Object.entries(regions)}
            selected={itemStore.endemicLifeProperties.regions}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(
                    item,
                    "system.endemicLifeProperties.regions",
                    value,
                )}
        />

        <CheckboxGroup
            heading="A5E.objects.endemicLife.labels.properties"
            options={Object.entries(endemicProperties)}
            selected={itemStore.endemicLifeProperties.properties}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(
                    item,
                    "system.endemicLifeProperties.properties",
                    value,
                )}
        />
    {:else}
        <dl class="a5e-dl-box">
            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.objects.endemicLife.labels.type")}:
                </dt>
                <dd class="a5e-dl-box__content">
                    {#if itemStore.endemicLifeProperties.type}
                        {#if itemStore.endemicLifeProperties.type !== "creature"}
                            {localize(
                                endemicTypes[itemStore.endemicLifeProperties.type] ??
                                    itemStore.endemicLifeProperties.type,
                            )}
                        {:else if itemStore.endemicLifeProperties.creatureType}
                            {creatureTypes[
                                itemStore.endemicLifeProperties.creatureType
                            ] ?? itemStore.endemicLifeProperties.creatureType}
                        {:else}
                            {localize("A5E.objects.endemicLife.types.creature")}
                        {/if}
                    {:else}
                        {localize("A5E.None")}
                    {/if}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.objects.endemicLife.labels.size")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {#if itemStore.endemicLifeProperties.size}
                        {actorSizes[itemStore.endemicLifeProperties.size] ??
                            itemStore.endemicLifeProperties.size}
                    {:else}
                        {localize("A5E.None")}
                    {/if}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.objects.endemicLife.labels.biomes")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {#if itemStore.endemicLifeProperties.biomes.length}
                        {itemStore.endemicLifeProperties.biomes
                            .map((biome) => localize(biomes[biome]))
                            .join(", ")}
                    {:else}
                        {localize("A5E.None")}
                    {/if}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.objects.endemicLife.labels.regions")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {#if itemStore.endemicLifeProperties.regions.length}
                        {itemStore.endemicLifeProperties.regions
                            .map((region) => localize(regions[region]))
                            .join(", ")}
                    {:else}
                        {localize("A5E.None")}
                    {/if}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.objects.endemicLife.labels.properties")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {#if itemStore.endemicLifeProperties.properties.length}
                        {itemStore.endemicLifeProperties.properties
                            .map((property) => localize(endemicProperties[property]))
                            .join(", ")}
                    {:else}
                        {localize("A5E.None")}
                    {/if}
                </dd>
            </div>
        </dl>
    {/if}
</Section>
