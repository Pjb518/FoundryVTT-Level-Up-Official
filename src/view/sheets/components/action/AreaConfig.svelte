<script lang="ts">
    import type { Action } from "#types/action.js";
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import TemplatePreparationManager from "../../../../managers/TemplatePreparationManager.js";
    import { GenericConfigDialog } from "#view/dialogs/initializers/GenericConfigDialog.svelte.ts";

    import { getOrdinalNumber } from "#utils/getOrdinalNumber.ts";
    import { prepareScalingSummary } from "#utils/view/helpers/prepareScalingSummary.ts";
    import { updateAssociatedValues } from "#utils/view/updateAssociatedValues.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";
    import TemplateScalingDialog from "#view/dialogs/TemplateScalingDialog.svelte";

    function configureScaling() {
        let dialog = item.dialogs?.areaScaling?.[actionId];

        if (dialog) {
            dialog.render(true);
            return;
        }

        item.dialogs.areaScaling[actionId] = new GenericConfigDialog(
            item,
            `${item.name} Target Scaling Configuration`,
            TemplateScalingDialog,
            { actionId },
        );

        dialog = item.dialogs.areaScaling[actionId];
        dialog.render(true);
    }

    function removeArea() {
        item.update({
            [`system.actions.${actionId}`]: {
                "-=area": null,
            },
        });
    }

    let actionId: string = getContext("actionId");
    let item: any = getContext("item");
    let action = $derived(item.reactive.actions.get(actionId));

    const { A5E } = CONFIG;
    const getShapeProperties = TemplatePreparationManager.getShapeProperties;
    const { isEmpty } = foundry.utils;
    const allProperties = ["width", "radius", "height", "length"];

    let shapeProps = $derived([...getShapeProperties(action.area?.shape)]);

    let localizeProps = $derived({
        shape: action.area?.shape,
        value: action.area.scaling?.formula?.[shapeProps?.[0]] ?? 0,
        value2: action.area.scaling?.formula?.[shapeProps?.[1]] ?? 0,
        property: shapeProps?.[0],
        property2: shapeProps?.[1],
        unit: "feet",
        level: getOrdinalNumber(item.system.level ?? 0),
    });

    let scalingSummary = $derived(
        shapeProps.length === 2
            ? prepareScalingSummary(
                  "templateMulti",
                  action.area.scaling,
                  localizeProps,
              )
            : prepareScalingSummary(
                  "template",
                  action.area.scaling,
                  localizeProps,
              ),
    );
</script>

{#snippet AreaShape(key: string, name: string)}
    <input
        class="a5e-area-shape__input"
        id="area-{actionId}-{key}"
        value={key}
        type="radio"
        checked={key ? action.area?.shape === key : isEmpty(action.area)}
        onclick={({ currentTarget }) => {
            removeArea();
            if (key === null) return;

            updateAssociatedValues(
                item,
                `system.actions.${actionId}.area.shape`,
                currentTarget.value,
                `system.actions.${actionId}.area.quantity`,
            );
        }}
    />

    <label class="a5e-area-shape__label" for="area-{actionId}-{key}">
        <span class="a5e-area-shape__label-icon">
            {@html A5E.areaIcons[key] ?? A5E.areaIcons.none}
        </span>

        {localize(name)}
    </label>
{/snippet}

<Section
    heading="A5E.items.headings.areaShape"
    --a5e-section-body-gap="0.75rem"
    --a5e-section-gap="0.5rem"
>
    <div class="a5e-area-shape__list">
        {@render AreaShape(null, "A5E.None")}

        {#each Object.entries(A5E.areaTypes) as [key, name] (key)}
            {@render AreaShape(key, name)}
        {/each}
    </div>

    {#if action.area?.shape}
        <div class="a5e-area-shape__details">
            <FieldWrapper heading="A5E.ItemQuantity">
                <input
                    class="a5e-input a5e-input--slim a5e-input--small"
                    id="{actionId}-area-quantity"
                    type="number"
                    value={action.area?.quantity ?? 1}
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            item,
                            `system.actions.${actionId}.area.quantity`,
                            Number(currentTarget.value),
                        )}
                />
            </FieldWrapper>

            {#each allProperties as prop (prop)}
                {#if shapeProps.includes(prop)}
                    <FieldWrapper heading={prop.capitalize()}>
                        <input
                            class="a5e-input a5e-input--slim a5e-input--small"
                            type="number"
                            value={action.area?.[prop] ?? 0}
                            onchange={({ currentTarget }) =>
                                updateDocumentDataFromField(
                                    item,
                                    `system.actions.${actionId}.area.${prop}`,
                                    Number(currentTarget.value),
                                )}
                        />
                    </FieldWrapper>
                {/if}
            {/each}

            <button
                class="a5e-button a5e-button--scaling"
                data-tooltip="A5E.scaling.headings.configureArea"
                data-tooltip-direction="UP"
                aria-label="A5E.scaling.headings.configureArea"
                onclick={configureScaling}
            >
                <i class="fa-solid fa-arrow-up-right-dots"></i>
            </button>
        </div>

        <small class="a5e-area-shape__scaling-hint">
            {scalingSummary}
        </small>

        <!-- Place Template -->
        <FieldWrapper>
            <Checkbox
                label="A5E.actions.labels.placeTemplate"
                checked={action.area?.placeTemplate ?? false}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(
                        item,
                        `system.actions.${actionId}.area.placeTemplate`,
                        value,
                    )}
            />
        </FieldWrapper>
    {/if}
</Section>

<style lang="scss">
    .a5e-area-shape {
        &__list {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            width: 100%;
            gap: 0.375rem;
            margin: 0;
        }

        &__input {
            display: none;

            &:checked + .a5e-area-shape__label {
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
            font-size: var(--a5e-sm-text);
            padding: 0.375rem 0.5rem;
            cursor: pointer;
            transition: var(--a5e-transition-standard);

            &:hover {
                background-color: var(--a5e-action-area-label-background-hover);
            }
        }

        &__details {
            display: flex;
            gap: 0.75rem;
            width: 100%;
            align-items: end;
        }

        &__scaling-hint {
            font-size: var(--a5e-xs-text);
        }
    }
</style>
