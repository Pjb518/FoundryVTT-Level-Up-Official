<script>
    import { localize } from "#runtime/svelte/helper";

    import TemplatePreparationManager from "../../../managers/TemplatePreparationManager";

    import getOrdinalNumber from "../../../utils/getOrdinalNumber";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import GenericConfigDialog from "../../dialogs/initializers/GenericConfigDialog";

    import AreaShape from "./AreaShape.svelte";
    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";
    import TemplateScalingDialog from "../../dialogs/TemplateScalingDialog.svelte";

    export let action;
    export let actionId;
    export let item;

    const A5E = CONFIG.A5E;
    const getShapeProperties = TemplatePreparationManager.getShapeProperties;

    function onClickScalingButton() {
        let dialog = $item.dialogs.areaScaling[actionId];

        if (!dialog) {
            $item.dialogs.areaScaling[actionId] = new GenericConfigDialog(
                $item,
                `${$item.name} Target Scaling Configuration`,
                TemplateScalingDialog,
                { actionId },
            );

            dialog = $item.dialogs.areaScaling[actionId];
        }

        dialog.render(true);
    }

    function getLocalization(type) {
        if (properties.length === 1)
            return localize(`A5E.scaling.summaries.${type}.template`, {
                shape: action?.area.shape,
                formula: action?.area.scaling?.formula?.[properties[0]] ?? 0,
                property: properties[0],
                unit: "feet",
                level: getOrdinalNumber($item.system.level ?? 0),
                step: action.area?.scaling?.step,
            });
        else if (properties.length === 2)
            return localize(`A5E.scaling.summaries.${type}.templateMulti`, {
                shape: action?.area.shape,
                formula1: action.area.scaling?.formula?.[properties[0]] ?? 0,
                formula2: action.area.scaling?.formula?.[properties[1]] ?? 0,
                property1: properties[0],
                property2: properties[1],
                unit: "feet",
                level: getOrdinalNumber($item.system.level ?? 0),
                step: action.area?.scaling?.step,
            });
    }

    function removeArea() {
        $item.update({
            [`system.actions.${actionId}`]: {
                "-=area": null,
            },
        });
    }

    $: properties = [...getShapeProperties(action.area?.shape)];
</script>

<Section
    heading="A5E.ItemAreaShape"
    --a5e-section-body-gap="0.75rem"
    --a5e-section-body-padding="0 0.25rem"
    --a5e-section-margin="0"
    --a5e-section-gap="0.5rem"
>
    <div class="area-shape-list">
        <!-- svelte-ignore missing-declaration (foundry)-->
        <input
            class="area-shape-input"
            id="area-{actionId}-none"
            name="{actionId}-area-shape"
            value={null}
            type="radio"
            checked={foundry.utils.isEmpty(action.area)}
            on:change={removeArea}
        />

        <label class="area-shape-label" for="area-{actionId}-none">
            <span class="u-text-sm">
                <i class="fas fa-times-circle" />
            </span>

            {localize("A5E.None")}
        </label>

        {#each Object.entries(A5E.areaTypes) as [key, name] (key)}
            <AreaShape {action} {actionId} {item} {key} {name} />
        {/each}
    </div>

    {#if action.area?.shape}
        <div class="u-flex u-gap-md u-w-full">
            <FieldWrapper
                heading="A5E.ItemQuantity"
                --a5e-field-wrapper-width="7.5rem"
            >
                <input
                    id="{actionId}-area-quantity"
                    type="number"
                    value={action.area?.quantity ?? 1}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            `system.actions.${actionId}.area.quantity`,
                            Number(target.value),
                        )}
                />
            </FieldWrapper>

            {#if getShapeProperties(action.area.shape).includes("radius")}
                <FieldWrapper
                    heading="Radius"
                    --a5e-field-wrapper-width="7.5rem"
                >
                    <input
                        id="{actionId}-area-radius"
                        type="number"
                        value={action.area?.radius ?? 0}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                `system.actions.${actionId}.area.radius`,
                                Number(target.value),
                            )}
                    />
                </FieldWrapper>
            {/if}

            {#if getShapeProperties(action.area.shape).includes("length")}
                <div class="u-flex u-flex-col u-gap-xs u-w-30">
                    <label for="{actionId}-area-length">Length</label>
                    <input
                        id="{actionId}-area-length"
                        type="number"
                        value={action.area?.length ?? 0}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                `system.actions.${actionId}.area.length`,
                                Number(target.value),
                            )}
                    />
                </div>
            {/if}

            {#if getShapeProperties(action.area.shape).includes("width")}
                <div class="u-flex u-flex-col u-gap-xs u-w-30">
                    <label for="{actionId}-area-width">Width</label>
                    <input
                        id="{actionId}-area-width"
                        type="number"
                        value={action.area?.width ?? 0}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                `system.actions.${actionId}.area.width`,
                                Number(target.value),
                            )}
                    />
                </div>
            {/if}

            {#if getShapeProperties(action.area.shape).includes("height")}
                <div class="u-flex u-flex-col u-gap-xs u-w-30">
                    <label for="{actionId}-area-height">Height</label>
                    <input
                        id="{actionId}-area-height"
                        type="number"
                        value={action.area?.height ?? 0}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                `system.actions.${actionId}.area.height`,
                                Number(target.value),
                            )}
                    />
                </div>
            {/if}

            <!-- Scaling -->
            {#if action.area.shape}
                <div class="a5e-field-group scaling-button-wrapper">
                    <button
                        class="scaling-button"
                        on:click|preventDefault={onClickScalingButton}
                    >
                        <i
                            class="fa-solid fa-arrow-up-right-dots"
                            data-tooltip="A5E.ConfigureAreaScaling"
                            data-tooltip-direction="UP"
                        />
                    </button>
                </div>
            {/if}
        </div>
        {#if action.area?.scaling?.mode === "cantrip"}
            <small>
                {getLocalization("cantrip", action.area)}
            </small>
        {:else if action.area?.scaling?.mode === "spellLevel"}
            <small>
                {#if !action.area?.scaling?.step || action.area?.scaling?.step === 1}
                    {getLocalization("spellLevel", action.area)}
                {:else}
                    {getLocalization("steppedSpellLevel", action.area)}
                {/if}
            </small>
        {:else if action.area?.scaling?.mode === "spellPoints"}
            <small>
                {#if !action.area?.scaling?.step || action.area?.scaling?.step === 1}
                    {getLocalization("spellPoint", action.area)}
                {:else}
                    {getLocalization("steppedSpellPoint", action.area)}
                {/if}
            </small>
        {:else if ["actionUses", "itemUses"].includes(action.area?.scaling?.mode)}
            <small>
                {#if !action.area?.scaling?.step || action.area?.scaling?.step === 1}
                    {getLocalization("steppedSpellLevel", action.area)}
                {:else}
                    {getLocalization("steppedSpellLevel", action.area)}
                {/if}
            </small>
        {/if}
    {/if}

    <!-- Place Template -->
    {#if action.area?.shape}
        <FieldWrapper>
            <Checkbox
                label="A5E.ItemPlaceTemplate"
                checked={action.area?.placeTemplate ?? false}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $item,
                        `system.actions.${actionId}.area.placeTemplate`,
                        detail,
                    );
                }}
            />
        </FieldWrapper>
    {/if}
</Section>

<style lang="scss">
    .area-shape {
        &-input {
            display: none;

            &:checked + .area-shape-label {
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

        &-label {
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

        &-list {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            width: 100%;
            gap: 0.375rem;
            margin: 0;
        }
    }

    .scaling-button {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1.625rem;
        width: 1.625rem;
        padding: 0;
        margin: 0;
        font-size: $font-size-md;
        background: transparent;
        color: #999;
        border: 1px solid #7a7971;
        border-radius: $border-radius-standard;
        cursor: pointer;

        transition: $standard-transition;

        i {
            margin: 0;
        }

        &:focus,
        &:hover {
            color: #555;
        }
    }

    .scaling-button-wrapper {
        justify-content: flex-end;
    }
</style>
