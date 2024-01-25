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
    export let showDescription = false;
    export let showUses = false;
    export let showQuantity = false;

    const actor = getContext("actor");

    const A5E = CONFIG.A5E;

    function getHeadingTemplateConfiguration(showUses, showQuantity) {
        let areas = "name";
        let columns = "1fr";

        if (showUses) {
            if (showQuantity) {
                areas = "name quantity uses";
                columns = "1fr 4rem 6.25rem";
            } else {
                areas = "name uses";
                columns = "1fr 6.25rem";
            }
        } else if (showQuantity) {
            areas = "name quantity";
            columns = "1fr 4rem";
        }

        areas += ` menu`;
        columns += ` 2rem`;

        return { areas: `"${areas}"`, columns };
    }

    function getItemTemplateConfiguration(showUses, showQuantity) {
        let areas = "icon name indicators";
        let columns = "min-content 1fr min-content";

        if (showUses) {
            if (showQuantity) {
                areas = "icon name indicators quantity uses";
                columns = "min-content 1fr min-content 4rem 6.25rem";
            } else {
                areas = "icon name indicators uses";
                columns = "min-content 1fr min-content 6.25rem";
            }
        } else if (showQuantity) {
            areas = "icon name indicators quantity";
            columns = "min-content 1fr min-content 4rem";
        }

        areas += ` menu`;
        columns += ` 2rem`;

        return { areas: `"${areas}"`, columns };
    }

    $: showSpellSlots = $actor.flags?.a5e?.showSpellSlots ?? true;
    $: showSpellPoints = $actor.flags?.a5e?.showSpellPoints ?? false;

    $: headingTemplateConfiguration = getHeadingTemplateConfiguration(
        showUses,
        showQuantity,
    );

    $: itemTemplateConfiguration = getItemTemplateConfiguration(
        showUses,
        showQuantity,
    );
</script>

<section class="category-container">
    <!-- svelte-ignore missing-declaration -->
    {#if !(type === "featureTypes" && $actor.type === "npc")}
        <header
            class="a5e-section-header a5e-section-header--item-list"
            class:a5e-section-header--flat-bottom={[...items].length}
            style="
                --a5e-section-heading-template-areas: {headingTemplateConfiguration.areas};
                --a5e-section-heading-template-columns: {headingTemplateConfiguration.columns};
            "
        >
            <h3
                class="a5e-section-header__heading a5e-section-header__heading--name"
            >
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

                {#if type === "spellLevels" && showSpellSlots}
                    <SpellSlots {level} />
                {/if}

                {#if type === "spellLevels" && showSpellPoints}
                    {localize("A5E.SpellPointsCost", {
                        cost: A5E.spellLevelCost[level],
                    })}
                {/if}
            </h3>

            {#if showQuantity}
                <h3
                    class="a5e-section-header__heading a5e-section-header__heading--center a5e-section-header__heading--quantity"
                >
                    Quantity
                </h3>
            {/if}

            {#if showUses}
                <h3
                    class="a5e-section-header__heading a5e-section-header__heading--center a5e-section-header__heading--uses"
                >
                    Uses
                </h3>
            {/if}
        </header>
    {/if}

    <ul class="a5e-item-list">
        {#each [...items] as item (item.id)}
            <Item
                {item}
                {showDescription}
                --itemTemplateAreas={itemTemplateConfiguration.areas}
                --itemTemplateColumns={itemTemplateConfiguration.columns}
            />
        {/each}
    </ul>
</section>

<style lang="scss">
    .a5e-section-header__heading {
        &--name {
            display: grid;
            align-items: center;
            grid-template-columns: minmax(3.5rem, max-content) max-content max-content;
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
</style>
