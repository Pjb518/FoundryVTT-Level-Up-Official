<script>
    import { localize } from "#runtime/svelte/helper";

    import updateAssociatedValues from "../../handlers/updateAssociatedValues";

    export let action;
    export let actionId;
    export let item;
    export let key;
    export let name;

    const A5E = CONFIG.A5E;
</script>

<input
    class="area-shape__input"
    id="area-{actionId}-{key}"
    name="{actionId}-area-shape"
    value={key}
    type="radio"
    checked={action?.area?.shape === key}
    on:click={({ target }) =>
        updateAssociatedValues(
            $item,
            `system.actions.${actionId}.area.shape`,
            target.value,
            `system.actions.${actionId}.area.quantity`
        )}
/>

<label class="area-shape__label" for="area-{actionId}-{key}">
    <span class="u-text-sm">
        {@html A5E.areaIcons[key]}
    </span>

    {localize(name)}
</label>

<style lang="scss">
    .area-shape {
        &__input {
            display: none;

            &:checked + .area-shape__label {
                background: #425f65;
                border-color: darken($color: #425f65, $amount: 5);
                box-shadow: 0 0 10px darken($color: #425f65, $amount: 10) inset;
                color: #f6f2eb;

                &:hover {
                    background: #425f65;
                }
            }
        }

        &__label {
            display: flex;
            align-items: center;
            flex-grow: 1;
            gap: 0.75rem;
            border-radius: 3px;
            border: 1px solid #bbb;
            font-size: 0.833rem;
            padding: 0.375rem 0.75rem;
            cursor: pointer;
            transition: all 0.15s ease-in-out;

            &:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }
        }
    }
</style>
