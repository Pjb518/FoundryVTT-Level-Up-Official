<script>
    export let item;
</script>

<li class="item-wrapper" draggable="true">
    <img class="item-image" src={item.img} alt={item.name} />
    {item.name}
</li>

<ul class="actions-list">
    {#each Object.values(item.system.actions) as action}
        <li class="item-wrapper" draggable="false">
            <img
                class="item-image"
                src={action.img ?? "icons/svg/item-bag.svg"}
                alt={action.name}
            />

            {action.name}
        </li>
    {/each}
</ul>

<style>
    .actions-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin: 0;
        padding: 0 0 0 1rem;
    }

    .item-wrapper {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        height: fit-content;
        width: 100%;
        gap: 0.5rem;
        padding: 0.125rem;
        border: 1px solid #ccc;
        border-radius: 3px;
        background: rgba(0, 0, 0, 0.05);
        cursor: pointer;
    }

    .item-image {
        height: 1.75rem;
        width: 1.75rem;
        border-radius: 3px;
    }
</style>
