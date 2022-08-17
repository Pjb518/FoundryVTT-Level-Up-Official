<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let actionId;
    export let item;

    function addRangeIncrement() {
        const newRange = {
            range: "short",
        };

        $item.update({
            [`system.actions.${actionId}.ranges`]: {
                ...action.ranges,
                [foundry.utils.randomID()]: newRange,
            },
        });
    }

    function deleteRangeIncrement(event) {
        const { rangeId } = event.target.closest(".range-increment").dataset;

        $item.update({
            [`system.actions.${actionId}.ranges`]: {
                [`-=${rangeId}`]: null,
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
            $item.update({
                [`system.actions.${actionId}.target`]: {
                    type: selectedOption,
                },
            });
        }
    }

    function removeArea() {
        $item.update({
            [`system.actions.${actionId}`]: {
                "-=area": null,
            },
        });
    }

    $: action = $item.system.actions[actionId];
</script>

<section class="form-wrapper">
    <section class="form-section">
        <header class="section-header">
            <h2>Range</h2>

            <a on:click={addRangeIncrement}>+ Add Range Increment</a>
        </header>

        <ul class="section-list">
            {#each Object.entries(action.ranges ?? {}) as [id, { range }] (id)}
                <li class="range-increment" data-range-id={id}>
                    {range}

                    <i
                        class="delete-button fas fa-trash"
                        on:click={deleteRangeIncrement}
                    />
                </li>
            {:else}
                <li class="none">None</li>
            {/each}
        </ul>
    </section>

    <section class="form-section">
        <header class="section-header">
            <h2>Area</h2>
        </header>

        <div class="area-shape-list">
            <input
                class="area-shape-input"
                id={`area-${actionId}-none}`}
                name={`${actionId}-area-shape`}
                value={null}
                type="radio"
                checked={foundry.utils.isEmpty(action.area)}
                on:change={removeArea}
            />

            <label class="area-shape-label" for={`area-${actionId}-none}`}>
                <span class="u-text-sm">
                    <i class="fas fa-times-circle" />
                </span>

                {localize("A5E.None")}
            </label>

            {#each Object.entries(CONFIG.A5E.areaTypes) as [key, name] (key)}
                <input
                    class="area-shape-input"
                    id={`area-${actionId}-${key}`}
                    name={`${actionId}-area-shape`}
                    value={key}
                    type="radio"
                    checked={action?.area?.shape === key}
                    on:click={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            `system.actions.${actionId}.area.shape`,
                            target.value
                        )}
                />

                <label class="area-shape-label" for={`area-${actionId}-${key}`}>
                    <span class="u-text-sm">
                        {@html CONFIG.A5E.areaIcons[key]}
                    </span>

                    {localize(name)}
                </label>
            {/each}
        </div>
    </section>

    <section class="form-section">
        <header class="section-header">
            <h2>Target</h2>
        </header>

        <div class="u-flex u-gap-md">
            {#if ["creature", "object", "creatureObject"].includes(action.target?.type)}
                <input
                    type="number"
                    name="targetQuantity"
                    value={action.target?.quantity}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            `system.actions.${actionId}.target.quantity`,
                            target.value
                        )}
                />
            {/if}

            <select
                class="u-w-fit"
                name="data.target.type"
                on:change={selectTarget}
            >
                <option
                    value={null}
                    selected={foundry.utils.isEmpty(action?.target)}
                />

                {#each Object.entries(CONFIG.A5E.targetTypes) as [key, name] (key)}
                    <option value={key} selected={action?.target?.type === key}>
                        {localize(name)}
                    </option>
                {/each}
            </select>
        </div>
    </section>
</section>

<style lang="scss">
    .area-shape {
        &-input {
            display: none;

            &:checked + .area-shape-label {
                background: #2b6537;
                border-color: darken($color: #2b6537, $amount: 5);
                box-shadow: 0 0 10px darken($color: #2b6537, $amount: 10) inset;
                color: #f6f2eb;
            }
        }

        &-label {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-grow: 1;
            gap: 0.375rem;
            width: 100%;
            border-radius: 3px;
            border: 1px solid #bbb;
            font-size: 1rem;
            padding: 0.5rem;
            cursor: pointer;
            transition: all 0.15s ease-in-out;
        }

        &-list {
            display: flex;
            width: 100%;
            gap: 0.375rem;
            margin: 0;
            padding: 0;
            font-family: "Modesto Condensed", serif;
        }
    }

    .delete-button {
        color: #8b2525;
        margin-left: auto;
        margin-right: 0.5rem;
        padding: 0.25rem;
        cursor: pointer;
        transition: all 0.15s ease-in-out;

        &:hover {
            transform: scale(1.2);
        }
    }

    .form {
        &-section {
            gap: 0.5rem;
        }

        &-section,
        &-wrapper {
            display: flex;
            flex-direction: column;
        }

        &-wrapper {
            gap: 1rem;
        }
    }

    .none {
        color: #555;
        text-align: center;
        font-size: 1rem;
    }

    .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.25rem 0.25rem 0.25rem;
        font-family: "Modesto Condensed", serif;
        border-bottom: 1px solid #ccc;
    }

    .range-increment {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem;
        border: 1px solid #bbb;
        border-radius: 3px;
        font-size: 1rem;
    }

    .section-list {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        gap: 0.25rem;
        list-style: none;
        font-family: "Modesto Condensed", serif;
    }
</style>
