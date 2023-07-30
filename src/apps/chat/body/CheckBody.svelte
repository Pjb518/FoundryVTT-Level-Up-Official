<script>
    import RollSummary from "./RollSummary.svelte";

    export let message;
</script>

<hr class="a5e-rule a5e-rule--card" />

<section class="rolls">
    {#each $message.rolls as roll}
        <RollSummary {roll} isAction={false} />
    {/each}
</section>

<!-- TODO: Potentially add skill critical and fumble options here -->

<style lang="scss">
    .rolls {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>
