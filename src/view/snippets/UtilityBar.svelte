<script lang="ts">
    let { children } = $props();
</script>

<section class="a5e-utility-bar">
    {@render children()}
</section>

<style lang="scss">
    .utility-bar {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding-right: 0.25rem;
        font-size: var(--a5e-md-text);
        color: var(--a5e-button-gray);
    }
</style>
