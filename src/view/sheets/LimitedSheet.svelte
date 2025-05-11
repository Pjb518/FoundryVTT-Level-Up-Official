<script lang="ts">
    let { actor, item, sheet } = $props();
    let document = actor ?? item;

    const description = document.system.unidentified
        ? document.system.unidentifiedDescription
        : document.system.description;

    const showDescription = description?.length
        ? (game.settings.get("a5e", "showDescriptionOnLimitedPerms") ?? false)
        : false;
</script>

<main>
    <div class="image-wrapper">
        <img class="document-image" src={document.img} alt={document.name} />
    </div>

    <h1 class="document-name">{document.name}</h1>

    {#if showDescription}
        <hr class="a5e-rule a5e-limited-sheet-rule" />
        <div class="description-wrapper">
            {@html description}
        </div>
    {/if}
</main>

<style lang="scss">
    .description-wrapper {
        margin-inline: 1rem;
        margin-block: 0.75rem;
        padding-bottom: 0.5rem;
    }

    .image-wrapper {
        width: 32rem;
        height: 32rem;
        padding: 0.25rem;
    }

    .document-image {
        width: 100%;
        height: auto;
        border-radius: 5px;
    }

    h1 {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2.75rem;
        margin-inline: 0.5rem;
        border-radius: 4px;
        font-family: var(--a5e-font-primary);
    }

    main {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        overflow-y: scroll;
    }
</style>
