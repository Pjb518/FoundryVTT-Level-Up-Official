<script lang="ts">
    import { localize } from "#utils/localization/localize.ts";

    import Tag from "./Tag.svelte";

    type Props = {
        auxEnabled?: boolean;
        color?: "orange" | "red";
        hint?: string;
        options: Array<[string, string]>;
        selected: [string[], string[]];
        onUpdateSelection?: (newSelections: [string[], string[]]) => void;
    };

    function updateSelection(value, skipDefault = false) {
        let newSelections = selected.map((c) => new Set(c));

        if (newSelections[0].has(value)) {
            newSelections[0].delete(value);
            newSelections[1].add(value);
        } else if (newSelections[1].has(value)) {
            newSelections[1].delete(value);
        } else if (auxEnabled && skipDefault) {
            newSelections[1].add(value);
        } else {
            newSelections[0].add(value);
        }

        newSelections = newSelections.map((c) => [...c]);

        onUpdateSelection?.(newSelections);
    }

    let {
        auxEnabled = true,
        color = "orange",
        hint = "",
        options = [],
        selected = [[], []],
        onUpdateSelection = () => {},
    }: Props = $props();
</script>

<ul class="a5e-multi-state-checkbox-group">
    {#each options as [value, label]}
        <Tag
            active={selected[0].includes(value)}
            orange={selected[1].includes(value) && color === "orange"}
            red={selected[1].includes(value) && color === "red"}
            {label}
            {value}
            --color-hover="black"
            onTagToggle={(detail) => updateSelection(detail)}
            onTagToggleAux={(detail) => updateSelection(detail, true)}
        />
    {/each}
</ul>

{#if hint}
    <p class="a5e-hint">
        {localize(hint)}
    </p>
{/if}

<style lang="scss">
    .a5e-multi-state-checkbox-group {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        list-style: none;
        margin: 0;
        padding: 0;
        font-size: var(--a5e-xs-text);
        width: 100%;
    }

    .a5e-hint {
        margin-top: 0.25rem;
        color: #555;
        font-size: var(--a5e-xs-text);
    }
</style>
