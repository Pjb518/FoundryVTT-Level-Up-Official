<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";
    import ScalingConfigDialog from "../../dialogs/initializers/HealingScalingConfigDialog";

    import getOrdinalNumber from "../../../utils/getOrdinalNumber";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    function getScalingSummary(roll) {
        const mode = roll.scaling?.mode;
        const formula = roll.scaling?.formula ?? 0;

        const healingType = (
            healingTypes[roll.healingType] ?? healingTypes["healing"]
        ).toLocaleLowerCase();

        // TODO: Provide some means of getting a base spell level for non-spell items.
        const level = getOrdinalNumber($item.system.level ?? 1);
        const step = roll.scaling?.step;

        if (mode === "cantrip") {
            return localize("A5E.scaling.summaries.cantrip.healing", {
                formula,
                healingType,
            });
        }

        if (mode === "spellLevel") {
            if (!step || step === 1) {
                return localize("A5E.scaling.summaries.spellLevel.healing", {
                    formula,
                    level,
                    healingType,
                });
            } else {
                return localize(
                    "A5E.scaling.summaries.steppedSpellLevel.healing",
                    { formula, step, level, healingType }
                );
            }
        }

        if (mode === "spellPoints") {
            if (!roll.scaling?.step || roll.scaling?.step === 1) {
                return localize("A5E.scaling.summaries.spellPoint.healing", {
                    formula,
                    healingType,
                });
            } else {
                return localize(
                    "A5E.scaling.summaries.steppedSpellPoint.healing",
                    { formula, step, healingType }
                );
            }
        }

        if (["actionUses", "itemUses"].includes(mode)) {
            if (!roll.scaling?.step || roll.scaling?.step === 1) {
                return localize("A5E.scaling.summaries.uses.healing", {
                    formula,
                    healingType,
                });
            } else {
                return localize("A5E.scaling.summaries.steppedUses.healing", {
                    formula,
                    step,
                    healingType,
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

    const { A5E } = CONFIG;
    const { healingTypes } = A5E;

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
        heading="A5E.HealingFormula"
        --background="none"
        --grow="1"
        --direction="column"
        --padding="0"
    >
        <div class="u-flex u-gap-sm u-w-full">
            <input
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
        heading="A5E.HealingType"
        --background="none"
        --direction="column"
        --padding="0"
    >
        <select
            id="{actionId}-{rollId}-healing-type"
            class="u-w-fit"
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.healingType`,
                    target.value
                )}
        >
            {#each Object.entries(healingTypes) as [key, name] (key)}
                <option value={key} selected={roll.healingType === key}>
                    {localize(name)}
                </option>
            {/each}
        </select>
    </FormSection>
</FormSection>

<Checkbox
    label="A5E.HealingDefaultSelection"
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
    .scaling-button {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1.625rem;
        width: 1.625rem;
        padding: 0;
        margin: 0;
        font-size: $font-size-md;
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
