<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const actionId = getContext("actionId");

    const { abilities, saveDCOptions } = CONFIG.A5E;

    function selectSaveDCCalculationType(event) {
        const selectedOption = event.target?.selectedOptions[0]?.value;

        console.log(event.target?.selectedOptions, selectedOption);

        $item.update({
            [`system.actions.${actionId}.prompts.${promptId}.saveDC.type`]:
                selectedOption,
        });
    }

    export let prompt;
    export let promptId;
</script>

<section class="action-config__wrapper">
    <div class="a5e-field-group a5e-field-group--label">
        <label for={`${actionId}-${promptId}-label`}>
            {localize("A5E.Label")}
        </label>

        <input
            id={`${actionId}-${promptId}-label`}
            name={`${actionId}-${promptId}-label`}
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

        <div class="option-list">
            <input
                class="option-input"
                type="radio"
                name={`${actionId}-${promptId}-ability`}
                id={`${actionId}-${promptId}-ability-none`}
                value=""
                checked={(prompt.ability ?? true) || prompt.ability === ""}
                on:change={() =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.prompts.${promptId}`,
                        { "-=ability": null }
                    )}
            />

            <label
                class="option-label"
                for={`${actionId}-${promptId}-ability-none`}
            >
                {localize("A5E.None")}
            </label>

            {#each Object.entries(abilities) as [ability, label]}
                <input
                    class="option-input"
                    type="radio"
                    name={`${actionId}-${promptId}-ability`}
                    id={`${actionId}-${promptId}-ability-${ability}`}
                    value={ability}
                    checked={prompt.ability === ability}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            `system.actions.${actionId}.prompts.${promptId}.ability`,
                            target.value
                        )}
                />

                <label
                    class="option-label"
                    for={`${actionId}-${promptId}-ability-${ability}`}
                >
                    {localize(label)}
                </label>
            {/each}
        </div>
    </div>

    <div class="a5e-field-group a5e-field-group--formula u-flex-row u-gap-xl">
        <div class="u-flex u-flex-col u-gap-sm">
            <h3 class="a5e-field-group__heading">
                {localize("A5E.ItemSavingThrowDC")}
            </h3>

            <select
                name={`system.actions.${actionId}.prompts.${promptId}.saveDC.type`}
                on:change={selectSaveDCCalculationType}
            >
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

        <div class="u-flex u-flex-col u-flex-grow u-flex-shrink-0 u-gap-sm">
            <label
                class="a5e-field-group__heading"
                for={`${actionId}.prompts.${promptId}.saveDC.bonus`}
            >
                {#if prompt?.saveDC?.type === "custom"}
                    {localize("A5E.ItemSavingThrowDCCustom")}
                {:else}
                    {localize("A5E.ItemSavingThrowDCBonus")}
                {/if}
            </label>

            <input
                id={`$${actionId}.prompts.${promptId}.saveDC.bonus`}
                name={`$${actionId}.prompts.${promptId}.saveDC.bonus`}
                type="text"
                value={prompt?.saveDC?.bonus ?? ""}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.prompts.${promptId}.saveDC.bonus`,
                        target.value
                    )}
            />
        </div>
    </div>

    <!-- <div class="a5e-field-group a5e-field-group--formula">
        <label for={`${actionId}-${promptId}-dc`}>
            {localize("A5E.ItemSavingThrowDC")}
        </label>

        <input
            id={`${actionId}-${promptId}-dc`}
            name={`${actionId}-${promptId}-dc`}
            type="text"
            value={prompt.saveDC ?? ""}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.prompts.${promptId}.saveDC`,
                    target.value
                )}
        />
    </div> -->

    <div class="a5e-field-group ">
        <label for={`${actionId}-${promptId}-save-effect`}>
            {localize("A5E.ItemEffectOnSave")}
        </label>

        <input
            id={`${actionId}-${promptId}-save-effect`}
            name={`${actionId}-${promptId}-save-effect`}
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
            font-size: 0.694rem;
        }
    }
</style>
