<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";
    import handleDeterministicInput from "../utils/handleDeterministicInput";

    export let { actor, source, appId } = getContext("#external").application;

    const recoveryOptions = Object.entries(CONFIG.A5E.resourceRecoveryOptions);
    $: resource = $actor.system.resources[source];
</script>

<article class="u-flex u-flex-col u-gap-md">
    <FormSection heading="A5E.Label">
        <input
            class="a5e-input"
            type="text"
            name="system.resources.{source}.label"
            value={resource.label}
            on:change={({ target }) =>
                updateDocumentDataFromField($actor, target.name, target.value)}
        />
    </FormSection>

    {#if !resource.hideMax}
        <FormSection heading="A5E.GenericResourceMaxFormula">
            <input
                class="a5e-input"
                type="text"
                name="system.resources.{source}.max"
                value={resource.max}
                on:change={({ target }) => {
                    handleDeterministicInput(target.value);
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value
                    );
                }}
            />
        </FormSection>
    {/if}

    <FormSection>
        <div class="u-flex u-gap-md u-align-center">
            <input
                class="a5e-input"
                type="checkbox"
                id="{appId}-resources-{source}-hideMax"
                name="system.resources.{source}.hideMax"
                checked={resource.hideMax ?? false}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.checked
                    )}
            />

            <label
                class="u-pointer u-text-sm"
                for="{appId}-resources-{source}-hideMax"
            >
                {localize("A5E.GenericResourceHideMax")}
            </label>
        </div>
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
        <FormSection heading="A5E.ItemRechargeConfiguration">
            <div class="u-flex u-gap-md u-w-full">
                <div class="recharge-formula">
                    <label
                        class="recharge-formula__label"
                        for="{$actor.id}-resource-${source}-recharge-formula"
                    >
                        {localize("A5E.ItemRechargeFormula")}
                    </label>

                    <input
                        id="{$actor.id}-resource-${source}-recharge-formula"
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
                </div>

                <div class="recharge-threshold">
                    <label
                        class="recharge-threshold__label"
                        for="{$actor.id}-resource-${source}-recharge-threshold"
                    >
                        {localize("A5E.ItemRechargeThreshold")}
                    </label>

                    <input
                        id="{$actor.id}-resource-${source}-recharge-threshold"
                        class="u-text-center"
                        type="number"
                        value={resource.recharge.threshold}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                `system.resources.${source}.recharge.threshold`,
                                Number(target.value)
                            )}
                    />
                </div>
            </div>
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

    .recharge-formula,
    .recharge-threshold {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        white-space: nowrap;
        font-size: 0.833rem;

        &__label {
            display: block;
            padding-right: 0.75rem;
        }
    }

    .recharge-threshold {
        width: fit-content;
        flex-shrink: 0;
    }

    .recharge-formula {
        width: 100%;
    }
</style>
