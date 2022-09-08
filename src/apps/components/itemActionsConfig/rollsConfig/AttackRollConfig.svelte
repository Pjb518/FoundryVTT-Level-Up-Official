<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const { abilities, attackTypes } = CONFIG.A5E;

    export let actionId;
    export let item;
    export let roll;
    export let rollId;
</script>

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

<div class="field-group">
    <h3 class="field-group__heading">Ability Score</h3>

    <p class="hint">The ability score modifier to add to the attack roll.</p>

    <div class="option-list">
        <input
            class="option-input"
            type="radio"
            name={`${actionId}-${rollId}-ability`}
            id={`${actionId}-${rollId}-ability-none`}
            value=""
            checked={(roll.ability ?? true) || roll.ability === ""}
            on:change={() =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}`,
                    { "-=ability": null }
                )}
        />

        <label class="option-label" for={`${actionId}-${rollId}-ability-none`}>
            {localize("A5E.None")}
        </label>

        <input
            class="option-input"
            type="radio"
            name={`${actionId}-${rollId}-ability`}
            id={`${actionId}-${rollId}-ability-default`}
            value="default"
            checked={roll.ability === "default"}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.ability`,
                    target.value
                )}
        />

        <label
            class="option-label"
            for={`${actionId}-${rollId}-ability-default`}
        >
            {localize("A5E.AbilityDefault")}
        </label>

        <input
            class="option-input"
            type="radio"
            name={`${actionId}-${rollId}-ability`}
            id={`${actionId}-${rollId}-ability-spellcasting`}
            value="spellcasting"
            checked={roll.ability === "spellcasting"}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.ability`,
                    target.value
                )}
        />

        <label
            class="option-label"
            for={`${actionId}-${rollId}-ability-spellcasting`}
        >
            {localize("A5E.AbilitySpellcasting")}
        </label>

        {#each Object.entries(abilities) as [ability, label]}
            <input
                class="option-input"
                type="radio"
                name={`${actionId}-${rollId}-ability`}
                id={`${actionId}-${rollId}-ability-${ability}`}
                value={ability}
                checked={roll.ability === ability}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.rolls.${rollId}.ability`,
                        target.value
                    )}
            />

            <label
                class="option-label"
                for={`${actionId}-${rollId}-ability-${ability}`}
            >
                {localize(label)}
            </label>
        {/each}
    </div>
</div>

<div class="row">
    <div class="field-group">
        <label for={`${actionId}-${rollId}-attack-type`}>Attack Type</label>

        <select
            id={`${actionId}-${rollId}-attack-type`}
            class="u-w-fit"
            name={`${actionId}-${rollId}-attack-type`}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.attackType`,
                    target.value
                )}
        >
            {#each Object.entries(attackTypes) as [key, name] (key)}
                <option value={key} selected={roll.attackType === key}>
                    {localize(name)}
                </option>
            {/each}
        </select>
    </div>

    <div class="field-group field-group--formula">
        <label for={`${actionId}-${rollId}-attack-bonus`}>Attack Bonus</label>

        <input
            id={`${actionId}-${rollId}-attack-bonus`}
            name={`${actionId}-${rollId}-attack-bonus`}
            type="text"
            value={roll.bonus ?? 0}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.bonus`,
                    target.value
                )}
        />
    </div>

    <div class="field-group">
        <label for={`${actionId}-${rollId}-crit-threshold`}>
            Critical Hit Threshold
        </label>

        <input
            id={`${actionId}-${rollId}-crit-threshold`}
            name={`${actionId}-${rollId}-crit-threshold`}
            type="number"
            value={roll.critThreshold ?? 20}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.critThreshold`,
                    Number(target.value)
                )}
        />
    </div>
</div>

<div class="field-group field-group--checkbox">
    <input
        id={`${actionId}-${rollId}-proficient`}
        class="checkbox"
        name={`${actionId}-${rollId}-proficient`}
        type="checkbox"
        checked={roll.proficient ?? true}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $item,
                `system.actions.${actionId}.rolls.${rollId}.proficient`,
                target.checked
            )}
    />

    <label for={`${actionId}-${rollId}-proficient`}>
        Add Proficiency Bonus to Attack Roll
    </label>
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
            margin-right: 4.5rem;
        }

        &__heading {
            font-size: 0.833rem;
        }

        input[type="text"],
        input[type="number"] {
            width: 100%;
        }
    }

    .hint {
        font-size: 0.694rem;
    }

    .option {
        &-input {
            display: none;

            &:checked + .option-label {
                background: #2b6537;
                border-color: darken($color: #2b6537, $amount: 5);
                color: #f6f2eb;
            }
        }

        &-label {
            border-radius: 3px;
            border: 1px solid #bbb;
            padding: 0.125rem 0.25rem;
            cursor: pointer;
            transition: all 0.15s ease-in-out;
        }

        &-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
            font-size: 0.694rem;
        }
    }

    .row {
        display: flex;
        gap: 0.5rem;
        width: 100%;
    }
</style>
