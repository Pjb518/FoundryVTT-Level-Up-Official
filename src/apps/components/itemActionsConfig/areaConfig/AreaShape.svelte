<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    export let action;
    export let actionId;
    export let item;
    export let key;
    export let name;
</script>

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
</style>
