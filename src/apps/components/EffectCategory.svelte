<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import Effect from "./Effect.svelte";

    export let label;
    export let effects;

    function getEffectTemplateConfiguration(sheetIsLocked) {
        let areas = "icon name indicators";
        let columns = "min-content 1fr min-content";

        if ($doc.documentName === "Item" || !sheetIsLocked) {
            areas += " menu";
            columns += " 2rem";
        }

        return { areas: `"${areas}"`, columns };
    }

    const doc = getContext("actor") ?? getContext("item");

    $: sheetIsLocked = !$doc.isOwner
        ? true
        : $doc.documentName === "Item"
          ? false
          : $doc.flags?.a5e?.sheetIsLocked ?? true;
    $: effectTemplateConfiguration =
        getEffectTemplateConfiguration(sheetIsLocked);
</script>

<section>
    <header class="a5e-section-header a5e-section-header--item-list">
        <h3 class="a5e-section-header__heading">
            {localize(label)}
        </h3>
    </header>

    <ul class="a5e-item-list">
        {#each [...effects] as effect (effect.id)}
            <Effect
                {effect}
                --effectTemplateAreas={effectTemplateConfiguration.areas}
                --effectTemplateColumns={effectTemplateConfiguration.columns}
            />
        {/each}
    </ul>
</section>
