<script>
    import ActivationCost from "./summarySections/ActivationCost.svelte";
    import Range from "./summarySections/Range.svelte";

    export let actionId = "";
    export let item;
</script>

<dl class="summary-list">
    <ActivationCost {actionId} {item} />
    <Range {actionId} {item} />
</dl>
