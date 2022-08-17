<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { object_without_properties } from "svelte/internal";

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

    function removeArea() {
        $item.update({
            [`system.actions.${actionId}`]: {
                "-=area": null,
            },
        });
    }

    $: action = $item.system.actions[actionId];
</script>

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

    .area,
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
