<script>
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    export let uuid = null;

    const spell = new TJSDocument();
    spell.setFromUUID(uuid);
</script>

<li class="spell">
    <img class="spell__image" src={$spell?.img} alt={$spell?.name} />

    {$spell?.name}
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
