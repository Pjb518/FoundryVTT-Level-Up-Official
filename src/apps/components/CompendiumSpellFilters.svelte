<script>
    import CheckboxGroup from "./CheckboxGroup.svelte";
    import FormSection from "./FormSection.svelte";

    const { spellLevels, spellSchools } = CONFIG.A5E;
</script>

<FormSection
    heading="Spell Levels"
    --background="transparent"
    --direction="column"
    --padding="0"
>
    <CheckboxGroup options={Object.entries(spellLevels)} />
</FormSection>

<FormSection
    heading="Primary Spell Schools"
    --background="transparent"
    --direction="column"
    --padding="0"
>
    <CheckboxGroup options={Object.entries(spellSchools.primary)} />
</FormSection>

<FormSection
    heading="Secondary Spell Schools"
    --background="transparent"
    --direction="column"
    --padding="0"
>
    <CheckboxGroup options={Object.entries(spellSchools.secondary)} />
</FormSection>

<style lang="scss">
    .filter-option-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin: 0;
        padding: 0;
        list-style: none;
    }
</style>
