<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import RadioGroup from "../RadioGroup.svelte";

    export let roll;
    export let rollId;

    const item = getContext("item");
    const actionId = getContext("actionId");
    const { abilities } = CONFIG.A5E;

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
            {localize("A5E.ItemAbilityCheckType")}
        </h3>

        <RadioGroup
            optionStyles="min-width: 2rem; text-align: center;"
            options={Object.entries(abilities)}
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
            name="{actionId}-{rollId}-bonus"
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
            {localize("A5E.AbilityCheckDefaultSelection")}
        </label>
    </div>
</section>
