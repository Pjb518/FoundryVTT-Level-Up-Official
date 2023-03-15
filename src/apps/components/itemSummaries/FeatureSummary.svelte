<script>
    import ActivationCost from "./summarySections/ActivationCost.svelte";
    import Area from "./summarySections/Area.svelte";
    import Range from "./summarySections/Range.svelte";
    import Targets from "./summarySections/Targets.svelte";

    export let actionId = "";
    export let item;

    let listHeight;
</script>

<dl
    bind:clientHeight={listHeight}
    class="summary-list"
    class:hide={listHeight === 0}
>
    <ActivationCost {actionId} {item} />
    <Range {actionId} {item} />
    <Targets {actionId} {item} />
    <Area {actionId} {item} />
</dl>

<style>
    .summary-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin: 0 0 0.5rem 0;
    }

    .hide {
        display: none;
    }
</style>
