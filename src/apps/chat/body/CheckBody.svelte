<script>
    import D20Roll from "../dice/D20Roll.svelte";

    export let message;
</script>

<hr class="a5e-rule a5e-rule--card" />

{#each $message.rolls as roll}
    <D20Roll {roll} />
{/each}

<!-- TODO: Potentially add skill critical and fumble options here -->
