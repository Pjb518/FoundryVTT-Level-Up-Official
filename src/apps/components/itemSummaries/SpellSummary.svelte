<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let item;

    const action = item.actions.values()[0];

    const ranges = Object.values(action?.ranges ?? {}).map(
        ({ range, unit }) => {
            if (["short", "medium", "long"].includes(range)) {
                return `${localize(CONFIG.A5E.rangeDescriptors[range])} (${
                    CONFIG.A5E.rangeValues[range]
                } ft.)`;
            }

            if (["fiveFeet", "self", "touch"].includes(range)) {
                return localize(CONFIG.A5E.rangeDescriptors[range]);
            }

            return `${range} ${localize(CONFIG.A5E.distanceUnits[unit])}`;
        }
    );

    const spellComponents = Object.entries(item.system.components).reduce(
        (acc, [component, hasComponent]) => {
            if (hasComponent)
                acc.push(
                    localize(CONFIG.A5E.spellComponentAbbreviations[component])
                );

            return acc;
        },
        []
    );

    const spellSchools = [
        item.system.schools.primary,
        ...item.system.schools.secondary,
    ].filter(Boolean);
</script>

<p class="spell-level">
    {localize(`A5E.SpellLevel${item.system.level}` ?? "")}

    {#if spellSchools.length}
        ({spellSchools.join(", ")})
    {/if}
</p>

<dl class="summary-list">
    {#if item.actions.count === 1 && ranges.length}
        <div class="summary-group">
            <dt>{localize("A5E.ItemRange")}:</dt>
            <dd>
                {ranges.join(", ")}
            </dd>
        </div>
    {/if}

    {#if spellComponents.length}
        <div class="summary-group">
            <dt>{localize("A5E.SpellComponents")}:</dt>
            <dd>
                {spellComponents.join(", ")}

                {#if item.system.components.material}
                    ({item.system.materials})
                {/if}
            </dd>
        </div>
    {/if}
</dl>

<style lang="scss">
    dd {
        margin: 0;
        padding: 0;
    }

    .spell-level {
        font-style: italic;
    }

    .summary-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin: 0.5rem 0;
    }

    .summary-group {
        display: flex;
        align-items: flex-start;
        gap: 0.25rem;
    }
</style>
