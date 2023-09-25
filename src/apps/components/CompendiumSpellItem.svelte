<script>
    export let document;
</script>

<li class="spell">
    <img class="spell__image" src={$document.img} alt={$document.name} />

    <span>
        {$document.name}
    </span>
</li>

<style lang="scss">
    .spell {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &__image {
            width: 1.5rem;
            height: 1.5rem;
        }
    }
</style>
