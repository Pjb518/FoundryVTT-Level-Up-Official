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
    const { skills } = CONFIG.A5E;

    function updateAbility() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.rolls.${rollId}.ability`,
            selectedAbility
        );
    }

    $: roll = $item.system.actions[actionId]?.rolls[rollId];
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

    <div class="option-wrapper">
        <h3>{localize("A5E.Skill")}</h3>

        <select
            class="u-w-fit"
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.skill`,
                    target.value
                )}
        >
            {#each Object.entries(skills) as [skill, label]}
                <option value={skill} selected={roll?.skill === skill}>
                    {localize(label)}
                </option>
            {/each}
        </select>
    </div>

    <div class="option-wrapper">
        <h3>{localize("A5E.DefaultAbilityScore")}</h3>

        <RadioGroup
            optionStyles="min-width: 2rem; text-align: center;"
            options={prepareAbilityOptions(false, true)}
            selected={selectedAbility}
            on:updateSelection={({ detail }) => (selectedAbility = detail)}
        />
    </div>

    <div class="a5e-field-group">
        <label for="{actionId}-{rollId}-bonus">
            {localize("A5E.CheckBonus")}
        </label>

        <input
            id="{actionId}-{rollId}-bonus"
            type="text"
            value={roll.bonus ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.bonus`,
                    target.value
                )}
        />
    </div>
</section>

<style lang="scss">
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
        }

        &-wrapper {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            font-size: 0.694rem;
            font-family: "Signika", sans-serif;
        }
    }
</style>
