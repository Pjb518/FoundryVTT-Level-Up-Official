<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import Effect from "./Effect.svelte";

    export let label;
    export let effects;

    function getEffectTemplateConfiguration(sheetIsLocked) {
        let areas = "icon name indicators";
        let columns = "min-content 1fr min-content";

        if ($document.documentName === "Item" || !sheetIsLocked) {
            areas += " menu";
            columns += " 2rem";
        }

        return { areas: `"${areas}"`, columns };
    }

    const document = getContext("actor") ?? getContext("item");

    $: sheetIsLocked = !$document.isOwner
        ? true
        : $document.documentName === "Item"
        ? false
        : $document.flags?.a5e?.sheetIsLocked ?? true;
    $: effectTemplateConfiguration =
        getEffectTemplateConfiguration(sheetIsLocked);
</script>

<section class="category-container">
    <header class="category-header">
        <h3 class="category-heading category-heading--name">
            {localize(label)}
        </h3>
    </header>

    <ul class="effects-container">
        {#each [...effects] as effect (effect.id)}
            <Effect
                {effect}
                --effectTemplateAreas={effectTemplateConfiguration.areas}
                --effectTemplateColumns={effectTemplateConfiguration.columns}
            />
        {/each}
    </ul>
</section>

<style lang="scss">
    .category-header {
        display: flex;

        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.25rem;
        padding: 0 0.5rem 0.25rem 0.125rem;
        border-bottom: 1px solid #ccc;
    }

    .category-heading {
        font-size: 0.833rem;
    }

    .effects-container {
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
