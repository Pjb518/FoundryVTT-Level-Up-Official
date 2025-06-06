<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { getEffectOptionGroups } from "#utils/view/helpers/getEffectOptionGroups.ts";

    import Select from "svelte-select";

    type Props = {
        idx: number;
        key: string;
        optionsList: Record<string, any>;
        clearable?: boolean;
        onchangeMode?: (mode: string) => void;
        onchangeKey?: (key: string) => void;
        onchangePriority?: (priority: number) => void;
    };

    let {
        idx,
        key,
        optionsList,
        clearable = true,
        onchangeKey,
        onchangeMode,
        onchangePriority,
    }: Props = $props();

    let effect: ActiveEffect = getContext("effect");
    let changes = $derived(effect.reactive.changes);

    const effectKeyLocalizations = CONFIG.A5E.effectsKeyLocalizations;
    const MODES = CONFIG.A5E.ACTIVE_EFFECT_MODES;
    const items = getEffectOptionGroups(optionsList);

    const groupBy = (item) => item.group;
</script>

<div class="a5e-effect-change-section">
    <h3 class="a5e-effect-change-section__heading">
        {localize("A5E.effects.key")}
    </h3>

    <Select
        {clearable}
        {items}
        value={effectKeyLocalizations[key]}
        {groupBy}
        on:change={({ detail }) => onchangeKey?.(detail.key)}
        on:clear={() => onchangeKey?.("")}
        --border="1px solid var(--a5e-border-color)"
        --border-focused="1px solid var(--a5e-border-color)"
        --border-hover="1px solid var(--a5e-border-color)"
        --height="calc(var(--a5e-sm-text) + 15px)"
        --padding="0 0.25rem"
        --item-padding="0.25rem"
        --group-item-padding-left="1rem"
        --border-radius="var(--a5e-border-radius-standard)"
        --font-size="var(--a5e-sm-text)"
        --font-family="inherit"
        --input-color="var(--a5e-text-color-dark)"
        --group-title-font-size="var(--a5e-sm-text)"
        --group-title-font-weight="bold"
        --text-overflow="ellipsis"
        --list-background="var(--a5e-svelte-select-list-background)"
        --group-title="var(--a5e-svelte-select-list-group-title-color)"
        --item-color="var(--a5e-svelte-select-list-item-color)"
        --item--active-background="var(--a5e-svelte-select-list-item-active-background-color)"
        --item-active-color="var(--a5e-svelte-select-list-item-active-color)"
        --item-hover-bg="var(--a5e-svelte-select-list-item-hover-background)"
        --item-hover-color="var(--a5e-svelte-select-list-item-hover-color)"
    />
</div>

<!-- Priority -->
<div class="a5e-effect-change-section">
    <h3 class="a5e-effect-change-section__heading">
        {localize("A5E.effects.priority")}
    </h3>

    <input
        class="a5e-input a5e-input--slim a5e-input--small"
        type="number"
        name=""
        value={changes[idx]?.priority ?? 0}
        onchange={({ currentTarget }) =>
            onchangePriority?.(Number(currentTarget.value))}
    />
</div>

<!-- Mode - Show only if available -->
{#if optionsList[key]?.modes?.length > 1}
    <div class="a5e-effect-change-section">
        <h3 class="a5e-effect-change-section__heading">
            {localize("A5E.effects.mode")}
        </h3>

        <select
            class="a5e-input a5e-input--slim a5e-input--fit"
            id=""
            value={changes[idx]?.mode}
            onchange={({ currentTarget }) =>
                onchangeMode?.(currentTarget.value)}
        >
            {#each optionsList[key]?.modes ?? [] as label}
                <option value={MODES[label]}>
                    {label.toLowerCase().capitalize()}
                </option>
            {/each}
        </select>
    </div>
{/if}

<style lang="scss">
    .a5e-effect-change-section {
        display: flex;
        flex-direction: column;
        gap: 0.275rem;

        &__heading {
            margin: 0;
            font-size: var(--a5e-sm-text);
            font-weight: bold;
        }
    }
</style>
