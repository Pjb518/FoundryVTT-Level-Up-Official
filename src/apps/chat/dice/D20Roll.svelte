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

<style class="scss">
    .max {
        color: #18520b;
        background-color: #c7d0c0;
        border: 1px solid #97ae8f;
    }
    .min {
        color: #aa0200;
        background-color: #ffdddd;
        border: 1px solid #f0b5b5;
    }
</style>
