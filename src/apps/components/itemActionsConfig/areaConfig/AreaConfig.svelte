<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import AreaShape from "./AreaShape.svelte";

    export let action;
    export let actionId;
    export let item;

    function removeArea() {
        $item.update({
            [`system.actions.${actionId}`]: {
                "-=area": null,
            },
        });
    }
</script>

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
            <AreaShape {action} {actionId} {item} {key} {name} />
        {/each}
    </div>

    {#if action.area?.shape}
        <div>
            <label for={`${actionId}-area-quantity`}>Quantity</label>
            <input
                id={`${actionId}-area-quantity`}
                type="number"
                value={action.area?.quantity ?? 1}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.area.quantity`,
                        target.value
                    )}
            />
        </div>
    {/if}

    {#if ["cylinder", "sphere"].includes(action.area?.shape)}
        <div>
            <label for={`${actionId}-area-radius`}>Radius</label>
            <input
                id={`${actionId}-area-radius`}
                type="number"
                value={action.area?.radius ?? 0}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.area.radius`,
                        target.value
                    )}
            />
        </div>
    {/if}

    {#if ["cone", "line"].includes(action.area?.shape)}
        <div>
            <label for={`${actionId}-area-length`}>Length</label>
            <input
                id={`${actionId}-area-length`}
                type="number"
                value={action.area?.length ?? 0}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.area.length`,
                        target.value
                    )}
            />
        </div>
    {/if}

    {#if ["cube", "line"].includes(action.area?.shape)}
        <div>
            <label for={`${actionId}-area-width`}>Width</label>
            <input
                id={`${actionId}-area-width`}
                type="number"
                value={action.area?.width ?? 0}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.area.width`,
                        target.value
                    )}
            />
        </div>
    {/if}
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

    .form-section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.25rem 0.25rem 0.25rem;
        font-family: "Modesto Condensed", serif;
        border-bottom: 1px solid #ccc;
    }
</style>
