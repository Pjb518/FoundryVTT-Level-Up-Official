<script>
    import { getContext } from "svelte";

    import Checkbox from "../components/Checkbox.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import FormSection from "../components/LegacyFormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";
    import Section from "../components/Section.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";
    import handleDeterministicInput from "../../utils/handleDeterministicInput";

    export let { document, source } = getContext("#external").application;

    const actor = document;
    const recoveryOptions = Object.entries(CONFIG.A5E.resourceRecoveryOptions);

    $: resource = $actor.system.resources[source];
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
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $actor,
                    `system.resources.${source}.label`,
                    target.value,
                )}
        />
    </FieldWrapper>

    {#if !resource.hideMax}
        <FieldWrapper heading="A5E.GenericResourceMaxFormula">
            <input
                class="a5e-input"
                type="text"
                value={resource.max}
                on:change={({ target }) => {
                    handleDeterministicInput(target.value);
                    updateDocumentDataFromField(
                        $actor,
                        `system.resources.${source}.max`,
                        target.value,
                    );
                }}
            />
        </FieldWrapper>
    {/if}

    <FieldWrapper>
        <Checkbox
            label="A5E.GenericResourceHideMax"
            checked={resource.hideMax ?? false}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
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
    --a5e-section-body-padding="0 0.25rem"
    --a5e-section-padding="0 0.75rem"
>
    <FieldWrapper heading="A5E.RecoverResourceAt">
        <RadioGroup
            options={recoveryOptions}
            selected={resource.per}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $actor,
                    `system.resources.${source}.per`,
                    event.detail,
                )}
        />
    </FieldWrapper>

    {#if resource.per === "recharge"}
        <FieldWrapper heading="A5E.ItemRechargeFormula">
            <input
                class="a5e-input"
                type="text"
                value={resource.recharge.formula}
                placeholder="1d6"
                on:change={({ target }) => {
                    handleDeterministicInput(target.value);
                    updateDocumentDataFromField(
                        $actor,
                        `system.resources.${source}.recharge.formula`,
                        target.value,
                    );
                }}
            />
        </FieldWrapper>

        <FieldWrapper heading="A5E.ItemRechargeThreshold">
            <input
                class="a5e-input u-text-center"
                type="number"
                value={resource.recharge.threshold}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        `system.resources.${source}.recharge.threshold`,
                        Number(target.value),
                    )}
            />
        </FieldWrapper>
    {/if}
</Section>
