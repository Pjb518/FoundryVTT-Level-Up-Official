<script>
    import { createEventDispatcher, getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

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
        --background="rgba(0, 0, 0, 0.05)"
        --height="calc(var(--form-field-height) + 1px)"
        --padding="0 3px"
        --item-padding="0.25rem"
        --group-item-padding-left="1rem"
        --border-radius="3px"
        --font-size="0.833rem"
        --font-family="inherit"
        --input-color="black"
        --group-title-font-size="0.833rem"
        --group-title-font-weight="bold"
        --text-overflow="ellipsis"
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
        on:change={({ target }) =>
            dispatch("changePriority", Number(target.value))}
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
