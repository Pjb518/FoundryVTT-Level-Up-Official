<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import CustomTagGroup from "../components/CustomTagGroup.svelte";
    import Tag from "../components/Tag.svelte";
    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import MultiStateCheckBoxGroup from "../components/MultiStateCheckBoxGroup.svelte";

    export let { application } = getContext("#external");
    export let { itemDocument } = getContext("#external").application;

    const item = new TJSDocument(itemDocument);

    const A5E = CONFIG.A5E;
    const equipmentLength = Object.entries($item.system.equipment).length;

    const updateEquipment = (value) => {
        selectedEquipment = updateArray(selectedEquipment, value);
    };
    const updateSkills = (value) => {
        selectedSkills = updateArray(selectedSkills, value);
    };

    function updateArray(arr, value) {
        const newSelection = new Set(arr);

        if (newSelection.has(value)) newSelection.delete(value);
        else newSelection.add(value);

        return [...newSelection];
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
    $: skills = $item.system.proficiencies.skills;
    $: tools = $item.system.proficiencies.tools;

    $: selectedEquipment = [];
    $: selectedLanguages = [...languages.fixed];
    $: selectedSkills = [...skills.fixed];
    $: selectedTools = [];
    $: selectedAbilityScores = [
        $item.system.includesASI ? $item.system.defaultASI : null,
    ].filter(Boolean);
</script>

<form>
    {#if $item.system.includesASI}
        <section class="ability-score-wrapper">
            <h3>
                {localize("A5E.BackgroundDropAbilitySelect")}
            </h3>

            <CheckboxGroup
                options={Object.entries(A5E.abilities)}
                selected={selectedAbilityScores}
                disabled={selectedAbilityScores.length === 2}
                on:updateSelection={({ detail }) =>
                    (selectedAbilityScores = detail)}
            />

            <p class="hint">
                {localize("A5E.BackgroundDropAbilitySelectHint")}
            </p>
        </section>
    {/if}

    {#if languages.count}
        <section class="ability-score-wrapper">
            <h3>
                {localize("A5E.BackgroundDropLanguagesSelect")}
            </h3>

            <CustomTagGroup
                options={Object.entries(A5E.languages)}
                selected={languages.fixed}
                disabled={selectedLanguages.length >= languages.count}
                on:updateSelection={({ detail }) =>
                    (selectedLanguages = detail)}
            />
        </section>
    {/if}

    {#if skills.count}
        <section class="ability-score-wrapper">
            <h3>
                {localize("A5E.BackgroundDropSkillsSelect")}
            </h3>

            <ul>
                {#each Object.entries(A5E.skills) as [skill, label]}
                    <Tag
                        active={selectedSkills.includes(skill)}
                        {label}
                        value={skill}
                        disabled={selectedSkills.length >= skills.count &&
                            !selectedSkills.includes(skill)}
                        orange={skills.options.includes(skill)}
                        on:tagToggle={({ detail }) => updateSkills(detail)}
                    />
                {/each}
            </ul>
        </section>
    {/if}

    {#if equipmentLength}
        <section class="ability-score-wrapper">
            <h3>
                {localize("A5E.BackgroundDropEquipmentSelect")}
            </h3>

            <ul>
                <!-- svelte-ignore missing-declaration (fromUuid) -->
                {#each Object.values($item.system.equipment).map( (e) => fromUuid(e.uuid) ) as promise}
                    {#await promise then equipment}
                        <Tag
                            active={selectedEquipment.includes(equipment.uuid)}
                            label={equipment.name}
                            value={equipment.uuid}
                            on:tagToggle={({ detail }) =>
                                updateEquipment(detail)}
                        />
                    {/await}
                {/each}
            </ul>
        </section>
    {/if}

    <div class="button-container">
        <button on:click|preventDefault={submitForm}>
            {localize("A5E.Submit")}
        </button>
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
            font-size: 0.833rem;
            font-weight: bold;
            font-family: "Signika", sans-serif;
        }
    }

    ul {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
        list-style: none;
        margin: 0;
        padding: 0;
        font-size: 0.694rem;
        width: 100%;
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
            font-size: 0.694rem;
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
