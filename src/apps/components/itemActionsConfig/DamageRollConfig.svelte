<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import ScalingConfigDialog from "../../dialogs/initializers/DamageScalingConfigDialog";

    import getOrdinalNumber from "../../../utils/getOrdinalNumber";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    function onClickScalingButton() {
        const dialog = new ScalingConfigDialog($item, actionId, rollId);
        dialog.render(true);
    }

    const item = getContext("item");
    const actionId = getContext("actionId");

    const A5E = CONFIG.A5E;

    export let roll;
    export let rollId;
</script>

<section class="action-config__wrapper">
    <div class="a5e-field-group a5e-field-group--label">
        <label for="{actionId}-{rollId}-label">
            {localize("A5E.Label")}
        </label>

        <input
            id="{actionId}-{rollId}-label"
            type="text"
            value={roll.label ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.label`,
                    target.value
                )}
        />
    </div>

    <section class="row u-flex-wrap">
        <div class="a5e-field-group a5e-field-group--formula">
            <label for="{actionId}-{rollId}-damage-formula">
                {localize("A5E.DamageFormula")}
            </label>

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
        </div>

        <div class="a5e-field-group scaling-button-wrapper">
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

        <div class="a5e-field-group">
            <label for="{actionId}-{rollId}-damage-type">
                {localize("A5E.DamageType")}
            </label>

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

                {#each Object.entries(A5E.damageTypes) as [key, name] (key)}
                    <option value={key} selected={roll.damageType === key}>
                        {localize(name)}
                    </option>
                {/each}
            </select>
        </div>

        {#if roll.scaling?.mode === "cantrip"}
            <small>
                {localize("A5E.scaling.summaries.cantrip.damage", {
                    formula: roll.scaling.formula ?? 0,
                })}
            </small>
        {:else if roll.scaling?.mode === "spellLevel"}
            <small>
                {#if !roll.scaling?.step || roll.scaling?.step === 1}
                    {localize("A5E.scaling.summaries.spellLevel.damage", {
                        formula: roll.scaling.formula ?? 0,
                        level: getOrdinalNumber($item.system.level),
                    })}
                {:else}
                    {localize(
                        "A5E.scaling.summaries.steppedSpellLevel.damage",
                        {
                            formula: roll.scaling.formula ?? 0,
                            step: roll.scaling.step,
                            level: getOrdinalNumber($item.system.level),
                        }
                    )}
                {/if}
            </small>
        {:else if roll.scaling?.mode === "spellPoints"}
            <small>
                {#if !roll.scaling?.step || roll.scaling?.step === 1}
                    {localize("A5E.scaling.summaries.spellPoint.damage", {
                        formula: roll.scaling.formula ?? 0,
                    })}
                {:else}
                    {localize(
                        "A5E.scaling.summaries.steppedSpellPoint.damage",
                        {
                            formula: roll.scaling.formula ?? 0,
                            step: roll.scaling.step,
                        }
                    )}
                {/if}
            </small>
        {:else if ["actionUses", "itemUses"].includes(roll.scaling?.mode)}
            <small>
                {#if !roll.scaling?.step || roll.scaling?.step === 1}
                    {localize("A5E.scaling.summaries.uses.damage", {
                        formula: roll.scaling.formula ?? 0,
                    })}
                {:else}
                    {localize("A5E.scaling.summaries.steppedUses.damage", {
                        formula: roll.scaling.formula ?? 0,
                        step: roll.scaling.step,
                    })}
                {/if}
            </small>
        {/if}
    </section>

    <div class="a5e-field-group a5e-field-group--checkbox">
        <input
            id="{actionId}-{rollId}-can-crit"
            class="checkbox"
            type="checkbox"
            checked={roll.canCrit ?? true}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.canCrit`,
                    target.checked
                )}
        />

        <label for="{actionId}-{rollId}-can-crit">
            {localize("A5E.DamageDoubleOnCrit")}
        </label>
    </div>

    {#if roll.canCrit ?? true}
        <div class="a5e-field-group">
            <label for="{actionId}-{rollId}-crit-bonus">
                {localize("A5E.DamageBonusOnCrit")}
            </label>

            <p class="a5e-field-group__hint">
                When you score a critical hit, this damage is added after
                doubling the attack's damage.
            </p>

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
        </div>
    {/if}

    <div class="a5e-field-group a5e-field-group--checkbox">
        <input
            id="{actionId}-{rollId}-default"
            class="checkbox"
            type="checkbox"
            checked={roll.default ?? true}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.default`,
                    target.checked
                )}
        />

        <label for="{actionId}-{rollId}-default">
            {localize("A5E.DamageDefaultSelection")}
        </label>
    </div>
</section>

<style lang="scss">
    small {
        display: block;
        width: 100%;
    }

    .checkbox {
        margin: 0;
    }

    .damage-type-select {
        height: 1.625rem;
    }

    .row {
        display: flex;
        gap: 0.5rem;
        width: 100%;
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
        border-radius: 3px;
        cursor: pointer;

        transition: all 0.15s ease-in-out;

        i {
            margin: 0;
        }

        &:focus,
        &:hover {
            color: #555;
        }
    }

    .scaling-button-wrapper {
        justify-content: flex-end;
    }
</style>
