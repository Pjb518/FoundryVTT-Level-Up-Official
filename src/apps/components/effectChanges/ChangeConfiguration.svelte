<script>
    import { createEventDispatcher, getContext } from "svelte";
    import { localize } from "#runtime/util/i18n";

    import getEffectOptionGroups from "../../handlers/getEffectOptionGroups";

    import Select from "svelte-select";

    export let idx;
    export let key;
    export let optionsList;
    export let clearable = true;

    const dispatch = createEventDispatcher();
    const effect = getContext("effect");

    const effectKeyLocalizations = CONFIG.A5E.effectsKeyLocalizations;
    const MODES = CONFIG.A5E.ACTIVE_EFFECT_MODES;
    const items = getEffectOptionGroups(optionsList);

    const groupBy = (item) => item.group;
</script>

<div class="change-section u-flex-grow">
    <h3 class="u-text-sm u-text-bold">
        {localize("A5E.effects.key")}
    </h3>

    <Select
        {clearable}
        {items}
        value={effectKeyLocalizations[key]}
        {groupBy}
        on:change={({ detail }) => dispatch("changeKey", detail.key)}
        on:clear={() => dispatch("changeKey", "")}
        --border="1px solid var(--a5e-border-color)"
        --border-focused="1px solid var(--a5e-border-color)"
        --border-hover="1px solid var(--a5e-border-color)"
        --height="calc(var(--form-field-height) + 1px)"
        --padding="0 3px"
        --item-padding="0.25rem"
        --group-item-padding-left="1rem"
        --border-radius="var(--a5e-border-radius-standard)"
        --font-size="var(--a5e-text-size-sm)"
        --font-family="inherit"
        --input-color="var(--a5e-text-color-dark)"
        --group-title-font-size="var(--a5e-text-size-sm)"
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
<div class="change-section">
    <h3 class="u-text-sm u-text-bold">
        {localize("A5E.effects.priority")}
    </h3>

    <input
        class="small-input"
        type="number"
        name=""
        value={$effect.changes[idx]?.priority ?? 0}
        on:change={({ target }) => dispatch("changePriority", Number(target.value))}
    />
</div>

<!-- Mode - Show only if available -->
{#if optionsList[key]?.modes?.length > 1}
    <div class="change-section">
        <h3 class="u-text-sm u-text-bold">
            {localize("A5E.effects.mode")}
        </h3>

        <select
            id=""
            value={$effect.changes[idx]?.mode}
            on:change={({ target }) => dispatch("changeMode", target.value)}
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
    .change-section {
        display: flex;
        flex-direction: column;
        gap: 0.275rem;
    }
</style>
