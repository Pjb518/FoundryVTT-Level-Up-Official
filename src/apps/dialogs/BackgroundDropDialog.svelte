<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import CustomTagGroup from "../components/CustomTagGroup.svelte";
    import FormSection from "../components/FormSection.svelte";
    import GenericConfigDialog from "../dialogs/initializers/GenericConfigDialog";
    import ToolProfConfigDialog from "./ToolProfConfigDialog.svelte";

    export let { application } = getContext("#external");
    export let { actorDocument, itemDocument } =
        getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const item = new TJSDocument(itemDocument);

    const { A5E } = CONFIG;
    const equipmentLength = Object.entries($item.system.equipment).length;

    const toolKeys = Object.values(A5E.tools).reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
    );

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
                dialogHint: tools.options,
            }
        ).render(true);

        const dialogData = await dialog?.promise;
        if (!dialogData) return;

        selectedTools = dialogData.tools;
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

    let languages = $item.system.proficiencies.languages;
    let skills = $item.system.proficiencies.skills;
    let tools = $item.system.proficiencies.tools;

    let selectedEquipment = [];
    let selectedLanguages = [...languages.fixed];
    let selectedTools = [];

    let selectedSkills = [
        ...skills.fixed.filter((s) => !$actor.system.skills[s].proficient),
    ];

    let selectedAbilityScores = [
        $item.system.includesASI ? $item.system.defaultASI : null,
    ].filter(Boolean);
</script>

<form>
    {#if $item.system.includesASI}
        <FormSection
            heading="A5E.BackgroundDropAbilitySelect"
            hint="A5E.BackgroundDropAbilitySelectHint"
            warning="{2 -
                selectedAbilityScores.length} Ability Score selections remaining"
            showWarning={selectedAbilityScores.length < 2}
        >
            <CheckboxGroup
                options={Object.entries(A5E.abilities)}
                selected={selectedAbilityScores}
                disabled={selectedAbilityScores.length === 2}
                on:updateSelection={({ detail }) =>
                    (selectedAbilityScores = detail)}
            />
        </FormSection>
    {/if}

    {#if languages.count}
        <FormSection
            heading="A5E.BackgroundDropLanguagesSelect"
            warning="{languages.count -
                selectedLanguages.length} language selections remaining"
            showWarning={selectedLanguages.length < languages.count}
        >
            <CustomTagGroup
                options={Object.entries(A5E.languages)}
                selected={languages.fixed}
                disabled={selectedLanguages.length >= languages.count}
                red={$actor.system.proficiencies.languages}
                on:updateSelection={({ detail }) =>
                    (selectedLanguages = detail)}
            />
        </FormSection>
    {/if}

    {#if skills.count}
        <FormSection
            heading="A5E.BackgroundDropSkillsSelect"
            warning="{skills.count -
                selectedSkills.length} Skill selections remaining"
            showWarning={selectedSkills.length < skills.count}
        >
            <CheckboxGroup
                options={Object.entries(A5E.skills)}
                disabledOptions={Object.keys($actor.system.skills).reduce(
                    (invalidSkills, skillKey) => {
                        if (
                            selectedSkills.length >= skills.count &&
                            !selectedSkills.includes(skillKey)
                        ) {
                            invalidSkills.push(skillKey);
                        }

                        return invalidSkills;
                    },
                    []
                )}
                selected={selectedSkills}
                orange={skills.options}
                red={Object.entries($actor.system.skills).reduce(
                    (proficientSkills, [skillKey, skill]) => {
                        if (skill.proficient) proficientSkills.push(skillKey);
                        return proficientSkills;
                    },
                    []
                )}
                on:updateSelection={({ detail }) => {
                    selectedSkills = detail;
                }}
            />
        </FormSection>
    {/if}

    {#if tools.options}
        <FormSection
            heading="A5E.BackgroundDropToolsSelect"
            hint={tools.options}
            warning="{tools.count -
                selectedTools.length} Tool selections remaining"
            showWarning={selectedTools.length < tools.count}
        >
            <button
                class="tools-config a5e-button a5e-button--add"
                on:click|preventDefault={updateTools}
            >
                {localize("A5E.ButtonAdd", {
                    type: localize("A5E.ToolPlural"),
                })}
            </button>

            {#if selectedTools.length}
                <CheckboxGroup
                    options={Object.entries(toolKeys).filter(([toolKey]) =>
                        selectedTools.includes(toolKey)
                    )}
                    optionStyles="cursor: auto;"
                    selected={selectedTools}
                />
            {/if}
        </FormSection>
    {/if}

    {#if equipmentLength}
        <FormSection heading="A5E.BackgroundDropEquipmentSelect">
            <!-- svelte-ignore missing-declaration -->
            <CheckboxGroup
                options={Object.entries($item.system.equipment).map(
                    ([key, e]) => [key, fromUuidSync(e.uuid)?.name]
                )}
                selected={selectedEquipment}
                on:updateSelection={({ detail }) => {
                    selectedEquipment = detail;
                }}
            />
        </FormSection>
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
        gap: 0.5rem;
        overflow: auto;
    }

    .button-container {
        display: flex;
    }

    .tools-config {
        font-size: 0.694rem;
        margin-left: auto;
        margin-right: 0.75rem;
        line-height: 1;
    }
</style>
