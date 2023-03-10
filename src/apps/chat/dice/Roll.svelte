<script>
    import RollTooltip from "../dice/RollTooltip.svelte";

    export let roll;

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
    on:click={() => (tooltipIsVisible = !tooltipIsVisible)}
>
    {roll.total}
</div>
