<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import AreaShape from "./AreaShape.svelte";
    import FormSection from "../FormSection.svelte";

    export let action;
    export let actionId;
    export let item;

    const A5E = CONFIG.A5E;

    function removeArea() {
        $item.update({
            [`system.actions.${actionId}`]: {
                "-=area": null,
            },
        });
    }
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
            </div>
        </FormSection>
    {/if}

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
</style>
