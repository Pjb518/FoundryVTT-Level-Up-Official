<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import prepareAbilityOptions from "../../dataPreparationHelpers/prepareAbilityOptions";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import CustomTagGroup from "../CustomTagGroup.svelte";
    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import MultiStateCheckBoxGroup from "../MultiStateCheckBoxGroup.svelte";

    const item = getContext("item");

    const abilityOptions = [
        ["none", localize("A5E.None")],
        ...prepareAbilityOptions(),
    ];

    function updateMulti(selection, type) {
        const [fixed, options] = selection;
        updateDocumentDataFromField(
            $item,
            `system.proficiencies.${type}.options`,
            options
        );

        updateDocumentDataFromField(
            $item,
            `system.proficiencies.${type}.fixed`,
            fixed
        );
    }

    const defaultLanguages = Object.entries(CONFIG.A5E.languages);
    const skillOptions = Object.entries(CONFIG.A5E.skills);

    $: languages = $item.system.proficiencies.languages;
    $: skills = $item.system.proficiencies.skills;
</script>

<article>
    <FormSection>
        <Checkbox
            label="A5E.ASIIncludes"
            checked={$item.system.includesASI}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $item,
                    "system.includesASI",
                    detail
                );
            }}
        />
    </FormSection>

    {#if $item.system.includesASI}
        <FormSection heading="A5E.ASIDefault" --direction="column">
            <RadioGroup
                optionStyles="min-width:2rem; text-align: center;"
                options={abilityOptions}
                selected={$item.system.defaultASI}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.defaultASI",
                        detail
                    )}
            />
        </FormSection>
    {/if}

    <FormSection heading="A5E.Languages" --direction="column">
        <CustomTagGroup
            options={defaultLanguages}
            selected={languages.fixed}
            heading={null}
            on:updateSelection={({ detail }) =>
                updateDocumentDataFromField(
                    $item,
                    "system.proficiencies.languages.fixed",
                    detail
                )}
        />
    </FormSection>

    <FormSection heading="A5E.BackgroundMaxLanguages" --direction="column">
        <input
            class="a5e-input a5e-input--small"
            type="number"
            name="system.proficiencies.languages.count"
            value={$item.system.proficiencies.languages.count}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    target.name,
                    Number(target.value)
                )}
        />
    </FormSection>

    <FormSection heading="A5E.SkillPlural" --direction="column">
        <MultiStateCheckBoxGroup
            options={skillOptions}
            selected={[skills.fixed, skills.options]}
            hint="Hint: Skills marked as green are fixed, and skills marked as orange are options. Right-click a filter to quickly remove it from the selection."
            on:updateSelection={({ detail }) => updateMulti(detail, "skills")}
        />
    </FormSection>

    <FormSection heading="A5E.BackgroundMaxSkills" --direction="column">
        <input
            class="a5e-input a5e-input--small"
            type="number"
            name="system.proficiencies.skills.count"
            value={$item.system.proficiencies.skills.count}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    target.name,
                    Number(target.value)
                )}
        />
    </FormSection>

    <FormSection heading="A5E.ToolPlural" --direction="column">
        <input
            class="a5e-input"
            type="text"
            name="system.proficiencies.tools.options"
            value={$item.system.proficiencies.tools.options}
            on:change={({ target }) =>
                updateDocumentDataFromField($item, target.name, target.value)}
        />
    </FormSection>

    <FormSection heading="A5E.BackgroundMaxTools" --direction="column">
        <input
            class="a5e-input a5e-input--small"
            type="number"
            name="system.proficiencies.tools.count"
            value={$item.system.proficiencies.tools.count}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    target.name,
                    Number(target.value)
                )}
        />
    </FormSection>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        overflow-y: auto;
    }
</style>
