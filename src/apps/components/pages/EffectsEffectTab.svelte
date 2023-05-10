<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import getEffectOptionGroups from "../../handlers/getEffectOptionGroups";

    import FormSection from "../FormSection.svelte";
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

        $effect.update({
            changes: [...$effect.changes, change],
        });
    }

    function deleteChange(id) {
        changes = changes.filter((_, idx) => idx !== id);
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

    const MODES = CONST.ACTIVE_EFFECT_MODES;
    const optionsList = sheet.optionsList;
    const optionGroups = getEffectOptionGroups(sheet.optionsList);

    const groupLabels = Object.entries(CONFIG.A5E.effectKeyGroups).reduce(
        (acc, [group, { label }]) => {
            acc[group] = localize(label);
            return acc;
        },
        {}
    );

    /** @type {Array<Object>}*/
    let changes = $effect.changes;

    // Dynamic Data for each change
    console.log($effect);
</script>

<section class="changes-list">
    <button on:click={addChange}>+ Add Change</button>

    {#each changes as { key, value }, idx (idx)}
        <FormSection>
            <button
                class="a5e-button a5e-button--delete fas fa-trash"
                on:click={() => deleteChange(idx)}
            />

            <div class="change-container">
                <div class="row">
                    <!-- Key Section -->
                    <div class="change-section u-flex-grow">
                        <h3 class="u-text-sm u-text-bold">Key</h3>
                        <select
                            name=""
                            id=""
                            value={changes[idx].key}
                            on:change={({ target }) =>
                                updateChange(idx, "key", target.value)}
                        >
                            {#each optionGroups as [groupLabel, items]}
                                <optgroup
                                    label={groupLabels[groupLabel] ??
                                        groupLabel}
                                >
                                    {#each items as { fieldOption, label }}
                                        <option value={fieldOption}>
                                            {label}
                                        </option>
                                    {/each}
                                </optgroup>
                            {/each}
                        </select>
                    </div>

                    <!-- Priority -->
                    <div class="change-section">
                        <h3 class="u-text-sm u-text-bold">Priority</h3>
                        <input
                            class="small-input"
                            type="number"
                            name=""
                            value={changes[idx].priority}
                            on:change={({ target }) =>
                                updateChange(idx, "priority", target.value)}
                        />
                    </div>

                    <!-- Mode - Show if available -->
                    {#if optionsList[key]?.modes?.length > 1}
                        <div class="change-section">
                            <h3 class="u-text-sm u-text-bold">Mode</h3>
                            <select
                                name=""
                                id=""
                                value={changes[idx].mode}
                                on:change={({ target }) =>
                                    updateChange(idx, "mode", target.value)}
                            >
                                {#each optionsList[key]?.modes ?? [] as label}
                                    <option value={MODES[label]}>
                                        {label.toLowerCase().capitalize()}
                                    </option>
                                {/each}
                            </select>
                        </div>
                    {/if}
                </div>

                <!-- Components Based on value type -->
                <!--  -->
                {#if typeof optionsList[key]?.sampleValue === "boolean"}
                    <RadioGroup
                        options={optionsList[key].options ?? [[null, null]]}
                        selected={changes[idx].value}
                        on:updateSelection={({ detail }) =>
                            updateChange(idx, "value", detail)}
                    />
                {:else}
                    <div class="row">
                        <div class="change-section u-w-full">
                            <h3 class="u-text-sm u-text-bold">
                                Value (Components Go Here)
                            </h3>

                            <!-- Hide  -->

                            <input
                                type="text"
                                name=""
                                {value}
                                on:change={({ target }) =>
                                    updateChange(idx, "value", target.value)}
                            />
                        </div>
                    </div>
                {/if}
            </div>
        </FormSection>
    {/each}
</section>

<style lang="scss">
    .change-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
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

    .changes-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .small-input {
        width: 5rem;
    }
</style>
