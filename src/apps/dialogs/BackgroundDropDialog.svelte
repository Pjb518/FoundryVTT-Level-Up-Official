<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import GenericConfigDialog from "../dialogs/initializers/GenericConfigDialog";

    import ToolProfConfigDialog from "./ToolProfConfigDialog.svelte";
    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import CustomTagGroup from "../components/CustomTagGroup.svelte";
    import Tag from "../components/Tag.svelte";

    export let { application } = getContext("#external");
    export let { actorDocument, itemDocument } =
        getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const item = new TJSDocument(itemDocument);

    const A5E = CONFIG.A5E;
    const equipmentLength = Object.entries($item.system.equipment).length;

    const toolKeys = Object.values(CONFIG.A5E.tools).reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
    );

    const updateEquipment = (value) => {
        selectedEquipment = updateArray(selectedEquipment, value);
    };
    const updateSkills = (value) => {
        selectedSkills = updateArray(selectedSkills, value);
    };

    async function updateTools() {
        const title = localize("A5E.ToolProficienciesConfigurationPrompt", {
            name: $item.name,
        });

        const dialog = new GenericConfigDialog(
            actorDocument,
            title,
            ToolProfConfigDialog,
            {
                max: tools.count,
                submitDialog: true,
                dialogTools: selectedTools,
            }
        ).render(true);

        const dialogData = await dialog?.promise;
        if (!dialogData) return;

        selectedTools = dialogData.tools;
    }

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
    $: selectedSkills = [
        ...skills.fixed.filter((s) => !$actor.system.skills[s].proficient),
    ];
    $: selectedTools = [];
    $: selectedAbilityScores = [
        $item.system.includesASI ? $item.system.defaultASI : null,
    ].filter(Boolean);
</script>

<form>
    {#if $item.system.includesASI}
        <section class="section-wrapper">
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

            {#if selectedAbilityScores.length < 2}
                <p class="hint" style="color: #8b6225;">
                    <i class="fa-solid fa-circle-exclamation" />
                    {2 - selectedAbilityScores.length} Ability Score selections remaining
                </p>
            {/if}
        </section>
    {/if}

    {#if languages.count}
        <section class="section-wrapper">
            <h3>
                {localize("A5E.BackgroundDropLanguagesSelect")}
            </h3>

            <CustomTagGroup
                options={Object.entries(A5E.languages)}
                selected={languages.fixed}
                disabled={selectedLanguages.length >= languages.count}
                red={$actor.system.proficiencies.languages}
                on:updateSelection={({ detail }) =>
                    (selectedLanguages = detail)}
            />

            {#if selectedLanguages.length < languages.count}
                <p class="hint" style="color: #8b6225;">
                    <i class="fa-solid fa-circle-exclamation" />
                    {languages.count - selectedLanguages.length} language selections
                    remaining
                </p>
            {/if}
        </section>
    {/if}

    {#if skills.count}
        <section class="section-wrapper">
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
                        red={$actor.system.skills[skill].proficient}
                    />
                {/each}
            </ul>

            {#if selectedSkills.length < skills.count}
                <p class="hint" style="color: #8b6225;">
                    <i class="fa-solid fa-circle-exclamation" />
                    {skills.count - selectedSkills.length} Skill selections remaining
                </p>
            {/if}
        </section>
    {/if}

    {#if tools.options}
        <section class="ability-score=wrapper">
            <div class="u-flex u-align-center u-gap-md">
                <h3>
                    {localize("A5E.BackgroundDropToolsSelect")}
                </h3>

                <button
                    class="tools-config a5e-button a5e-button--add "
                    on:click|preventDefault={updateTools}
                >
                    {localize("A5E.ButtonAdd", {
                        type: localize("A5E.ToolPlural"),
                    })}
                </button>
            </div>

            <p class="hint u-pb-xs">
                {tools.options}
            </p>

            {#if selectedTools.length}
                <ul>
                    {#each selectedTools as tool}
                        <Tag
                            active={true}
                            value={tool}
                            label={toolKeys[tool] ?? tool}
                            optionStyles="cursor: auto;"
                        />
                    {/each}
                </ul>
            {/if}

            {#if selectedTools.length < tools.count}
                <p class="hint" style="color: #8b6225;">
                    <i class="fa-solid fa-circle-exclamation" />
                    {tools.count - selectedTools.length} Tool selections remaining
                </p>
            {/if}
        </section>
    {/if}

    {#if equipmentLength}
        <section class="section-wrapper">
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

    .section-wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .button-container {
        display: flex;
    }

    .tools-config {
        font-size: 0.694rem;
        margin-left: auto;
        margin-right: 0.75rem;
    }

    .hint {
        font-family: "Signika", sans-serif;
        font-size: 0.694rem;
    }
</style>
