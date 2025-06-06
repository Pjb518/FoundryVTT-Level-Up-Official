<script lang="ts">
    import type ActiveEffectSheet from "#view/sheets/ActiveEffectSheet.svelte";

    import { getContext } from "svelte";

    import EffectChangeConfig from "../../components/effect/EffectChangeConfig.svelte";
    import EffectChangeValue from "../../components/effect/EffectChangeValue.svelte";

    function addChange() {
        const change = {
            key: "",
            mode: null,
            value: "",
            priority: null,
        };

        changes = [...changes, change];

        effect.update({ changes });
    }

    function deleteChange(id) {
        changes = changes.filter((_, idx) => idx !== id);
        effect.update({ changes });
    }

    function updateChange(idx, key, value) {
        changes[idx] ??= {};
        changes[idx][key] = value;

        // Change mode and reset value if key has changed
        if (key === "key") {
            changes[idx]["value"] = "";
            changes[idx]["mode"] =
                MODES[optionsList[changes[idx]?.key]?.modes?.[0]] ?? null;
        }

        // Update Document
        effect.update({ changes });
    }

    let effect: ActiveEffect = getContext("effect");
    let sheet: ActiveEffectSheet = getContext("sheet");

    const MODES = CONFIG.A5E.ACTIVE_EFFECT_MODES;
    const optionsList = sheet.optionsList;

    let changes = $derived(effect.reactive.changes);
</script>

<div class="a5e-sticky-page">
    <section class="a5e-page-wrapper a5e-page-wrapper--scrollable">
        <ul class="a5e-item-list a5e-item-list--effect-changes">
            {#each changes as { key, value, mode }, idx (idx)}
                <li class="a5e-item a5e-item--effect-config">
                    <div class="a5e-button-wrapper">
                        <button
                            class="a5e-button a5e-button--transparent"
                            style="font-size: var(--a5e-md-sm);"
                            aria-label="Delete Change"
                            onclick={() => deleteChange(idx)}
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>

                    <div class="a5e-row">
                        <EffectChangeConfig
                            {idx}
                            {key}
                            {optionsList}
                            onchangeKey={(value) =>
                                updateChange(idx, "key", value)}
                            onchangePriority={(value) =>
                                updateChange(idx, "priority", value)}
                            onchangeMode={(value) =>
                                updateChange(idx, "mode", value)}
                        />
                    </div>

                    <EffectChangeValue
                        {key}
                        {value}
                        {mode}
                        {optionsList}
                        onchange={(value) => updateChange(idx, "value", value)}
                    />
                </li>
            {/each}
        </ul>
    </section>

    <div class="a5e-sticky-add-button">
        <button
            class="a5e-button a5e-button--transparent"
            aria-label="Add Change"
            onclick={addChange}
        >
            <i class="fa-solid fa-plus"></i>
        </button>
    </div>
</div>

<style lang="scss">
    .a5e-button-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        position: absolute;
        top: 1.35rem;
        right: 0.5rem;
        color: var(--a5e-button-gray);
        font-size: var(--a5e-md-text);
    }

    .a5e-row {
        display: grid;
        grid-template-columns: 1fr min-content min-content;
        gap: 0.75rem;
        padding-right: 2rem;
        overflow-y: visible;
    }

    .a5e-sticky-page {
        display: flex;
        flex-direction: column;
        height: 99%;
    }

    .a5e-sticky-add-button {
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: var(--a5e-button-gray);
    }
</style>
