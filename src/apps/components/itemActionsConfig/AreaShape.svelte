<script>
    import { localize } from "#runtime/svelte/helper";

    import updateAssociatedValues from "../../handlers/updateAssociatedValues";

    export let action;
    export let actionId;
    export let item;
    export let key;
    export let name;

    const A5E = CONFIG.A5E;

    function removeArea() {
        $item.update({
            [`system.actions.${actionId}.area`]: {
                "-=width": null,
                "-=radius": null,
                "-=height": null,
                "-=length": null,
            },
        });
    }
</script>

<input
    class="area-shape__input"
    id="area-{actionId}-{key}"
    name="{actionId}-area-shape"
    value={key}
    type="radio"
    checked={action?.area?.shape === key}
    on:click={({ target }) => {
        removeArea();

        updateAssociatedValues(
            $item,
            `system.actions.${actionId}.area.shape`,
            target.value,
            `system.actions.${actionId}.area.quantity`
        );
    }}
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
                background: $color-primary;
                border-color: darken($color: $color-primary, $amount: 5);
                box-shadow: 0 0 10px darken($color: $color-primary, $amount: 10)
                    inset;
                color: $color-light-text;

                &:hover {
                    background: $color-primary;
                }
            }
        }

        &__label {
            display: flex;
            align-items: center;
            flex-grow: 1;
            gap: 0.5rem;
            border-radius: $border-radius-standard;
            border: 1px solid #bbb;
            font-size: $font-size-sm;
            padding: 0.375rem 0.5rem;
            cursor: pointer;
            transition: $standard-transition;

            &:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }
        }
    }
</style>
