<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    export let { application } = getContext("#external");
    export let { itemDocument } = getContext("#external").application;

    const item = new TJSDocument(itemDocument);

    let selectedAbilityScores = [
        $item.system.includesASI ? $item.system.defaultASI : null,
    ].filter(Boolean);

    let selectedEquipment = [];

    function submitForm() {
        application.submit({
            selectedAbilityScores,
            selectedEquipment,
        });
    }
</script>

<form>
    {#if $item.system.includesASI}
        <section class="ability-score-wrapper">
            <h3>Select Ability Score Increases</h3>

            <div style="display: flex; gap: 0.5rem">
                {#each ["str", "dex", "con", "int", "wis", "cha"] as ability}
                    <input
                        class="ability-score-input"
                        type="checkbox"
                        name="ASI"
                        id="{$item.id}-ASI-{ability}"
                        value={ability}
                        bind:group={selectedAbilityScores}
                        disabled={selectedAbilityScores.length === 2 &&
                            !selectedAbilityScores.includes(ability)}
                    />

                    <label
                        class="ability-score-label"
                        for="{$item.id}-ASI-{ability}"
                    >
                        <!-- svelte-ignore missing-declaration (CONFIG) -->
                        {localize(CONFIG.A5E.abilities[ability])}
                    </label>
                {/each}
            </div>

            <p class="hint">
                Select two ability scores to increase. The default ability score
                for this background has been selected by automatically if
                configured.
            </p>
        </section>
    {/if}

    {#if $item.system.equipment.length}
        <section class="ability-score-wrapper">
            <h3>Select Starting Equipment</h3>

            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
                <!-- svelte-ignore missing-declaration (fromUuid) -->
                {#each $item.system?.equipment.map( (uuid) => fromUuid(uuid) ) as promise}
                    {#await promise then equipment}
                        <input
                            class="ability-score-input"
                            type="checkbox"
                            name="ASI"
                            id="{$item.id}-equipment-{equipment.uuid}"
                            value={equipment.uuid}
                            bind:group={selectedEquipment}
                        />

                        <label
                            class="ability-score-label"
                            for="{$item.id}-equipment-{equipment.uuid}"
                        >
                            {equipment.name}
                        </label>
                    {/await}
                {/each}
            </div>
        </section>
    {/if}

    <div class="button-container">
        <button on:click|preventDefault={submitForm}>Submit</button>
    </div>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 1rem;
        overflow: auto;
    }

    .ability-score {
        &-input {
            display: none;

            &:checked + .ability-score-label {
                background: #2b6537;
                border-color: darken($color: #2b6537, $amount: 5);
                color: #f6f2eb;
            }

            &:disabled + .ability-score-label {
                color: #999;
            }
        }

        &-label {
            border-radius: 3px;
            border: 1px solid #bbb;
            font-size: 1rem;
            padding: 0.25rem 0.5rem;
            cursor: pointer;
            transition: all 0.15s ease-in-out;
        }

        &-wrapper {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            font-family: "Modesto Condensed", serif;
            font-size: 1rem;
        }
    }

    .button-container {
        display: flex;
    }

    .hint {
        font-family: "Signika", sans-serif;
        font-size: 0.694rem;
    }
</style>
