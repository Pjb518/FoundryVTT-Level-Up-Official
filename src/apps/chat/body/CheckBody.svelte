<script>
    import RollSummary from "./RollSummary.svelte";

    export let message;
</script>

<hr class="a5e-rule a5e-rule--card" />

{#each $message.rolls as roll}
    <RollSummary {roll} />
{/each}

<!-- TODO: Potentially add skill critical and fumble options here -->
