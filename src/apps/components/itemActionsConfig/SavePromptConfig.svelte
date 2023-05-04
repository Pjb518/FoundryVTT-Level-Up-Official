<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import computeSaveDC from "../../../utils/computeSaveDC";
    import prepareAbilityOptions from "../../dataPreparationHelpers/prepareAbilityOptions";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import RadioGroup from "../RadioGroup.svelte";

    export let prompt;
    export let promptId;

    const item = getContext("item");
    const actor = $item.actor && new TJSDocument($item.actor);
    const actionId = getContext("actionId");

    const { saveDCOptions } = CONFIG.A5E;

    function updateAbility() {
        updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.prompts.${promptId}.ability`,
            selectedAbility
        );
    }

    function selectSaveDCCalculationType(event) {
        const selectedOption = event.target?.selectedOptions[0]?.value;

        $item.update({
            [`system.actions.${actionId}.prompts.${promptId}.saveDC.type`]:
                selectedOption,
        });
    }

    function onSaveDCUpdate(actor) {
        try {
            const saveDC = computeSaveDC(actor, {
                type: prompt?.saveDC?.type,
                bonus: saveDCBonus,
            });

            saveDCIsValid = true;
            return saveDC;
        } catch {
            saveDCIsValid = false;
        }
    }

    let saveDCIsValid = true;
    let saveDCBonus = prompt?.saveDC?.bonus;

    $: saveDC = onSaveDCUpdate($actor, prompt?.saveDC?.type, saveDCBonus);

    $: updateDocumentDataFromField(
        $item,
        `system.actions.${actionId}.prompts.${promptId}.saveDC.bonus`,
        saveDCBonus
    );

    $: selectedAbility = prompt.ability ?? "none";
    $: selectedAbility, updateAbility();
</script>

<section class="action-config__wrapper">
    <div class="a5e-field-group a5e-field-group--label">
        <label for="{actionId}-{promptId}-label">
            {localize("A5E.Label")}
        </label>

        <input
            id="{actionId}-{promptId}-label"
            type="text"
            value={prompt.label ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.prompts.${promptId}.label`,
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
            allowDeselect={false}
            on:updateSelection={({ detail }) => (selectedAbility = detail)}
        />
    </div>

    <div class="a5e-field-group a5e-field-group--formula u-flex-row u-gap-md">
        <div class="u-flex u-flex-col u-gap-sm u-w-30">
            <h3 class="a5e-field-group__heading">
                {localize("A5E.ItemSavingThrowDC")}
            </h3>

            <select on:change={selectSaveDCCalculationType}>
                {#each Object.entries(saveDCOptions) as [type, label]}
                    <option
                        value={type}
                        selected={type === prompt?.saveDC?.type}
                    >
                        {localize(label)}
                    </option>
                {/each}
            </select>
        </div>

        <div
            class="u-flex u-flex-col u-flex-grow u-flex-shrink-0 u-justify-space-between"
        >
            <label
                class="a5e-field-group__heading"
                for="{actionId}.prompts.{promptId}.saveDC.bonus"
            >
                {#if prompt?.saveDC?.type === "custom"}
                    {localize("A5E.ItemSavingThrowDCCustom")}
                {:else}
                    {localize("A5E.ItemSavingThrowDCBonus")}
                {/if}
            </label>

            <input
                id="{actionId}.prompts.{promptId}.saveDC.bonus"
                type="text"
                autocomplete="off"
                bind:value={saveDCBonus}
            />
        </div>

        {#if saveDC || !saveDCIsValid}
            <div class="save-dc-preview-wrapper">
                <span
                    class="save-dc-preview"
                    class:invalid={!saveDCIsValid}
                    type="number"
                >
                    {#if saveDCIsValid}
                        {saveDC}
                    {:else}
                        <i class="fa-solid fa-circle-exclamation" />
                    {/if}
                </span>
            </div>
        {/if}
    </div>

    <div class="a5e-field-group">
        <label for="{actionId}-{promptId}-save-effect">
            {localize("A5E.ItemEffectOnSave")}
        </label>

        <input
            id="{actionId}-{promptId}-save-effect"
            type="text"
            value={prompt.onSave ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.prompts.${promptId}.onSave`,
                    target.value
                )}
        />
    </div>

    <div class="a5e-field-group a5e-field-group--checkbox">
        <input
            id="{actionId}-{promptId}-default"
            class="checkbox"
            type="checkbox"
            checked={prompt.default ?? true}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.prompts.${promptId}.default`,
                    target.checked
                )}
        />

        <label for="{actionId}-{promptId}-default">
            {localize("A5E.PromptDefaultSelection")}
        </label>
    </div>
</section>

<style lang="scss">
    .checkbox {
        margin: 0;
    }

    .save-dc-preview-wrapper {
        display: flex;
        align-items: flex-end;
        width: 3rem;
    }

    .save-dc-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1.625rem;
        width: 100%;
        border-radius: 3px;
        background: rgba(0, 0, 0, 0.05);
    }

    .invalid {
        background: rgba(139, 37, 37, 0.25);
        border: 1px solid rgba(139, 37, 37, 0.25);
        color: rgba(139, 37, 37, 0.85);
        font-size: 1rem;
    }
</style>
