<script>
    import RollTooltip from "../dice/RollTooltip.svelte";

    export let roll;

    function isCriticalSuccess(roll) {
        const d20Roll = roll.terms.find((term) => term.faces === 20);

        if (!d20Roll) return false;

        return d20Roll.results.some(
            ({ result, active }) => active && result === 20
        );
    }

    function isCriticalFailure(roll) {
        const d20Roll = roll.terms.find((term) => term.faces === 20);

        if (!d20Roll) return false;

        return d20Roll.results.some(
            ({ result, active }) => active && result === 1
        );
    }

    let tooltipIsVisible = false;
</script>

{#if tooltipIsVisible}
    <RollTooltip
        {roll}
        on:toggleTooltipVisibility={() =>
            (tooltipIsVisible = !tooltipIsVisible)}
    />
{/if}

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class="a5e-roll a5e-roll--total u-pointer"
    class:max={isCriticalSuccess(roll)}
    class:min={isCriticalFailure(roll)}
    on:click={() => (tooltipIsVisible = !tooltipIsVisible)}
>
    {roll.total}
</div>
