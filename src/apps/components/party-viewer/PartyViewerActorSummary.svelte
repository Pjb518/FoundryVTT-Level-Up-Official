<script>
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    export let uuid;

    const actor = new TJSDocument();
    actor.setFromUUID(uuid);
</script>

<li class="party-member">
    <img class="actor-image" src={$actor?.img} alt={$actor?.name} />
    <span>{$actor?.name}</span>
</li>

<style lang="scss">
    .actor-image {
        height: 2.25rem;
        width: 2.25rem;
        margin: 0;
        padding: 0;
        object-fit: cover;
    }

    .party-member {
        display: grid;
        grid-template-columns: max-content 1fr;
        align-items: center;
        gap: 0.5rem;
        padding: 0.125rem;
        border: 1px solid #ccc;
        border-radius: $border-radius-standard;
        background: var(--item-background, rgba(0, 0, 0, 0.05));
    }
</style>
