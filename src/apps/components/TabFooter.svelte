<script>
</script>

<footer class="tab-footer">
    <slot />
</footer>

<style lang="scss">
    .tab-footer {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        align-items: center;
        justify-content: space-between;
        font-size: $font-size-sm;
        padding-right: var(--padding-right, 0);
    }
</style>
