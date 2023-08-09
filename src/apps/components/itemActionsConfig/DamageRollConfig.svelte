<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";
    import ScalingConfigDialog from "../../dialogs/initializers/DamageScalingConfigDialog";

    import getOrdinalNumber from "../../../utils/getOrdinalNumber";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    function getScalingSummary(roll) {
        const mode = roll.scaling?.mode;
        const formula = roll.scaling?.formula ?? 0;
        const damageType = damageTypes[roll.damageType];

        // TODO: Provide some means of getting a base spell level for non-spell items.
        const level = getOrdinalNumber($item.system.level ?? 1);
        const step = roll.scaling?.step;

        if (mode === "cantrip") {
            return localize("A5E.scaling.summaries.cantrip.damage", {
                formula,
                damageType,
            });
        }

        if (mode === "spellLevel") {
            if (!step || step === 1) {
                return localize("A5E.scaling.summaries.spellLevel.damage", {
                    formula,
                    level,
                    damageType,
                });
            } else {
                return localize(
                    "A5E.scaling.summaries.steppedSpellLevel.damage",
                    { formula, step, level, damageType }
                );
            }
        }

        if (mode === "spellPoints") {
            if (!roll.scaling?.step || roll.scaling?.step === 1) {
                return localize("A5E.scaling.summaries.spellPoint.damage", {
                    formula,
                });
            } else {
                return localize(
                    "A5E.scaling.summaries.steppedSpellPoint.damage",
                    { formula, step }
                );
            }
        }

        if (["actionUses", "itemUses"].includes(mode)) {
            if (!roll.scaling?.step || roll.scaling?.step === 1) {
                return localize("A5E.scaling.summaries.uses.damage", {
                    formula,
                });
            } else {
                return localize("A5E.scaling.summaries.steppedUses.damage", {
                    formula,
                    step,
                });
            }
        }

        return null;
    }

    function onClickScalingButton() {
        const dialog = new ScalingConfigDialog($item, actionId, rollId);
        dialog.render(true);
    }

    const item = getContext("item");
    const actionId = getContext("actionId");

    const { damageTypes } = CONFIG.A5E;

    export let roll;
    export let rollId;

    $: scalingSummary = getScalingSummary(roll);
</script>

<FormSection
    heading="A5E.Label"
    --background="none"
    --direction="column"
    --padding="0"
    --margin="0 4.5rem 0 0"
>
    <input
        type="text"
        value={roll.label ?? ""}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.label`,
                target.value
            )}
    />
</FormSection>

<FormSection --background="none" --padding="0" hint={scalingSummary}>
    <FormSection
        heading="A5E.DamageFormula"
        --background="none"
        --grow="1"
        --direction="column"
        --padding="0"
    >
        <div class="u-flex u-gap-sm u-w-full">
            <input
                id="{actionId}-{rollId}-damage-formula"
                type="text"
                value={roll.formula ?? ""}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.rolls.${rollId}.formula`,
                        target.value
                    )}
            />

            <button
                class="scaling-button"
                on:click|preventDefault={onClickScalingButton}
            >
                <i
                    class="fa-solid fa-arrow-up-right-dots"
                    data-tooltip="A5E.ConfigureDamageScaling"
                    data-tooltip-direction="UP"
                />
            </button>
        </div>
    </FormSection>

    <FormSection
        heading="A5E.DamageType"
        --background="none"
        --direction="column"
        --padding="0"
    >
        <select
            id="{actionId}-{rollId}-damage-type"
            class="u-w-fit damage-type-select"
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.damageType`,
                    target.value
                )}
        >
            <option value={null} selected={roll.damageType === "null"}>
                {localize("A5E.None")}
            </option>

            {#each Object.entries(damageTypes) as [key, name] (key)}
                <option value={key} selected={roll.damageType === key}>
                    {localize(name)}
                </option>
            {/each}
        </select>
    </FormSection>
</FormSection>

<Checkbox
    label="A5E.DamageDoubleOnCrit"
    checked={roll.canCrit ?? true}
    on:updateSelection={({ detail }) => {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.rolls.${rollId}.canCrit`,
            detail
        );
    }}
/>

{#if roll.canCrit ?? true}
    <FormSection
        heading="A5E.DamageBonusOnCrit"
        hint="When you score a critical hit, this damage is added after doubling
    the attack's damage."
        --background="none"
        --direction="column"
        --padding="0"
    >
        <input
            id="{actionId}-{rollId}-crit-bonus"
            type="text"
            value={roll.critBonus ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.critBonus`,
                    target.value
                )}
        />
    </FormSection>
{/if}

<Checkbox
    label="A5E.DamageDefaultSelection"
    checked={roll.default ?? true}
    on:updateSelection={({ detail }) => {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.rolls.${rollId}.default`,
            detail
        );
    }}
/>

<style lang="scss">
    .damage-type-select {
        height: 1.625rem;
    }

    .scaling-button {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1.625rem;
        width: 1.625rem;
        padding: 0;
        margin: 0;
        font-size: 1rem;
        background: transparent;
        color: #999;
        border: 1px solid #7a7971;
        border-radius: $border-radius-standard;
        cursor: pointer;

        transition: $standard-transition;

        i {
            margin: 0;
        }

        &:focus,
        &:hover {
            color: #555;
        }
    }
</style>
