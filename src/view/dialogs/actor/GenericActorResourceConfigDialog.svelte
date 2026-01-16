<script>
    import { getContext } from "svelte";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";
    import handleDeterministicInput from "#utils/handleDeterministicInput.ts";

    let { document, source } = $props();

    const actor = document;
    const recoveryOptions = Object.entries(CONFIG.A5E.resourceRecoveryOptions);

    const resource = $derived(actor.system.resources[source]);
</script>

<Section
    --a5e-section-body-padding="0.75rem"
    --a5e-section-body-gap="0.75rem"
    --a5e-section-margin="0 0 0.25rem 0"
>
    <FieldWrapper heading="A5E.Label">
        <input
            class="a5e-input"
            type="text"
            value={resource.label}
            onchange={({ target }) =>
                updateDocumentDataFromField(
                    actor,
                    `system.resources.${source}.label`,
                    target.value,
                )}
        />
    </FieldWrapper>

    {#if !resource.hideMax}
        <FieldWrapper heading="A5E.genericResources.maxFormula">
            <input
                class="a5e-input"
                type="text"
                value={resource.max}
                onchange={({ target }) => {
                    handleDeterministicInput(target.value);
                    updateDocumentDataFromField(
                        actor,
                        `system.resources.${source}.max`,
                        target.value,
                    );
                }}
            />
        </FieldWrapper>
    {/if}

    <FieldWrapper>
        <CheckboxGroup
            label="A5E.genericResources.hideMax"
            checked={resource.hideMax ?? false}
            onupdateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    actor,
                    `system.resources.${source}.hideMax`,
                    detail,
                );
            }}
        />
    </FieldWrapper>
</Section>

<Section
    heading="Recovery Configuration"
    --a5e-section-body-gap="0.75rem"
    --a5e-section-padding="0 0.75rem 0.75rem 0.75rem"
>
    <RadioGroup
        heading="A5E.consumers.recoverResourceAt"
        options={recoveryOptions}
        selected={resource.per}
        onupdateSelection={(event) =>
            updateDocumentDataFromField(
                actor,
                `system.resources.${source}.per`,
                event.detail,
            )}
    />

    {#if resource.per === "recharge"}
        <FieldWrapper heading="A5E.actions.headings.recharge.formula">
            <input
                class="a5e-input"
                type="text"
                value={resource.recharge.formula}
                placeholder="1d6"
                onchange={({ target }) => {
                    handleDeterministicInput(target.value);
                    updateDocumentDataFromField(
                        actor,
                        `system.resources.${source}.recharge.formula`,
                        target.value,
                    );
                }}
            />
        </FieldWrapper>

        <FieldWrapper heading="A5E.actions.headings.recharge.threshold">
            <input
                class="a5e-input u-text-center"
                type="number"
                value={resource.recharge.threshold}
                onchange={({ target }) =>
                    updateDocumentDataFromField(
                        actor,
                        `system.resources.${source}.recharge.threshold`,
                        Number(target.value),
                    )}
            />
        </FieldWrapper>
    {/if}
</Section>
