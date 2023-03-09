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

    <div class="a5e-field-group">
        <h3 class="a5e-field-group__heading">
            {localize("A5E.ItemSavingThrowType")}
        </h3>

        <RadioGroup
            optionStyles="min-width: 2rem; text-align: center;"
            options={prepareAbilityOptions()}
            selected={selectedAbility}
            on:updateSelection={({ detail }) => (selectedAbility = detail)}
        />
    </div>

    <div class="a5e-field-group">
        <label for="{actionId}-{rollId}-bonus">
            {localize("A5E.SaveBonus")}
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
