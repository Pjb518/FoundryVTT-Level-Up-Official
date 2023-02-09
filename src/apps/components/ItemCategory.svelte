<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import Item from "./Item.svelte";
    import SpellSlots from "./SpellSlots.svelte";

    export let label;
    export let level = 0;
    export let items;
    export let type;

    const actor = getContext("actor");

    $: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
    $: showSpellSlots = $actor.flags?.a5e?.showSpellSlots ?? true;
</script>

<section class="category-container">
    <!-- svelte-ignore missing-declaration -->
    <span class="category-header">
        <h3>
            {localize(CONFIG.A5E[type][label] || label)}
        </h3>

        {#if type === "spellLevels" && showSpellSlots}
            <SpellSlots {level} />
        {/if}

        {#if !sheetIsLocked}
            <i class="fas fa-plus inventory-add-icon a5e-config-button" />
        {/if}
    </span>

    <ul class="items-container">
        {#each [...items] as item}
            <Item {item} />
        {/each}
    </ul>
</section>

<style lang="scss">
    .category-header {
        display: flex;
        align-items: center;
        margin-bottom: 0.25rem;
        padding-bottom: 0.25rem;
        border-bottom: 1px solid #ccc;
        height: 1.5rem;
        gap: 0.5rem;

        h3 {
            font-size: 1rem;
            min-width: 4.5rem;
        }

        .inventory-add-icon {
            padding-inline: 0.25rem;
        }
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
