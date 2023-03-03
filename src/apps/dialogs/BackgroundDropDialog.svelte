<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    export let { application } = getContext("#external");
    export let { itemDocument } = getContext("#external").application;

    const item = new TJSDocument(itemDocument);

    const A5E = CONFIG.A5E;
    const equipmentLength = Object.entries($item.system.equipment).length;

    let selectedAbilityScores = [
        $item.system.includesASI ? $item.system.defaultASI : null,
    ].filter(Boolean);

    let selectedEquipment = [];
    let selectedLanguages = [];
    let selectedSkills = [];
    let selectedTools = [];

    function updateCustomLanguages(values) {
        selectedLanguages = [
            ...selectedLanguages.filter((option) =>
                Object.keys(A5E.languages).includes(option)
            ),
            ...values
                .split(";")
                .map((option) => option.trim())
                .filter(Boolean),
        ];
    }

    function submitForm() {
        application.submit({
            selectedAbilityScores,
            selectedEquipment,
            selectedLanguages,
            selectedSkills,
            selectedTools,
        });
    }

    $: languages = $item.system.proficiencies.languages;
    $: customLanguages = selectedLanguages
        .filter((option) => !Object.keys(A5E.languages).includes(option))
        .join("; ");
    $: skills = $item.system.proficiencies.skills;
    $: tools = $item.system.proficiencies.tools;
</script>

<form>
    {#if $item.system.includesASI}
        <section class="ability-score-wrapper">
            <h3>
                {localize("A5E.BackgroundDropAbilitySelect")}
            </h3>

            <div class="u-flex u-flex-wrap u-gap-md">
                {#each ["str", "dex", "con", "int", "wis", "cha"] as ability}
                    <input
                        class="ability-score-input"
                        type="checkbox"
                        name="ASI"
                        id={`${$item.id}-ASI-${ability}`}
                        value={ability}
                        bind:group={selectedAbilityScores}
                        disabled={selectedAbilityScores.length === 2 &&
                            !selectedAbilityScores.includes(ability)}
                    />

                    <label
                        class="ability-score-label"
                        for={`${$item.id}-ASI-${ability}`}
                    >
                        <!-- svelte-ignore missing-declaration (CONFIG) -->
                        {localize(A5E.abilities[ability])}
                    </label>
                {/each}
            </div>

            <p class="hint">
                {localize("A5E.BackgroundDropAbilitySelectHint")}
            </p>
        </section>
    {/if}

    {#if languages.count}
        {selectedLanguages}
        <section class="ability-score-wrapper">
            <h3>
                {localize("A5E.BackgroundDropLanguageSelect")}
            </h3>

            <div class="u-flex u-flex-wrap u-gap-md">
                {#each Object.entries(A5E.languages) as [language, label]}
                    <input
                        class="ability-score-input"
                        type="checkbox"
                        id={`${$item.id}-languages-${language}`}
                        value={language}
                        disabled={selectedLanguages.length >= languages.count &&
                            !selectedLanguages.includes(language)}
                        bind:group={selectedLanguages}
                    />

                    <label
                        class="ability-score-label"
                        for={`${$item.id}-languages-${language}`}
                    >
                        {localize(label)}
                    </label>
                {/each}

                <input
                    class="a5e-input"
                    type="text"
                    value={customLanguages}
                    disabled={selectedLanguages.length >= languages.count &&
                        !customLanguages.length > 2}
                    on:change={({ target }) =>
                        updateCustomLanguages(target.value)}
                />

                <p class="hint">
                    {localize("A5E.HintSeparateBySemiColon")}
                </p>
            </div>
        </section>
    {/if}

    {#if equipmentLength}
        <section class="ability-score-wrapper">
            <h3>
                {localize("A5E.BackgroundDropEquipmentSelect")}
            </h3>

            <div class="u-flex u-flex-wrap u-gap-md">
                <!-- svelte-ignore missing-declaration (fromUuid) -->
                {#each Object.values($item.system.equipment).map( (e) => fromUuid(e.uuid) ) as promise}
                    {#await promise then equipment}
                        <input
                            class="ability-score-input"
                            type="checkbox"
                            name="ASI"
                            id={`${$item.id}-equipment-${equipment.uuid}`}
                            value={equipment.uuid}
                            bind:group={selectedEquipment}
                        />

                        <label
                            class="ability-score-label"
                            for={`${$item.id}-equipment-${equipment.uuid}`}
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

        h3 {
            font-size: 1rem;
            font-family: "Signika", sans-serif;
        }
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
            font-size: 0.833rem;
            padding: 0.25rem 0.5rem;
            cursor: pointer;
            transition: all 0.15s ease-in-out;
        }

        &-wrapper {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
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
