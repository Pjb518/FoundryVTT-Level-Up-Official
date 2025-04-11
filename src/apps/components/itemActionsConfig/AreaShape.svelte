<script>
    import { localize } from "#utils/localization/localize.ts";

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
            `system.actions.${actionId}.area.quantity`,
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
                background: var(--a5e-action-area-button-checked);
                border-color: var(--a5e-action-area-button-checked-border);
                box-shadow: 0 0 10px
                    var(--a5e-action-area-button-checked-shadow) inset;
                color: var(--a5e-action-area-button-checked-color);

                &:hover {
                    background: var(--a5e-action-area-button-checked-hover);
                }
            }
        }

        &__label {
            display: flex;
            align-items: center;
            flex-grow: 1;
            gap: 0.5rem;
            background-color: var(--a5e-action-area-label-background);
            border-radius: var(--a5e-border-radius-standard);
            border: 1px solid var(--a5e-action-area-label-border);
            font-size: var(--a5e-text-size-sm);
            padding: 0.375rem 0.5rem;
            cursor: pointer;
            transition: var(--a5e-transition-standard);

            &:hover {
                background-color: var(--a5e-action-area-label-background-hover);
            }
        }
    }
</style>
