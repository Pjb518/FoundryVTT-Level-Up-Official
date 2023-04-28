<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

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

    const modes = CONST.ACTIVE_EFFECT_MODES;

    /** @type {Array<Object>}*/
    $: changes = $effect.changes;
    $: changes, updateChange();

    console.log($effect);
</script>

<section class="changes__container">
    <button on:click={addChange}>+ Add Change</button>

    <ul class="changes__list">
        {#each changes as { value }, idx (idx)}
            <li class="changes__item">
                <select name="" id="" bind:value={changes[idx].key}>
                    <!-- TODO: Add system to this -->
                    {#each sheet.optionsList as option}
                        <option value={option}>
                            {option.startsWith("system")
                                ? option.replace("system.", "")
                                : option}</option
                        >
                    {/each}
                </select>

                <input
                    style="width:30rem;"
                    type="text"
                    name=""
                    {value}
                    on:change={({ target }) =>
                        (changes[idx].value = target.value)}
                />

                <input
                    class="small-input"
                    type="number"
                    name=""
                    bind:value={changes[idx].priority}
                />

                <select name="" id="" bind:value={changes[idx].mode}>
                    {#each Object.keys(modes) as mode}
                        <option value={modes[mode]}>{mode}</option>
                    {/each}
                </select>

                <button
                    class="a5e-button a5e-button--delete"
                    on:click={() => deleteChange(idx)}
                >
                    <i class="fas fa-trash" />
                </button>
            </li>
        {/each}
    </ul>
</section>

<style lang="scss">
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
        width: 20rem;
    }
</style>
