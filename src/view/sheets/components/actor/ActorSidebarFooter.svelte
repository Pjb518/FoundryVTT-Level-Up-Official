<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    let actor: any = getContext("actor");
    let actorStore = $derived(actor.reactive.system);

    type FooterField = {
        label: string;
        value: number;
        tooltip?: string;
        config?: boolean;
    };

    let footerFields: FooterField[] = $derived([
        {
            label: "A5E.maneuvers.dc",
            value: actorStore.attributes.maneuverDC,
        },
        {
            label: "A5E.spells.dc",
            value: actorStore.attributes.spellDC,
            tooltip: actor.reactive.spellBooks.getSpellDCString(true),
        },
        {
            label: "Passive Percep.",
            value: actorStore.skills.prc.passive,
        },
    ]);
</script>

{#each footerFields as { label, value, tooltip }}
    <div class="a5e-details-box a5e-actor-footer__shield">
        <label for="" class="a5e-details-box__label">
            {localize(label)}
        </label>

        <input
            class="a5e-input a5e-input--slim a5e-details-box__input"
            data-tooltip={tooltip ?? ""}
            data-tooltip-direction="UP"
            type="number"
            {value}
            disabled={true}
        />
    </div>
{/each}

<style lang="scss">
    .a5e-actor-footer__shield {
        display: flex;
        justify-content: space-between;
    }

    .a5e-details-box__label {
        display: flex;
        height: 100%;
        align-items: center;
    }
</style>
