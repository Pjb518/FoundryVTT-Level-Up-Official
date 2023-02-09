<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import ItemWrapper from "./ItemWrapper.svelte";

    export let label;
    export let items;
    export let type;

    const actor = getContext("actor");
    $: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<section class="category-container">
    <!-- svelte-ignore missing-declaration -->
    <span class="category-header">
        <h3>
            {localize(CONFIG.A5E[type][label] || label)}
        </h3>

        {#if !sheetIsLocked}
            <i class="fas fa-plus inventory-add-icon a5e-config-button" />
        {/if}
    </span>

    <ul class="items-container">
        {#each [...items] as item}
            <ItemWrapper>
                <img class="item-image" src={item.img} alt={item.name} />
                {item.name}
            </ItemWrapper>
        {/each}
    </ul>
</section>

<style lang="scss">
    .category-header {
        display: flex;
        align-items: center;
        margin-bottom: 0.25rem;
        border-bottom: 1px solid #ccc;

        h3 {
            font-family: "Modesto Condensed", serif;
            font-size: 1.3rem;
        }

        .inventory-add-icon {
            padding-inline: 0.25rem;
        }
    }

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
</style>
