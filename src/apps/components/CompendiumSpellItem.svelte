<script>
    import { localize } from "#runtime/svelte/helper";

    export let document;
</script>

<li class="spell" on:dblclick={() => $document.sheet?.render(true)}>
    <img class="spell__image" src={$document.img} alt={$document.name} />

    <span class="spell__name">
        {$document.name}
    </span>

    <ul class="component-wrapper">
        {#if $document.system.components.vocalized}
            <span
                class="component"
                data-tooltip="A5E.SpellComponentVocalized"
                data-tooltip-direction="UP"
            >
                {localize("A5E.SpellComponentVocalizedAbbr")}
            </span>
        {/if}

        {#if $document.system.components.seen}
            <span
                class="component"
                data-tooltip="A5E.SpellComponentSeen"
                data-tooltip-direction="UP"
            >
                {localize("A5E.SpellComponentSeenAbbr")}
            </span>
        {/if}

        {#if $document.system.components.material}
            <span
                class="component"
                data-tooltip="A5E.SpellComponentMaterial"
                data-tooltip-direction="UP"
            >
                {localize("A5E.SpellComponentMaterialAbbr")}
            </span>
        {/if}

        {#if $document.system.concentration}
            <span
                class="component"
                data-tooltip="A5E.SpellConcentration"
                data-tooltip-direction="UP"
            >
                {localize("A5E.SpellConcentrationAbbr")}
            </span>
        {/if}

        {#if $document.system.ritual}
            <span
                class="component"
                data-tooltip="A5E.SpellRitual"
                data-tooltip-direction="UP"
            >
                {localize("A5E.SpellRitualAbbr")}
            </span>
        {/if}
    </ul>
</li>

<style lang="scss">
    .component {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1rem;
        width: 1rem;
        border-radius: $border-radius-standard;
        font-size: $font-size-xxs;
        background: #c6c5bc;
    }

    .component-wrapper {
        display: flex;
        gap: 0.25rem;
        justify-content: flex-end;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .spell {
        display: grid;
        grid-template-areas: "img name components";
        grid-template-columns: 1.5rem 1fr min-content;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.125rem;
        padding-right: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 3px;
        background: var(--item-background, rgba(0, 0, 0, 0.05));
        cursor: pointer;

        &__image {
            width: 1.5rem;
            height: 1.5rem;
            grid-area: img;
        }

        &__name {
            grid-area: name;
        }
    }
</style>
