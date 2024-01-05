<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import getDeterministicBonus from "../../../dice/getDeterministicBonus";
    import handleDeterministicInput from "../../../utils/handleDeterministicInput";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    function prepareUsesSummary(item) {
        const { uses } = item.system;

        const maxUses = item.actor
            ? getDeterministicBonus(
                  uses?.max ?? 0,
                  item.actor?.getRollData() ?? {},
              )
            : uses?.max;

        let summary;

        if (uses.value && maxUses) summary = `${uses.value} / ${maxUses}`;
        else if (uses.value && !maxUses) summary = uses.value;
        else if (!uses.value && maxUses) summary = `0 / ${maxUses}`;
        else return null;

        if (uses.per === "recharge") {
            summary = `${summary} (Recharges on ${uses.recharge.threshold})`;
        } else if (uses.per) {
            summary = `${summary} (Per ${resourceRecoveryOptions[uses.per]})`;
        }

        return summary;
    }

    const item = getContext("item");
    const { resourceRecoveryOptions } = CONFIG.A5E;

    let editMode = false;

    $: usesSummary = prepareUsesSummary($item);
</script>

<Section
    heading="A5E.ItemUsesConfiguration"
    headerButtons={[
        {
            classes: `fa-solid ${editMode ? "fa-chevron-up" : "fa-edit"}`,
            handler: () => (editMode = !editMode),
        },
    ]}
    --a5e-section-body-gap="0.75rem"
    --a5e-section-body-padding="0 0.125rem"
    --a5e-section-margin="0"
    --a5e-section-heading-gap="0.5rem"
    --a5e-section-heading-template-columns="max-content max-content"
>
    {#if editMode}
        <Section
            --a5e-section-body-direction="row"
            --a5e-section-body-gap="0.5rem"
            --a5e-section-body-padding="0 0.25rem"
            --a5e-section-margin="0"
        >
            <FieldWrapper heading="A5E.UsesCurrent">
                <input
                    class="a5e-input"
                    type="number"
                    d-type="Number"
                    name="system.uses.value"
                    value={$item.system.uses.value}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            target.name,
                            Number(target.value),
                        )}
                />
            </FieldWrapper>

            <FieldWrapper heading="A5E.UsesMax">
                <input
                    class="a5e-input"
                    type="text"
                    name="system.uses.max"
                    value={$item.system.uses.max}
                    on:change={({ target }) => {
                        handleDeterministicInput(target.value);
                        updateDocumentDataFromField(
                            $item,
                            target.name,
                            target.value,
                        );
                    }}
                />
            </FieldWrapper>

            <FieldWrapper heading="A5E.UsesPer">
                <select
                    class="u-h-8 u-w-40"
                    name="system.uses.per"
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            target.name,
                            target.value,
                        )}
                >
                    <option value="" />

                    {#each Object.entries(resourceRecoveryOptions) as [key, name]}
                        <option
                            {key}
                            value={key}
                            selected={$item.system.uses.per === key}
                        >
                            {localize(name)}
                        </option>
                    {/each}
                </select>
            </FieldWrapper>
        </Section>

        {#if $item.system.uses.per === "recharge"}
            <Section
                heading="A5E.ItemRechargeConfiguration"
                --a5e-section-body-direction="row"
                --a5e-section-body-gap="0.5rem"
                --a5e-section-body-padding="0 0.25rem"
                --a5e-section-margin="0"
            >
                <FieldWrapper heading="A5E.ItemRechargeFormula">
                    <input
                        id="{$item.id}-recharge-formula"
                        type="text"
                        value={$item.system.uses.recharge.formula}
                        placeholder="1d6"
                        on:change={({ target }) => {
                            handleDeterministicInput(target.value);
                            updateDocumentDataFromField(
                                $item,
                                `system.uses.recharge.formula`,
                                target.value,
                            );
                        }}
                    />
                </FieldWrapper>

                <FieldWrapper heading="A5E.ItemRechargeThreshold">
                    <input
                        id="{$item.id}-recharge-threshold"
                        class="u-text-center"
                        type="number"
                        value={$item.system.uses.recharge.threshold}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                `system.uses.recharge.threshold`,
                                Number(target.value),
                            )}
                    />
                </FieldWrapper>
            </Section>
        {/if}
    {:else}
        <dl class="a5e-box u-flex u-gap-sm u-m-0 u-p-md u-text-sm">
            <dt class="u-text-bold">{localize("A5E.Uses")}:</dt>

            <dd
                class="align-center u-flex u-gap-sm u-m-0 u-p-0"
                data-tooltip={$item.system.uses.per === "recharge"
                    ? $item.system.uses.recharge.formula
                    : null}
                data-tooltip-direction="UP"
            >
                {usesSummary || localize("A5E.None")}
            </dd>
        </dl>
    {/if}
</Section>
