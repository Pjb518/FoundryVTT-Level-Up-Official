<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import RollTypeConfig from "./RollTypeConfig.svelte";

    export let action;
    export let actionId;
    export let item;
    export let roll;
    export let rollId;
</script>

<!-- <RollTypeConfig {action} {actionId} {item} {roll} {rollId} />-->

<div class="field-group field-group--label">
    <label for={`${actionId}-${rollId}-label`}>Label</label>

    <input
        id={`${actionId}-${rollId}-label`}
        name={`${actionId}-${rollId}-label`}
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

<section class="row">
    <div class="field-group field-group--formula">
        <label for={`${actionId}-${rollId}-damage-formula`}>
            Damage Formula
        </label>

        <input
            id={`${actionId}-${rollId}-damage-formula`}
            name={`${actionId}-${rollId}-damage-formula`}
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

    <div class="field-group">
        <label for={`${actionId}-${rollId}-damage-type`}>Damage Type</label>

        <select
            id={`${actionId}-${rollId}-damage-type`}
            class="u-w-fit"
            name={`${actionId}-${rollId}-damage-type`}
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

            {#each Object.entries(CONFIG.A5E.damageTypes) as [key, name] (key)}
                <option value={key} selected={roll.damageType === key}>
                    {localize(name)}
                </option>
            {/each}
        </select>
    </div>
</section>

<div class="field-group field-group--checkbox">
    <input
        id={`${actionId}-${rollId}-can-crit`}
        class="checkbox"
        name={`${actionId}-${rollId}-can-crit`}
        type="checkbox"
        checked={roll.canCrit ?? true}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.canCrit`,
                target.checked
            )}
    />

    <label for={`${actionId}-${rollId}-can-crit`}
        >Double Damage on Critical Hit</label
    >
</div>

{#if roll.canCrit ?? true}
    <div class="field-group">
        <label for={`${actionId}-${rollId}-crit-bonus`}
            >Bonus Critical Damage</label
        >

        <input
            id={`${actionId}-${rollId}-crit-bonus`}
            name={`${actionId}-${rollId}-crit-bonus`}
            type="text"
            value={roll.critBonus ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.critBonus`,
                    target.value
                )}
        />

        <p class="hint">
            When you score a critical hit, this damage is added after doubling
            the attack's damage.
        </p>
    </div>
{/if}

<div class="field-group field-group--checkbox">
    <input
        id={`${actionId}-${rollId}-default`}
        class="checkbox"
        name={`${actionId}-${rollId}-default`}
        type="checkbox"
        checked={roll.default ?? true}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.default`,
                target.checked
            )}
    />

    <label for={`${actionId}-${rollId}-default`}
        >{localize("A5E.DamageDefaultSelection")}</label
    >
</div>

<style lang="scss">
    .checkbox {
        margin: 0;
    }

    .field-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        &--checkbox {
            flex-direction: row;
            align-items: center;
            gap: 0.5rem;
        }

        &--formula {
            flex-grow: 1;
        }

        &--label {
            margin-right: 5rem;
        }
    }

    .hint {
        font-size: 0.694rem;
    }

    .row {
        display: flex;
        gap: 0.5rem;
        width: 100%;
    }
</style>
