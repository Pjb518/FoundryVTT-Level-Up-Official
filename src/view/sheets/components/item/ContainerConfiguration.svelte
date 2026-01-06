<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);
    const { A5E } = CONFIG;

    let editMode = $state(false);
</script>

<Section
    heading="A5E.tabs.containerProperties"
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
            heading="Capacity Type"
            options={Object.entries(A5E.capacityTypes)}
            selected={itemStore.capacity.type}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(item, "system.capacity.type", value)}
        />

        <FieldWrapper heading="Max Capacity">
            <input
                class="a5e-input a5e-input--small a5e-input--slim"
                type="number"
                min="0"
                value={itemStore.capacity.value}
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        item,
                        "system.capacity.value",
                        Number(currentTarget.value),
                    )}
            />
        </FieldWrapper>

        <FieldWrapper>
            <Checkbox
                label="Has Weightless Contents"
                checked={itemStore.capacity.weightlessContents}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(
                        item,
                        "system.capacity.weightlessContents",
                        value,
                    )}
            />
        </FieldWrapper>

        <RadioGroup
            heading="Sort Method"
            options={Object.entries(A5E.containerSortMethods)}
            selected={itemStore.containerSortMethod}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(item, "system.containerSortMethod", value)}
        />

        {#if itemStore.containerSortMethod !== "none"}
            <RadioGroup
                heading="Sort Direction"
                options={Object.entries(A5E.containerSortDirections)}
                selected={itemStore.containerSortDirection}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(
                        item,
                        "system.containerSortDirection",
                        value,
                    )}
            />
        {/if}
    {:else}
        <dl class="a5e-dl-box">
            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">Capacity Type:</dt>

                <dd class="a5e-dl-box__content">
                    {localize(A5E.capacityTypes[itemStore.capacity.type]) ??
                        localize("A5E.None")}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">Max Capacity:</dt>
                <dd class="a5e-dl-box__content">
                    {itemStore.capacity.value ?? 0}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">Has Weightless Contents:</dt>

                <dd class="a5e-dl-box__content">
                    {itemStore.capacity.weightlessContents ? "Yes" : "No"}
                </dd>
            </div>

            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">Sort Method:</dt>
                <dd class="a5e-dl-box__content">
                    {localize(A5E.containerSortMethods[itemStore.containerSortMethod]) ??
                        localize("A5E.None")}
                </dd>
            </div>

            {#if itemStore.containerSortMethod !== "none"}
                <div class="a5e-dl-box__section">
                    <dt class="a5e-dl-box__header">Sort Direction:</dt>
                    <dd class="a5e-dl-box__content">
                        {localize(
                            A5E.containerSortDirections[itemStore.containerSortDirection],
                        )}
                    </dd>
                </div>
            {/if}
        </dl>
    {/if}
</Section>
