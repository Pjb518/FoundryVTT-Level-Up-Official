<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import getEffectOptionGroups from "../../handlers/getEffectOptionGroups";

    import FormSection from "../FormSection.svelte";

    const effect = getContext("effect");
    const sheet = getContext("sheet");

    function addChange() {
        const change = {
            key: "",
            mode: null,
            value: 0,
            priority: null,
        };

        $effect.update({
            changes: [...$effect.changes, change],
        });
    }

    function deleteChange(id) {
        changes = changes.filter((_, idx) => idx !== id);
    }

    function updateChange() {
        const updated = changes.map((c) => {
            if (c.mode || !optionsList?.[c.key]) return c;

            c.mode = MODES[optionsList[c.key]?.modes?.[0]] ?? null;
            return c;
        });

        $effect.update({
            changes: updated,
        });
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
    $: changes = $effect.changes;
    $: changes, updateChange();

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
                        <select name="" id="" bind:value={changes[idx].key}>
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
                            bind:value={changes[idx].priority}
                        />
                    </div>

                    <!-- Mode - Show if available -->
                    {#if optionsList[key]?.modes?.length > 1}
                        <div class="change-section">
                            <h3 class="u-text-sm u-text-bold">Mode</h3>
                            <select
                                name=""
                                id=""
                                bind:value={changes[idx].mode}
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

                <div class="row">
                    <div class="change-section u-w-full">
                        <h3 class="u-text-sm u-text-bold">
                            Value (Components Go Here)
                        </h3>

                        <input
                            type="text"
                            name=""
                            {value}
                            on:change={({ target }) =>
                                (changes[idx].value = target.value)}
                        />
                    </div>
                </div>
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
