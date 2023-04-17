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

    const tools = Object.entries(CONFIG.A5E.tools)
        .map(([_, tools]) => Object.entries(tools))
        .flat()
        .sort((a, b) => a[0].toLowerCase().localeCompare(b[0].toLowerCase()));

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
            {localize("Label")}
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
        <h3>{localize("A5E.Tool")}</h3>

        <select
            class="u-w-fit"
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.rolls.${rollId}.tool`,
                    target.value
                )}
        >
            {#each tools as [tool, label]}
                <option value={tool} selected={roll?.tool === tool}>
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
            allowDeselect={false}
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
            {localize("A5E.ToolCheckDefaultSelection")}
        </label>
    </div>
</section>

<style lang="scss">
    .option {
        &-wrapper {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            font-size: 0.694rem;
            font-family: "Signika", sans-serif;
        }
    }
</style>
