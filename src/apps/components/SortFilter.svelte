<script>
</script>

<div class="sort-filter__container">
    <button class="s-f__button">
        <i class="fas fa-sort" />
    </button>

    <button class="s-f__button">
        <i class="fas fa-filter" />
    </button>
</div>

<style lang="scss">
    .sort-filter__container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .s-f__button {
        width: 1.75rem;
        padding-inline: 0.25rem;
        background: transparent;
        color: rgba(0 0 0 / 0.5);
        transition: all 0.15s ease-in-out;

        &:focus,
        &:hover {
            box-shadow: none;
            transform: scale(1.2);
            color: #555;
        }
    }
</style>
