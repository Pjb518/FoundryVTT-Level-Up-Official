<p>
    Below you'll find a list of premium content modules organized by publisher.
    Some of these modules are included for free when you purchase the a PDF or
    physical book. Others modules are sold as standalone products.
</p>

<p class="a5e-content-disclaimer">
    <b>Disclaimer.</b> This page contains affiliate links. If you choose to make
    a purchase after clicking a link, we may receive a small amount of kickback from
    DriveThruRPG that will go towards developing and maintaining the A5e Foundry
    system and its modules.
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
    .a5e-content-disclaimer {
        padding: 0.5rem 0.75rem;
        margin-block: 0.75rem;
        background: #425f65;
        color: #f6f2eb;
        box-shadow: 0 0 10px #2e4246 inset;
        border-radius: 4px;
        text-wrap: pretty;
    }

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
