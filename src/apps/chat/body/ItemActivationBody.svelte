<script>
    export let message;
</script>

{#if $message.flags?.a5e?.description}
    <hr class="a5e-rule a5e-rule--card" />

    <p>{@html $message.flags?.a5e?.description}</p>
{/if}
