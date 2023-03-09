<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import AreaConfig from "../itemActionsConfig/AreaConfig.svelte";
    import FormSection from "../FormSection.svelte";
    import TargetRangeIncrement from "../itemActionsConfig/TargetRangeIncrement.svelte";
    import updateAssociatedValues from "../../handlers/updateAssociatedValues";

    const item = getContext("item");
    const actionId = getContext("actionId");
    const A5E = CONFIG.A5E;

    function addRangeIncrement() {
        const newRange = {
            range: "",
        };

        $item.update({
            [`system.actions.${actionId}.ranges`]: {
                ...action.ranges,
                [foundry.utils.randomID()]: newRange,
            },
        });
    }

    function selectTarget(event) {
        const selectedOption = event.target?.selectedOptions[0]?.value;
        if (selectedOption === "null") {
            $item.update({
                [`system.actions.${actionId}`]: {
                    "-=target": null,
                },
            });
        } else {
            updateAssociatedValues(
                $item,
                `system.actions.${actionId}.target.type`,
                selectedOption,
                `system.actions.${actionId}.target.quantity`
            );
        }
    }

    $: action = $item.actions[actionId];
</script>

<section class="action-config action-config__wrapper">
    <section class="action-config__section">
        <header class="action-config__section-header">
            <h2 class="action-config__section-heading">
                {localize("A5E.TabRanges")}
            </h2>

            <button class="add-button" on:click={addRangeIncrement}>
                {localize("A5E.ButtonAddRangeIncrement")}
            </button>
        </header>

        <ul class="section-list">
            {#each Object.entries(action.ranges ?? {}) as [id, range], index (id)}
                <li class="range-increment" data-range-id={id}>
                    <TargetRangeIncrement {index} {id} rangeObject={range} />
                </li>
            {:else}
                <li class="none">None</li>
            {/each}
        </ul>
    </section>

    <AreaConfig {action} {actionId} {item} />

    <section class="action-config__section">
        <header class="action-config__section-header">
            <h2 class="action-config__section-heading">Target</h2>
        </header>

        <FormSection>
            <div class="action-config__component">
                {#if ["creature", "object", "creatureObject"].includes(action.target?.type)}
                    <input
                        class="small-input"
                        type="number"
                        name="targetQuantity"
                        value={action.target?.quantity ?? 1}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                `system.actions.${actionId}.target.quantity`,
                                Number(target.value || 0)
                            )}
                        on:click={({ target }) => target.select()}
                    />
                {/if}

                <select class="u-w-fit" on:change={selectTarget}>
                    <!-- svelte-ignore missing-declaration (foundry) -->
                    <option
                        value={null}
                        selected={foundry.utils.isEmpty(action?.target)}
                    >
                        {localize("A5E.None")}
                    </option>

                    {#each Object.entries(A5E.targetTypes) as [key, name] (key)}
                        <option
                            value={key}
                            selected={action?.target?.type === key}
                        >
                            {localize(name)}
                        </option>
                    {/each}
                </select>
            </div>
        </FormSection>
    </section>
</section>

<style lang="scss">
    .range-increment {
        border-radius: 4px;
        font-size: 1rem;
    }

    .section-list {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        gap: 0.25rem;
        list-style: none;
    }
</style>
