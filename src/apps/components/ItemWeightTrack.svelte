<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/util/i18n";

    import calculateCarryCapacity from "../handlers/calculateCarryCapacity";
    import calculateInventoryWeight from "../handlers/calculateInventoryWeight";

    const actor = getContext("actor");

    $: inventoryWeight = calculateInventoryWeight($actor);
    $: carryCapacity = calculateCarryCapacity($actor);
    $: encumbrancePercentage = Math.min((inventoryWeight / carryCapacity) * 100, 100);
</script>

<div
    class="track-container"
    style="background-color: var(--a5e-inventory-track-container-background);"
>
    <div
        class="track-container--color"
        style:background-color={encumbrancePercentage === 100
            ? "var(--a5e-color-error)"
            : "#0b5a2f"}
        style:width={`${Math.min(encumbrancePercentage, 100)}%`}
    >
        <div class="track-text-container">
            <span>
                {inventoryWeight?.toFixed(1)}
                {localize("A5E.MeasurementPoundsAbbr")}
            </span>

            /

            <span>
                {carryCapacity}
                {localize("A5E.MeasurementPoundsAbbr")}
            </span>

            {#if encumbrancePercentage === 100}
                <span>
                    {localize("A5E.ConditionEncumbered")}
                </span>
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    .track-container {
        border: 1px solid var(--a5e-border-color);
        flex: 0 0 100%;
        position: relative;
        height: 1rem;
        width: 100%;
        border-radius: var(--a5e-border-radius-standard);
        background-color: var(--a5e-inventory-track-container-background);

        &--color {
            height: 100%;
            border-radius: var(--a5e-border-radius-standard);
            text-shadow: 0 0 2px var(--a5e-inventory-track-shadow);
        }
    }

    .track-text-container {
        display: flex;
        gap: 0.5rem;

        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        color: var(--a5e-inventory-track-color);
        font-size: var(--a5e-text-size-sm);
    }
</style>
