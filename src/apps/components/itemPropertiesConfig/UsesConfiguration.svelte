<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import getDeterministicBonus from "../../../dice/getDeterministicBonus";
    import handleDeterministicInput from "../../../utils/handleDeterministicInput";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import FormSection from "../LegacyFormSection.svelte";

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

<section>
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <header
        class="
            u-align-center
            u-flex
            u-font-serif
            u-gap-md
            u-mb-lg
            u-ml-xs
            u-pointer
            u-text-lg
            u-w-fit
        "
        on:click={() => (editMode = !editMode)}
    >
        <h3>{localize("A5E.ItemUsesConfiguration")}</h3>

        <i
            class="u-text-sm fas"
            class:fa-chevron-up={editMode}
            class:fa-edit={!editMode}
        />
    </header>

    {#if editMode}
        <div class="u-flex u-flex-col u-gap-md">
            <FormSection heading="A5E.Uses">
                <div class="u-flex u-gap-lg u-w-full">
                    <div class="u-flex u-flex-col u-gap-xs u-w-30">
                        <h3 class="u-text-sm">{localize("A5E.UsesCurrent")}</h3>

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
                    </div>

                    <div class="u-flex u-flex-col u-gap-xs u-w-30">
                        <h3 class="u-text-sm">{localize("A5E.UsesMax")}</h3>

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
                    </div>

                    <div class="u-flex u-flex-col u-gap-xs u-w-fit">
                        <h3 class="u-text-sm">{localize("A5E.UsesPer")}</h3>

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
                    </div>
                </div>
            </FormSection>

            {#if $item.system.uses.per === "recharge"}
                <FormSection heading="A5E.ItemRechargeConfiguration">
                    <div class="u-flex u-gap-md u-w-full">
                        <div class="recharge-formula">
                            <label
                                class="recharge-formula__label"
                                for="{$item.id}-recharge-formula"
                            >
                                {localize("A5E.ItemRechargeFormula")}
                            </label>

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
                        </div>

                        <div class="recharge-threshold">
                            <label
                                class="recharge-threshold__label"
                                for="{$item.id}-recharge-threshold"
                            >
                                {localize("A5E.ItemRechargeThreshold")}
                            </label>

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
                        </div>
                    </div>
                </FormSection>
            {/if}
        </div>
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
</section>

<style lang="scss">
    .recharge-formula,
    .recharge-threshold {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        white-space: nowrap;
        font-size: $font-size-sm;

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
