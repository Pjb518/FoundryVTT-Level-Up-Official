<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { calculateCarryCapacity } from "#utils/calculateCarryCapacity.ts";
    import { calculateInventoryWeight } from "#utils/calculateInventoryWeight.ts";

    let actor: any = getContext("actor");

    let inventoryWeight = $derived(calculateInventoryWeight(actor.reactive));
    let carryCapacity = $derived(calculateCarryCapacity(actor.reactive));
    let encumbrancePercentage = $derived(
        Math.min((inventoryWeight / carryCapacity) * 100, 100),
    );
</script>

<div
    class="a5e-actor-track-container"
    style="background-color: var(--a5e-inventory-track-container-background);"
>
    <div
        class="a5e-actor-track-container--color"
        style:background-color={encumbrancePercentage === 100
            ? "var(--a5e-color-error)"
            : "#0b5a2f"}
        style:width={`${Math.min(encumbrancePercentage, 100)}%`}
    >
        <div class="a5e-actor-track-text-container">
            <span>
                {inventoryWeight?.toFixed(1)}
                {localize("A5E.objects.weightLbs")}
            </span>

            /

            <span>
                {carryCapacity}
                {localize("A5E.objects.weightLbs")}
            </span>

            {#if encumbrancePercentage === 100}
                <span>
                    {localize("A5E.conditions.encumbered")}
                </span>
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    .a5e-actor-track-container {
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

    .a5e-actor-track-text-container {
        display: flex;
        gap: 0.5rem;

        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        color: var(--a5e-inventory-track-color);
        font-size: var(--a5e-sm-text);
    }
</style>
