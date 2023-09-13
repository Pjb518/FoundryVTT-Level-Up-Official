<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSIconButton } from "#standard/component";

    import getEffectOptionGroups from "../../handlers/getEffectOptionGroups";

    import ChangeConfiguration from "../effectChanges/ChangeConfiguration.svelte";
    import RadioGroup from "../RadioGroup.svelte";

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
    let changes = $effect.changes;

    console.log(changes);
</script>

<article>
    <section class="changes-list">
        {#each changes as { key, value }, idx (idx)}
            <div class="change-container">
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
                        on:changeKey={({ detail }) =>
                            updateChange(idx, "key", detail)}
                        on:changePriority={({ detail }) =>
                            updateChange(idx, "priority", detail)}
                        on:changeMode={({ detail }) =>
                            updateChange(idx, "mode", detail)}
                    />
                </div>

                <!-- TODO: Add Components Based on value type -->
                <!--  -->
                {#if typeof optionsList[key]?.sampleValue === "boolean"}
                    <div class="change-section">
                        <h3 class="u-text-sm u-text-bold">
                            {localize("A5E.effects.options")}
                        </h3>
                        <RadioGroup
                            allowDeselect={false}
                            options={optionsList[key].options ?? [[null, null]]}
                            selected={changes[idx].value}
                            on:updateSelection={({ detail }) =>
                                updateChange(idx, "value", detail)}
                        />
                    </div>
                {:else}
                    <!-- Show either options or value field -->
                    {#if optionsList[key]?.options?.length}
                        <div class="change-section">
                            <h3 class="u-text-sm u-text-bold">
                                {localize("A5E.effects.options")}
                            </h3>
                            <RadioGroup
                                allowDeselect={false}
                                options={optionsList[key].options ?? [
                                    [null, null],
                                ]}
                                selected={changes[idx].value}
                                on:updateSelection={({ detail }) =>
                                    updateChange(idx, "value", detail)}
                            />
                        </div>
                    {:else if optionsList[key]?.modes?.[0] === "CUSTOM"}
                        <!-- Hide value field if mode is CUSTOM -->
                    {:else}
                        <div class="row">
                            <div class="change-section u-w-full">
                                <h3 class="u-text-sm u-text-bold">
                                    {localize("A5E.effects.value")}
                                </h3>

                                <input
                                    type="text"
                                    name=""
                                    {value}
                                    on:change={({ target }) =>
                                        updateChange(
                                            idx,
                                            "value",
                                            target.value
                                        )}
                                />
                            </div>
                        </div>
                    {/if}
                {/if}
            </div>
        {/each}
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
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.75rem;
        overflow: hidden;
    }

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

    .changes-list {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 0.75rem;

        position: relative;

        padding: 0;
        margin: 0;
        overflow-y: auto;
    }

    .change-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        position: relative;
        width: 100%;
        padding: 0.75rem;
        font-size: $font-size-sm;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
    }

    .change-section {
        display: flex;
        flex-direction: column;
        gap: 0.275rem;
    }

    .row {
        display: flex;
        gap: 0.75rem;
        width: 100%;
    }

    .small-input {
        width: 5rem;
    }

    .sticky-add-button {
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: #999;
    }
</style>
