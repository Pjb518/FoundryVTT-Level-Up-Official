<p style="margin-bottom: 0.75rem;">
    Below you'll find a list of premium content modules organized by publisher.
    Some of these modules are included for free when you purchase the a PDF or
    physical book. Others modules are sold as standalone products.
</p>

{#each Object.values(CONFIG.A5E.premiumContent) as { name, releases }}
    <h3>{name}</h3>

    <ul class="content-list">
        {#each releases as { title, url }}
            <li class="content-list__item">
                <a href={url} target="_blank">{title}</a>
            </li>
        {/each}
    </ul>
{/each}

<style lang="scss">
    .content-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        list-style: none;
        padding: 0;
        margin: 0;
        margin-bottom: 0.5rem;

        &__item a {
            text-decoration: none;
        }
    }

    h3 {
        margin-bottom: 0.375rem;
    }
</style>
