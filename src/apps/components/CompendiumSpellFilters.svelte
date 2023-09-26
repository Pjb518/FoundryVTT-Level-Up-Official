<script>
    import Checkbox from "./Checkbox.svelte";
    import FormSection from "./FormSection.svelte";

    const { spellLevels } = CONFIG.A5E;
</script>

<FormSection
    heading="Spell Levels"
    --background="transparent"
    --direction="column"
    --padding="0"
>
    <ul class="filter-option-list">
        {#each Object.entries(spellLevels) as [level, label]}
            <li>
                <Checkbox {label} />
            </li>
        {/each}
    </ul>
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
