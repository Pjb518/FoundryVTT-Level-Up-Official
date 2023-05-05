<script>
    import { getContext } from "svelte";
    import FormSection from "../FormSection.svelte";

    const effect = getContext("effect");
    const sheet = getContext("sheet");

    function addChange() {
        const change = {
            key: "",
            mode: CONST.ACTIVE_EFFECT_MODES.ADD,
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
        $effect.update({
            changes,
        });
    }

    const MODES = Object.fromEntries(
        Object.entries(CONST.ACTIVE_EFFECT_MODES).map(([k, v]) => [
            v,
            k.toLowerCase().capitalize(),
        ])
    );
    const optionsList = sheet.optionsList;

    /** @type {Array<Object>}*/
    $: changes = $effect.changes;
    $: changes, updateChange();

    console.log($effect);
</script>

<section class="changes__container">
    <button on:click={addChange}>+ Add Change</button>

    {#each changes as { key, value }, idx (idx)}
        <FormSection>
            <div class="change__container">
                <div class="row">
                    <div class="change__section u-flex-grow">
                        <h3 class="u-text-sm u-text-bold">Key</h3>
                        <select name="" id="" bind:value={changes[idx].key}>
                            {#each Object.values(optionsList) as { fieldOption, label }}
                                <option value={fieldOption}>
                                    {label}
                                </option>
                            {/each}
                        </select>
                    </div>

                    <div class="change__section">
                        <h3 class="u-text-sm u-text-bold">Priority</h3>
                        <input
                            class="small-input"
                            type="number"
                            name=""
                            bind:value={changes[idx].priority}
                        />
                    </div>

                    <div class="change__section">
                        <h3 class="u-text-sm u-text-bold">Mode</h3>
                        <select name="" id="" bind:value={changes[idx].mode}>
                            {#each optionsList[key]?.modes ?? [] as mode}
                                <option value={mode}>{MODES[mode]}</option>
                            {/each}
                        </select>
                    </div>
                </div>

                <div class="row">
                    <div class="change__section u-w-full">
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
    .change {
        &__container {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
        }

        &__section {
            display: flex;
            flex-direction: column;
            gap: 0.275rem;
        }
    }

    .row {
        display: flex;
        gap: 0.75rem;
        width: 100%;
    }

    .changes {
        &__container {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        &__list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            list-style: none;
            padding: 0;
        }

        &__item {
            position: relative;
            display: flex;
            gap: 0.25rem;
            width: 100%;
        }
    }

    .small-input {
        width: 5rem;
    }
</style>
