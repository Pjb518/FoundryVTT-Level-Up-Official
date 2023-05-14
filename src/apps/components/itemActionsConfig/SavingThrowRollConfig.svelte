<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import prepareAbilityOptions from "../../dataPreparationHelpers/prepareAbilityOptions";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import FormSection from "../FormSection.svelte";
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

<FormSection
    heading="A5E.Label"
    --background="transparent"
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

<FormSection
    heading="A5E.ItemSavingThrowType"
    --background="transparent"
    --label-width="100%"
    --padding="0"
>
    <RadioGroup
        optionStyles="min-width: 2rem; text-align: center;"
        options={prepareAbilityOptions()}
        selected={selectedAbility}
        allowDeselect={false}
        on:updateSelection={({ detail }) => (selectedAbility = detail)}
    />
</FormSection>

<FormSection
    heading="A5E.SaveBonus"
    --background="transparent"
    --label-width="100%"
    --padding="0"
>
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
</FormSection>

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
        {localize("A5E.SavingThrowDefaultSelection")}
    </label>
</div>

<style lang="scss">
    .checkbox {
        margin: 0;
    }
</style>
