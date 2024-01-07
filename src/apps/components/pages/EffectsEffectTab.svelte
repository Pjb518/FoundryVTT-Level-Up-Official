<script>
    import { getContext } from "svelte";
    import { TJSIconButton } from "#standard/component";

    import ChangeConfiguration from "../effectChanges/ChangeConfiguration.svelte";
    import ChangeValue from "../effectChanges/ChangeValue.svelte";

    const effect = getContext("effect");
    const sheet = getContext("sheet");

    function addChange() {
        const change = {
            key: "",
            mode: null,
            value: "",
            priority: null,
        };

        changes = [...changes, change];

        $effect.update({ changes });
    }

    function deleteChange(id) {
        changes = changes.filter((_, idx) => idx !== id);
        $effect.update({ changes });
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
        $effect.update({ changes });
    }

    const MODES = CONFIG.A5E.ACTIVE_EFFECT_MODES;
    const optionsList = sheet.optionsList;

    /** @type {Array<Object>}*/
    $: changes = $effect.changes;
</script>

<section class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <ul class="a5e-item-list">
        {#each changes as { key, value, mode }, idx (idx)}
            <li class="a5e-item a5e-item--effect-config">
                <div class="button-wrapper">
                    <button
                        class="a5e-button a5e-button--delete fas fa-trash"
                        style="font-size: $font-size-md;"
                        on:click={() => deleteChange(idx)}
                    />
                </div>

                <div class="row" style="padding-right: 2rem;">
                    <ChangeConfiguration
                        {idx}
                        {key}
                        {optionsList}
                        on:changeKey={({ detail }) =>
                            updateChange(idx, "key", detail)}
                        on:changePriority={({ detail }) =>
                            updateChange(idx, "priority", detail)}
                        on:changeMode={({ detail }) =>
                            updateChange(idx, "mode", detail)}
                    />
                </div>

                <ChangeValue
                    {key}
                    {value}
                    {mode}
                    {optionsList}
                    on:change={({ detail }) =>
                        updateChange(idx, "value", detail)}
                />
            </li>
        {/each}
    </ul>
</section>

<div class="sticky-add-button">
    <TJSIconButton
        title="Add Change"
        icon="fas fa-plus"
        onPress={() => addChange()}
        --tjs-icon-button-background-hover="none"
        --tjs-icon-button-background-focus="none"
        --tjs-icon-button-background-focus-visible="none"
        --tjs-icon-button-background-selected="none"
        --tjs-icon-button-text-shadow-hover="none"
        --tjs-icon-button-text-shadow-focus="none"
        --tjs-icon-button-transition="$standard-transition"
        --tjs-icon-button-diameter="1rem"
        --tjs-icon-button-border-radius="0"
    />
</div>

<style lang="scss">
    .button-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        color: #999;
        font-size: $font-size-md;
    }

    .row {
        display: flex;
        gap: 0.75rem;
        width: 100%;
    }

    .sticky-add-button {
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: #999;
    }
</style>
