<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import ItemWrapper from "./item/ItemWrapper.svelte";

    const actor = getContext("actor");
    const { objects } = actor;
</script>

<header class="section-header">
    <h3>
        {localize("A5E.TabInventory")}
    </h3>
</header>

<ul class="items-container">
    {#each [...$objects] as item}
        <ItemWrapper>
            <img class="item-image" src={item.img} alt={item.name} />
            {item.name}
        </ItemWrapper>
    {/each}
</ul>

<style lang="scss">
    .item-image {
        height: 1.75rem;
        width: 1.75rem;
        border-radius: 3px;
    }

    .items-container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0;
        padding-right: 0.375rem;
        margin: 0;
        margin-right: -0.375rem;
        list-style: none;
        overflow-y: auto;
    }

    .section-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.25rem;
        padding-top: 0;
        border-bottom: 1px solid #ccc;
        font-size: 1rem;
        font-family: "Modesto Condensed", serif;
    }
</style>
