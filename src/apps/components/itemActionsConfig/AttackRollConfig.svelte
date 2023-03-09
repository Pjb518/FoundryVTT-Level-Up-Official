<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import prepareAbilityOptions from "../../dataPreparationHelpers/prepareAbilityOptions";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";
    import RadioGroup from "../RadioGroup.svelte";

    export let roll;
    export let rollId;

    const item = getContext("item");
    const actionId = getContext("actionId");

    function updateAbility() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.rolls.${rollId}.ability`,
            selectedAbility
        );
    }

    const A5E = CONFIG.A5E;
    const abilityOptions = [
        ["none", "A5E.None"],
        ["default", "A5E.AbilityDefault"],
        ["spellcasting", "A5E.AbilitySpellcasting"],
        ...prepareAbilityOptions(),
    ];

    $: selectedAbility = roll.ability ?? "none";
    $: selectedAbility, updateAbility();
</script>

<section class="action-config__wrapper">
    <div class="a5e-field-group a5e-field-group--label">
        <label for="{actionId}-{rollId}-label">
            {localize("A5E.Label")}
        </label>

        <input
            id="{actionId}-{rollId}-label"
            name="{actionId}-{rollId}-label"
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

    <div class="a5e-field-group">
        <h3 class="a5e-field-group__heading">
            {localize("A5E.AbilityScore")}
        </h3>

        <p class="a5e-field-group__hint">
            The ability score modifier to add to the attack roll.
        </p>
        <RadioGroup
            optionStyles="min-width: 2rem; text-align: center;"
            options={abilityOptions}
            selected={selectedAbility}
            on:updateSelection={({ detail }) => (selectedAbility = detail)}
        />
    </div>

    <div class="row">
        <div class="a5e-field-group">
            <label for="{actionId}-{rollId}-attack-type">
                {localize("A5E.AttackType")}
            </label>

            <select
                id="{actionId}-{rollId}-attack-type"
                class="u-w-fit"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.rolls.${rollId}.attackType`,
                        target.value
                    )}
            >
                {#each Object.entries(A5E.attackTypes) as [key, name] (key)}
                    <option value={key} selected={roll.attackType === key}>
                        {localize(name)}
                    </option>
                {/each}
            </select>
        </div>

        <div class="a5e-field-group a5e-field-group--formula">
            <label for="{actionId}-{rollId}-attack-bonus">
                {localize("A5E.AttackBonus")}
            </label>

            <input
                id="{actionId}-{rollId}-attack-bonus"
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

        <div class="a5e-field-group">
            <label for="{actionId}-{rollId}-crit-threshold">
                {localize("A5E.CriticalHitThreshold")}
            </label>

            <input
                id="{actionId}-{rollId}-crit-threshold"
                name="{actionId}-{rollId}-crit-threshold"
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

    <div class="a5e-field-group a5e-field-group--checkbox">
        <input
            id="{actionId}-{rollId}-proficient"
            class="checkbox"
            type="checkbox"
            checked={roll.proficient ?? true}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.proficient`,
                    target.checked
                )}
        />

        <label for="{actionId}-{rollId}-proficient">
            {localize("A5E.AddProficiency")}
        </label>
    </div>
</section>

<style lang="scss">
    .checkbox {
        margin: 0;
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
