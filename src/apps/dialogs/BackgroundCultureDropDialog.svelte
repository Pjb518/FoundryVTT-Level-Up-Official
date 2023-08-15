<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import CustomTagGroup from "../components/CustomTagGroup.svelte";
    import FormSection from "../components/FormSection.svelte";
    import GenericConfigDialog from "../dialogs/initializers/GenericConfigDialog";
    import WeaponProfConfigDialog from "./WeaponProfConfigDialog.svelte";
    import ToolProfConfigDialog from "./ToolProfConfigDialog.svelte";

    export let { application } = getContext("#external");
    export let { actorDocument, itemDocument } =
        getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const item = new TJSDocument(itemDocument);

    const { A5E } = CONFIG;
    const equipmentLength = Object.entries($item.system.equipment).length;

    const weaponKeys = Object.values(A5E.weapons).reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
    );

    const toolKeys = Object.values(A5E.tools).reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
    );

    async function updateWeapons() {
        const title = localize("A5E.WeaponProficienciesConfigurationPrompt", {
            name: $item.name,
        });

        const dialog = new GenericConfigDialog(
            actorDocument,
            title,
            WeaponProfConfigDialog,
            {
                max: weapons.count,
                submitDialog: true,
                dialogWeapons: selectedWeapons,
                dialogHint: weapons.options,
            }
        ).render(true);

        const dialogData = await dialog?.promise;
        if (!dialogData) return;

        selectedWeapons = dialogData.weapons;
    }

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
            selectedArmor,
            selectedEquipment,
            selectedLanguages,
            selectedSkills,
            selectedTools,
            selectedWeapons,
        });
    }

    let armor = $item.system.proficiencies.armor;
    let languages = $item.system.proficiencies.languages;
    let skills = $item.system.proficiencies.skills;
    let tools = $item.system.proficiencies.tools;
    let weapons = $item.system.proficiencies.weapons;

    let numArmor = armor.count + armor.fixed.length;
    let numLanguages = languages.count + languages.fixed.length;
    let numSkills = skills.count + skills.fixed.length;

    const languageOptions = [
        ...new Set([
            ...languages.fixed,
            ...languages.options,
            ...Object.keys(A5E.languages),
        ]),
    ].map((l) => [l, A5E.languages?.[l] ?? l]);

    let selectedEquipment = [];
    let selectedLanguages = [...languages.fixed];
    let selectedSkills = [
        ...skills.fixed.filter((s) => !$actor.system.skills[s].proficient),
    ];
    let selectedArmor = [...armor.fixed];
    let selectedWeapons = [];
    let selectedTools = [];

    let selectedAbilityScores = [
        $item.system?.includesASI ? $item.system.defaultASI : null,
    ].filter(Boolean);
</script>

<form>
    <section>
        {#if $item.type === "background" && $item.system?.includesASI}
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

        {#if languages.count || languages.fixed.length || languages.options.length}
            <FormSection
                heading="A5E.BackgroundDropLanguagesSelect"
                warning="{numLanguages -
                    selectedLanguages.length} language selections remaining"
                showWarning={selectedLanguages.length < numLanguages}
                hint="A5E.originSheets.optionalSelectionHint"
            >
                <CustomTagGroup
                    options={languageOptions}
                    selected={languages.fixed.filter(
                        (l) =>
                            !$actor.system.proficiencies.languages.includes(l)
                    )}
                    orange={languages.options}
                    disabled={selectedLanguages.length >= numLanguages}
                    disabledOptions={$actor.system.proficiencies.languages}
                    on:updateSelection={({ detail }) =>
                        (selectedLanguages = detail)}
                />
            </FormSection>
        {/if}

        {#if skills.count || skills.fixed.length || skills.options.length}
            <FormSection
                heading="A5E.BackgroundDropSkillsSelect"
                warning="{numSkills -
                    selectedSkills.length} skill selections remaining"
                showWarning={selectedSkills.length < numSkills}
                hint="A5E.originSheets.optionalSelectionHint"
            >
                <CheckboxGroup
                    options={Object.entries(A5E.skills)}
                    selected={selectedSkills}
                    orange={skills.options}
                    disabled={selectedSkills.length >= numSkills}
                    disabledOptions={Object.entries(
                        $actor.system.skills
                    ).reduce((proficientSkills, [skillKey, skill]) => {
                        if (skill.proficient) proficientSkills.push(skillKey);
                        return proficientSkills;
                    }, [])}
                    on:updateSelection={({ detail }) => {
                        selectedSkills = detail;
                    }}
                />
            </FormSection>
        {/if}

        {#if armor.count || armor.fixed.length || armor.options.length}
            <FormSection
                heading="A5E.BackgroundDropArmorSelect"
                warning="{numArmor -
                    selectedArmor.length} armor selections remaining"
                showWarning={selectedArmor.length < numArmor}
                hint="A5E.originSheets.optionalSelectionHint"
            >
                <CustomTagGroup
                    options={Object.entries(A5E.armor)}
                    selected={armor.fixed.filter(
                        (a) => !$actor.system.proficiencies.armor.includes(a)
                    )}
                    orange={armor.options}
                    disabled={selectedArmor.length >= numArmor}
                    disabledOptions={$actor.system.proficiencies.armor}
                    on:updateSelection={({ detail }) => {
                        selectedArmor = detail;
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

        {#if weapons.options}
            <FormSection
                heading="A5E.BackgroundDropWeaponsSelect"
                hint={weapons.options}
                warning="{weapons.count -
                    selectedWeapons.length} Tool selections remaining"
                showWarning={selectedWeapons.length < weapons.count}
            >
                <button
                    class="tools-config a5e-button a5e-button--add"
                    on:click|preventDefault={updateWeapons}
                >
                    {localize("A5E.ButtonAdd", {
                        type: localize("A5E.Weapons"),
                    })}
                </button>

                {#if selectedWeapons.length}
                    <CheckboxGroup
                        options={Object.entries(weaponKeys).filter(
                            ([weaponKey]) => selectedWeapons.includes(weaponKey)
                        )}
                        optionStyles="cursor: auto;"
                        selected={selectedWeapons}
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
    </section>

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
        height: min(90vh, 25rem);
    }

    section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        flex: 1;
    }

    .button-container {
        display: flex;
    }

    .tools-config {
        font-size: $font-size-xs;
        margin-left: auto;
        margin-right: 0.75rem;
        line-height: 1;
    }
</style>
