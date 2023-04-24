<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import getOrdinalNumber from "../../../utils/getOrdinalNumber";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import GenericScalingConfigDialog from "../../dialogs/initializers/GenericScalingConfigDialog";

    import AreaShape from "./AreaShape.svelte";
    import FormSection from "../FormSection.svelte";
    import TemplateScalingDialog from "../../dialogs/TemplateScalingDialog.svelte";

    export let action;
    export let actionId;
    export let item;

    const A5E = CONFIG.A5E;

    function getProperties(shape) {
        if (shape === "cone") return ["length"];
        else if (shape === "cube") return ["width"];
        else if (shape === "cylinder") return ["radius", "height"];
        else if (shape === "line") return ["length", "width"];
        else if (shape === "sphere") return ["radius"];

        return [];
    }

    function onClickScalingButton() {
        const title = `${$item.name} Target Scaling Configuration`;
        const dialog = new GenericScalingConfigDialog(
            $item,
            actionId,
            title,
            TemplateScalingDialog
        );
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

    $: properties = getProperties(action.area?.shape);
</script>

<section class="action-config__section">
    <header class="action-config__section-header">
        <h2 class="action-config__section-heading">
            {localize("A5E.ItemAreaShape")}
        </h2>
    </header>

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
        <FormSection>
            <div class="u-flex u-gap-lg u-w-full">
                <div class="u-flex u-flex-col u-gap-xs u-w-30">
                    <label for="{actionId}-area-quantity">
                        {localize("A5E.ItemQuantity")}
                    </label>

                    <input
                        id="{actionId}-area-quantity"
                        type="number"
                        value={action.area?.quantity ?? 1}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                `system.actions.${actionId}.area.quantity`,
                                Number(target.value)
                            )}
                    />
                </div>

                {#if ["cylinder", "sphere"].includes(action.area?.shape)}
                    <div class="u-flex u-flex-col u-gap-xs u-w-30">
                        <label for="{actionId}-area-radius">Radius</label>
                        <input
                            id="{actionId}-area-radius"
                            type="number"
                            value={action.area?.radius ?? 0}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    `system.actions.${actionId}.area.radius`,
                                    Number(target.value)
                                )}
                        />
                    </div>
                {/if}

                {#if ["cone", "line"].includes(action.area?.shape)}
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
                                    Number(target.value)
                                )}
                        />
                    </div>
                {/if}

                {#if ["cube", "line"].includes(action.area?.shape)}
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
                                    Number(target.value)
                                )}
                        />
                    </div>
                {/if}

                {#if action.area?.shape === "cylinder"}
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
                                    Number(target.value)
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
                                data-tooltip="A5E.ConfigureTargetScaling"
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
        </FormSection>
    {/if}

    <!-- Place Template -->
    {#if action.area?.shape}
        <FormSection>
            <div class="u-flex u-gap-lg u-w-full u-mt-xs">
                <div class="u-flex u-gap-md u-align-center">
                    <input
                        id="{actionId}-place-template"
                        type="checkbox"
                        checked={action.area?.placeTemplate ?? false}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                `system.actions.${actionId}.area.placeTemplate`,
                                target.checked
                            )}
                    />

                    <label class="u-pointer" for="{actionId}-place-template">
                        {localize("A5E.ItemPlaceTemplate")}
                    </label>
                </div>
            </div>
        </FormSection>
    {/if}
</section>

<style lang="scss">
    .area-shape {
        &-input {
            display: none;

            &:checked + .area-shape-label {
                background: #425f65;
                border-color: darken($color: #425f65, $amount: 5);
                box-shadow: 0 0 10px darken($color: #425f65, $amount: 10) inset;
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
            font-size: 0.833rem;
            padding: 0.5rem;
            cursor: pointer;
            transition: all 0.15s ease-in-out;
        }

        &-list {
            display: flex;
            width: 100%;
            gap: 0.375rem;
            margin: 0;
            padding-block: 0.25rem;
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
        font-size: 1rem;
        background: transparent;
        color: #999;
        border: 1px solid #7a7971;
        border-radius: 3px;
        cursor: pointer;

        transition: all 0.15s ease-in-out;

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
