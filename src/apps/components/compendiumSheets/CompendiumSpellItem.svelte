<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import ImportButton from "../ImportButton.svelte";

    export let document;

    function getSpellDetailsLabel(spell) {
        const { level, schools } = spell.system;
        const spellLevel = spellLevels[level] ?? "";

        const primarySchool =
            spellSchools.primary[schools.primary] ?? schools.primary;

        const secondarySchools = schools.secondary.map(
            (school) => spellSchools.secondary[school] ?? school,
        );

        secondarySchools.sort((a, b) => a.localeCompare(b));

        const spellSchoolsLabel = [primarySchool, ...secondarySchools].join(
            ", ",
        );

        if (spellSchoolsLabel) return `${spellLevel} (${spellSchoolsLabel})`;
        return spellLevel;
    }

    function getSpellSource(spell) {
        if (typeof spell.system.source !== "string") return null;

        const source = CONFIG.A5E.products[spell.system.source];

        return source || null;
    }

    function onDragStart(event) {
        const data = {
            type: collection.documentName,
            uuid: collection.getUuid(document._id),
        };
        return event.dataTransfer.setData("text/plain", JSON.stringify(data));
    }

    const collection = getContext("collection");
    const { spellSchools, spellLevels } = CONFIG.A5E;

    $: spellDetails = getSpellDetailsLabel(document);
    $: spellSource = getSpellSource(document);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<li
    class="a5e-item a5e-item--compendium-spell-document"
    draggable="true"
    on:click={async () => {
        const doc =
            collection.get(document._id) ??
            (await collection.getDocument(document._id));
        doc.sheet?.render(true);
    }}
    on:dragstart={onDragStart}
>
    <img
        class="a5e-item__image a5e-item__image--compendium-document"
        src={document.img}
        alt={document.name}
    />

    <span class="a5e-item__name--compendium-document">
        {document.name}

        {#if document.system.rare}
            <i
                class="a5e-item__icon fa-solid fa-sun"
                data-tooltip="Rare Spell Variant"
                data-tooltip-direction="UP"
            />
        {/if}
    </span>

    <span class="a5e-item__details">
        {#if spellSource?.abbreviation}
            <a
                class="a5e-item__source-tag"
                href={spellSource?.url}
                target="_blank"
                data-tooltip={spellSource.affiliate
                    ? `${spellSource?.title} (Affiliate Link)`
                    : spellSource?.title}
                on:click|stopPropagation
            >
                {spellSource?.abbreviation}
            </a>
        {/if}

        {spellDetails}
    </span>

    <ul class="component-wrapper">
        {#if document.system.components.vocalized}
            <span
                class="component"
                data-tooltip="A5E.SpellComponentVocalized"
                data-tooltip-direction="UP"
            >
                {localize("A5E.SpellComponentVocalizedAbbr")}
            </span>
        {/if}

        {#if document.system.components.seen}
            <span
                class="component"
                data-tooltip="A5E.SpellComponentSeen"
                data-tooltip-direction="UP"
            >
                {localize("A5E.SpellComponentSeenAbbr")}
            </span>
        {/if}

        {#if document.system.components.material}
            <span
                class="component"
                data-tooltip="A5E.SpellComponentMaterial"
                data-tooltip-direction="UP"
            >
                {localize("A5E.SpellComponentMaterialAbbr")}
            </span>
        {/if}

        {#if document.system.concentration}
            <span
                class="component"
                data-tooltip="A5E.SpellConcentration"
                data-tooltip-direction="UP"
            >
                {localize("A5E.SpellConcentrationAbbr")}
            </span>
        {/if}

        {#if document.system.ritual}
            <span
                class="component"
                data-tooltip="A5E.SpellRitual"
                data-tooltip-direction="UP"
            >
                {localize("A5E.SpellRitualAbbr")}
            </span>
        {/if}
    </ul>

    <ImportButton {document} />
</li>

<style lang="scss">
    .component {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1rem;
        width: 1rem;
        border-radius: 3px;
        font-size: var(--a5e-text-size-xxs);
        background: #c6c5bc;
    }

    .component-wrapper {
        display: flex;
        justify-content: flex-end;
        gap: 0.25rem;
        grid-area: components;
        margin: 0 0.25rem;
        padding: 0;
        font-family: var(--a5e-font-sans-serif);
        list-style: none;
    }
</style>
