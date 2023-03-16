<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import calculateCarryCapacity from "../handlers/calculateCarryCapacity";
    import calculateInventoryWeight from "../handlers/calculateInventoryWeight";

    const actor = getContext("actor");

    $: inventoryWeight = calculateInventoryWeight($actor);
    $: carryCapacity = calculateCarryCapacity($actor);
    $: encumbrancePercentage = Math.min(
        (inventoryWeight / carryCapacity) * 100,
        100
    );
</script>

<div
    class="
		track-container
		u-border
        u-border-thin
        u-border-light-gray
        u-h-4
        u-pos-relative
        u-rounded
        u-w-full
    "
    style="background-color: #a9a594;"
>
    <div
        class="u-h-full u-rounded"
        style="color: #eee; text-shadow: 0 0 2px #000"
        style:background-color={encumbrancePercentage === 100
            ? "#8b2525"
            : "#0b5a2f"}
        style:width={`${Math.min(encumbrancePercentage, 100)}%`}
    >
        <div
            class="
        u-flex
        u-gap-md
        u-pos-absolute
        u-pos-center
        u-text-light
            u-text-sm"
        >
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
        flex: 0 0 100%;
    }
</style>
