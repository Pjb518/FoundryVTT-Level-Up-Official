<script>
    import { getContext } from "svelte";

    import Checkbox from "../components/Checkbox.svelte";
    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";
    import handleDeterministicInput from "../../utils/handleDeterministicInput";

    export let { actor, source, appId } = getContext("#external").application;

    const recoveryOptions = Object.entries(CONFIG.A5E.resourceRecoveryOptions);
    $: resource = $actor.system.resources[source];
</script>

<article class="u-flex u-flex-col u-gap-md">
    <FormSection heading="A5E.Label">
        <input
            class="a5e-input"
            type="text"
            value={resource.label}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $actor,
                    `system.resources.${source}.label`,
                    target.value
                )}
        />
    </FormSection>

    {#if !resource.hideMax}
        <FormSection heading="A5E.GenericResourceMaxFormula">
            <input
                class="a5e-input"
                type="text"
                value={resource.max}
                on:change={({ target }) => {
                    handleDeterministicInput(target.value);
                    updateDocumentDataFromField(
                        $actor,
                        `system.resources.${source}.max`,
                        target.value
                    );
                }}
            />
        </FormSection>
    {/if}

    <FormSection>
        <Checkbox
            label="A5E.GenericResourceHideMax"
            checked={resource.hideMax ?? false}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    `system.resources.${source}.hideMax`,
                    detail
                );
            }}
        />
    </FormSection>

    <FormSection heading="A5E.RecoverResourceAt">
        <RadioGroup
            options={recoveryOptions}
            selected={resource.per}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $actor,
                    `system.resources.${source}.per`,
                    event.detail
                )}
        />
    </FormSection>

    {#if resource.per === "recharge"}
        <FormSection>
            <FormSection
                heading="A5E.ItemRechargeFormula"
                --background="transparent"
                --direction="column"
                --grow="1"
                --padding="0"
            >
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
                            target.value
                        );
                    }}
                />
            </FormSection>

            <FormSection
                heading="A5E.ItemRechargeThreshold"
                --background="transparent"
                --direction="column"
                --padding="0"
            >
                <input
                    class="a5e-input u-text-center"
                    type="number"
                    value={resource.recharge.threshold}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            `system.resources.${source}.recharge.threshold`,
                            Number(target.value)
                        )}
                />
            </FormSection>
        </FormSection>
    {/if}
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
        overflow: auto;
        background: rgba(246, 242, 235, 0.5);
    }
</style>
