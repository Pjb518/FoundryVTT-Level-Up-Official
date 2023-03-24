<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import Item from "./Item.svelte";
    import SpellSlots from "./SpellSlots.svelte";

    export let icon = null;
    export let label;
    export let level = 0;
    export let items;
    export let type;

    const actor = getContext("actor");

    const A5E = CONFIG.A5E;
    const itemContext = [...items][0]?.type || "item";

    function createItem() {
        const updateData = {
            name: `New ${itemContext}`,
            type: itemContext,
        };

        if (label !== "" && itemContext !== "item")
            updateData[`system.${itemContext}Type`] = label;

        $actor.createEmbeddedDocuments("Item", [updateData]);
    }

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
    $: showSpellSlots = $actor.flags?.a5e?.showSpellSlots ?? true;
    $: showSpellPoints = $actor.flags?.a5e?.showSpellPoints ?? false;
</script>

<section class="category-container">
    <!-- svelte-ignore missing-declaration -->
    {#if !(type === "featureTypes" && $actor.type === "npc")}
        <header
            class="category-header"
            class:category-header--locked={sheetIsLocked}
            class:category-header--object={itemContext === "object"}
            class:category-header--locked-object={sheetIsLocked &&
                itemContext === "object"}
            class:category-header--favorites={type === "favorites"}
            class:category-header--locked-favorites={sheetIsLocked &&
                type === "favorites"}
        >
            <h3 class="category-heading category-heading--name">
                <div>
                    {#if icon}
                        <i class={icon} />
                    {/if}

                    {#if type === "favorites"}
                        {localize(label)}
                    {:else}
                        {localize((CONFIG.A5E[type] ?? {})[label] ?? label)}
                    {/if}
                </div>

                {#if type === "spellLevels" && !showSpellSlots && showSpellPoints}
                    {localize("A5E.SpellPointsCost", {
                        cost: A5E.spellLevelCost[level],
                    })}
                {/if}

                {#if type === "spellLevels" && showSpellSlots}
                    <SpellSlots {level} />
                {/if}
            </h3>

            {#if itemContext === "object" || type === "favorites"}
                <h3 class="category-heading category-heading--quantity">
                    Quantity
                </h3>
            {/if}

            <h3 class="category-heading category-heading--uses">Uses</h3>

            <!-- {#if !sheetIsLocked}
                <i class="inventory-add-icon a5e-config-button" />
                <button
                    class="a5e-button a5e-button--add inventory-add-icon"
                    on:click={createItem}
                >
                    {localize("A5E.ButtonAdd", {
                        type: localize(A5E.itemTypes[itemContext]),
                    })}
                </button>
            {/if} -->
        </header>
    {/if}

    <ul class="items-container">
        {#each [...items] as item (item.id)}
            <Item {item} displayAsObject={type === "favorites"} />
        {/each}
    </ul>
</section>

<style lang="scss">
    .category-header {
        display: grid;
        grid-template-areas: "name uses menu";
        grid-template-columns: 1fr 6.25rem 2rem;

        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.25rem;
        padding: 0 0.5rem 0.25rem 0.125rem;
        text-align: center;
        border-bottom: 1px solid #ccc;

        &--locked {
            grid-template-areas: "name uses";
            grid-template-columns: 1fr 6.25rem;
        }

        &--favorites,
        &--object {
            grid-template-areas: "name quantity uses menu";
            grid-template-columns: 1fr 4rem 6.25rem 2rem;
        }

        &--locked-favorites,
        &--locked-object {
            grid-template-areas: "name quantity uses";
            grid-template-columns: 1fr 4rem 6.25rem;
        }
    }

    .category-heading {
        font-size: 0.833rem;

        &--name {
            display: grid;
            align-items: center;
            grid-template-columns: minmax(3.5rem, max-content) 1fr;
            gap: 0.75rem;
            grid-area: name;
            text-align: left;
        }

        &--quantity {
            grid-area: quantity;
        }

        &--uses {
            grid-area: uses;
        }
    }

    // .category-header {
    //     display: flex;

    //     height: 1.5rem;

    //     .inventory-add-icon {
    //         padding-inline: 0.25rem;
    //     }
    // }

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
