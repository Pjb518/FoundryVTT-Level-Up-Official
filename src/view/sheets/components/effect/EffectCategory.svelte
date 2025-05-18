<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import EffectList from "./EffectList.svelte";

    type Props = {
        label: string;
        effects: ActiveEffect[];
    };

    function getEffectTemplateConfiguration() {
        let areas = "icon name indicators";
        let columns = "min-content 1fr min-content";

        if (doc.documentName === "Item" || !sheetIsLocked()) {
            areas += " menu";
            columns += " 2rem";
        }

        return { areas: `"${areas}"`, columns };
    }

    let { label, effects }: Props = $props();

    let doc: any = getContext("item") ?? getContext("actor");
    let sheetIsLocked: () => boolean =
        getContext("sheetIsLocked") ??
        (() => {
            return false;
        });

    let effectTemplateConfiguration = $derived(
        getEffectTemplateConfiguration(),
    );
</script>

<section>
    <header
        class="a5e-section-header a5e-section-header--item-list"
        class:a5e-section-header--flat-bottom={[...effects].length}
    >
        <h3 class="a5e-section-header__heading">
            {localize(label)}
        </h3>
    </header>

    <ul class="a5e-item-list">
        {#each [...effects] as effect (effect.id)}
            <EffectList
                {effect}
                --effectTemplateAreas={effectTemplateConfiguration.areas}
                --effectTemplateColumns={effectTemplateConfiguration.columns}
            />
        {/each}
    </ul>
</section>
