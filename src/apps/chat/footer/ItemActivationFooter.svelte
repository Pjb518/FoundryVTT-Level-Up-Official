<script>
    import { localize } from "#runtime/svelte/helper";

    function getSpellComponents(item) {
        if (!item?.system?.components) return [];

        const { spellComponents, spellComponentAbbreviations } = CONFIG.A5E;

        const components = Object.entries(item.system.components)
            .filter(([, hasComponent]) => hasComponent)
            .map(([component]) => ({
                label: spellComponentAbbreviations[component] ?? component,
                tooltip: spellComponents[component] ?? component,
            }));

        if (item.system.concentration) {
            components.push({
                label: localize("A5E.SpellConcentrationAbbr"),
                tooltip: localize("A5E.SpellConcentration"),
            });
        }

        if (item.system.ritual) {
            components.push({
                label: localize("A5E.SpellRitualAbbr"),
                tooltip: localize("A5E.SpellRitual"),
            });
        }

        return components;
    }

    export let message;

    const item = fromUuidSync($message?.flags?.a5e?.itemId ?? "");
    const spellComponents = getSpellComponents(item);
    const spellLevel = CONFIG.A5E.spellLevels[item?.system?.level];

    const castingLevel =
        CONFIG.A5E.spellLevels[$message?.flags?.a5e?.castingLevel ?? ""];
</script>

{#if item?.type === "spell"}
    <hr class="a5e-rule a5e-rule--card" style="margin-block: 0.5rem;" />

    <footer class="card-footer">
        <span class="spell-level">
            {spellLevel}

            {#if castingLevel && spellLevel !== castingLevel}
                (Cast at {castingLevel})
            {/if}
        </span>

        {#if spellComponents.length}
            <ul class="component-wrapper">
                {#each spellComponents as component}
                    <li
                        class="component"
                        data-tooltip={component.tooltip}
                        data-tooltip-direction="UP"
                    >
                        {component.label}
                    </li>
                {/each}
            </ul>
        {/if}
    </footer>
{/if}

<style lang="scss">
    .card-footer {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .component-wrapper {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 0.25rem;
    }

    .component {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1rem;
        width: 1rem;
        border-radius: $border-radius-standard;
        font-size: 0.579rem;
        background: var(--indicator-background, #c6c5bc);
    }

    .spell-level {
        font-size: 0.694rem;
    }
</style>
