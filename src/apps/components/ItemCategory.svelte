<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import Item from "./Item.svelte";
    import SpellSlots from "./SpellSlots.svelte";

    export let icon = null;
    export let label;
    export let level = 0;
    export let items;
    export let type;

    export let usesRequired = false;
    export let quantityRequired = false;

    const actor = getContext("actor");

    const A5E = CONFIG.A5E;
    // const itemContext = [...items][0]?.type || "item";

    function getHeadingTemplateConfiguration(
        usesRequired,
        quantityRequired,
        sheetIsLocked
    ) {
        let areas = "name";
        let columns = "1fr";

        if (usesRequired) {
            if (quantityRequired) {
                areas = "name quantity uses";
                columns = "1fr 4rem 6.25rem";
            } else {
                areas = "name uses";
                columns = "1fr 6.25rem";
            }
        } else if (quantityRequired) {
            areas = "name quantity";
            columns = "1fr 4rem";
        }

        if (!sheetIsLocked) {
            areas += ` menu`;
            columns += ` 2rem`;
        }

        return { areas: `"${areas}"`, columns };
    }

    function getItemTemplateConfiguration(
        usesRequired,
        quantityRequired,
        sheetIsLocked
    ) {
        let areas = "icon name indicators";
        let columns = "min-content 1fr min-content";

        if (usesRequired) {
            if (quantityRequired) {
                areas = "icon name indicators quantity uses";
                columns = "min-content 1fr min-content 4rem 6.25rem";
            } else {
                areas = "icon name indicators uses";
                columns = "min-content 1fr min-content 6.25rem";
            }
        } else if (quantityRequired) {
            areas = "icon name indicators quantity";
            columns = "min-content 1fr min-content 4rem";
        }

        if (!sheetIsLocked) {
            areas += ` menu`;
            columns += ` 2rem`;
        }

        return { areas: `"${areas}"`, columns };
    }

    // function createItem() {
    //     const updateData = {
    //         name: `New ${itemContext}`,
    //         type: itemContext,
    //     };

    //     if (label !== "" && itemContext !== "item")
    //         updateData[`system.${itemContext}Type`] = label;

    //     $actor.createEmbeddedDocuments("Item", [updateData]);
    // }

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
    $: showSpellSlots = $actor.flags?.a5e?.showSpellSlots ?? true;
    $: showSpellPoints = $actor.flags?.a5e?.showSpellPoints ?? false;

    $: headingTemplateConfiguration = getHeadingTemplateConfiguration(
        usesRequired,
        quantityRequired,
        sheetIsLocked
    );

    $: itemTemplateConfiguration = getItemTemplateConfiguration(
        usesRequired,
        quantityRequired,
        sheetIsLocked
    );
</script>

<section class="category-container">
    <!-- svelte-ignore missing-declaration -->
    {#if !(type === "featureTypes" && $actor.type === "npc")}
        <header
            class="category-header"
            style="
                --headingTemplateAreas: {headingTemplateConfiguration.areas};
                --headingTemplateColumns: {headingTemplateConfiguration.columns}
            "
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

            {#if quantityRequired}
                <h3 class="category-heading category-heading--quantity">
                    Quantity
                </h3>
            {/if}

            {#if usesRequired}
                <h3 class="category-heading category-heading--uses">Uses</h3>
            {/if}

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
            <Item
                {item}
                --itemTemplateAreas={itemTemplateConfiguration.areas}
                --itemTemplateColumns={itemTemplateConfiguration.columns}
            />
        {/each}
    </ul>
</section>

<style lang="scss">
    .category-header {
        display: grid;
        grid-template-areas: var(--headingTemplateAreas);
        grid-template-columns: var(--headingTemplateColumns);

        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.25rem;
        padding: 0 0.5rem 0.25rem 0.125rem;
        text-align: center;
        border-bottom: 1px solid #ccc;
    }

    .category-heading {
        font-size: $font-size-sm;

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
