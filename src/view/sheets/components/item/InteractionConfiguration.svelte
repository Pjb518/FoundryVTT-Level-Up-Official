<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);
    const { interactionTypes } = CONFIG.A5E;

    let editMode = $state(false);
</script>

<Section
    heading="A5E.interactions.properties"
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
            heading="A5E.interactions.type"
            options={Object.entries(interactionTypes)}
            selected={itemStore.interactionType}
            allowDeselect={true}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(item, "system.interactionType", value)}
        />

        {#if ["journey"].includes(itemStore.interactionType)}
            <FieldWrapper heading="Critical Failure">
                <input
                    class="a5e-input a5e-input--slim"
                    type="text"
                    value={itemStore.journeyProperties.criticalFailure || ""}
                    onchange={({ target }) =>
                        updateDocumentDataFromField(
                            item,
                            "system.journeyProperties.criticalFailure",
                            (target as HTMLInputElement).value,
                        )}
                />
            </FieldWrapper>

            <FieldWrapper heading="Failure">
                <input
                    class="a5e-input a5e-input--slim"
                    type="text"
                    value={itemStore.journeyProperties.failure || ""}
                    onchange={({ target }) =>
                        updateDocumentDataFromField(
                            item,
                            "system.journeyProperties.failure",
                            (target as HTMLInputElement).value,
                        )}
                />
            </FieldWrapper>

            <FieldWrapper heading="Success">
                <input
                    class="a5e-input a5e-input--slim"
                    type="text"
                    value={itemStore.journeyProperties.success || ""}
                    onchange={({ target }) =>
                        updateDocumentDataFromField(
                            item,
                            "system.journeyProperties.success",
                            (target as HTMLInputElement).value,
                        )}
                />
            </FieldWrapper>

            <FieldWrapper heading="Critical Success">
                <input
                    class="a5e-input a5e-input--slim"
                    type="text"
                    value={itemStore.journeyProperties.criticalSuccess || ""}
                    onchange={({ target }) =>
                        updateDocumentDataFromField(
                            item,
                            "system.journeyProperties.criticalSuccess",
                            (target as HTMLInputElement).value,
                        )}
                />
            </FieldWrapper>
        {/if}
    {:else}
        <dl class="a5e-dl-box">
            <div class="a5e-dl-box__section">
                <dt class="a5e-dl-box__header">
                    {localize("A5E.interactions.type")}:
                </dt>

                <dd class="a5e-dl-box__content">
                    {localize(interactionTypes[itemStore.interactionType]) ??
                        localize("A5E.None")}
                </dd>
            </div>
        </dl>
    {/if}
</Section>
