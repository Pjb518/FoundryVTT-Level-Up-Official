<script>
    export let item;
</script>

<li class="item-wrapper" draggable="true">
    <img class="item-image" src={item.img} alt={item.name} />
    {item.name}
</li>

<style>
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
