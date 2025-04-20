<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    let actor = getContext("actor");
    let actorStore = $derived(actor.reactive);

    type FooterField = {
        label: string;
        value: number;
        tooltip?: string;
        config?: boolean;
    };

    let footerFields = $derived([
        {
            label: "A5E.ManeuverDC",
            value: actorStore.system.attributes.maneuverDC,
        },
        {
            label: "A5E.SpellDC",
            value: actorStore.system.attributes.spellDC,
            tooltip: actorStore.spellBooks.getSpellDCString(true),
        },
        {
            label: "Passive Percep.",
            value: actorStore.system.skills.prc.passive,
        },
    ]);
</script>

{#each footerFields as { label, value, tooltip }}
    <div class="a5e-actor-sidebar__footer-field">
        <h3 class="a5e-actor-sidebar__footer-field__label">
            {localize(label)}
        </h3>

        <div class="a5e-actor-sidebar__footer-field__value">
            {value}
        </div>
    </div>
{/each}

<style lang="scss">
    .a5e-actor-sidebar__footer-field {
        display: grid;
        flex-direction: column;
        gap: 0.25rem;
        border: 1px solid red;
        justify-content: center;
        align-items: center;

        &__label {
            font-size: var(--a5e-md-text);
            font-family: var(--a5e-condensed-font);
            font-weight: normal;
            margin: 0;
            text-align: center;
        }

        &__value {
            font-size: var(--a5e-sm-text);
            text-align: center;
        }
    }
</style>
