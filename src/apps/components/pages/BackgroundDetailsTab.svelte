<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import prepareAbilityOptions from "../../dataPreparationHelpers/prepareAbilityOptions";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import RadioGroup from "../RadioGroup.svelte";
    import CustomTagGroup from "../CustomTagGroup.svelte";
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
    <section class="section-wrapper">
        <div class="u-flex u-align-center u-gap=md">
            <input
                class="u-pointer"
                type="checkbox"
                name="system.includesASI"
                id={`${$item.id}-includesASI`}
                checked={$item.system.includesASI}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        target.name,
                        target.checked
                    )}
            />

            <label class="u-pointer u-text-sm" for={`${$item.id}-includesASI`}>
                {localize("A5E.ASIIncludes")}
            </label>
        </div>
    </section>

    {#if $item.system.includesASI}
        <section class="section-wrapper">
            <h3 class="section-title">
                {localize("A5E.ASIDefault")}
            </h3>
            <RadioGroup
                listClasses="u-gap-md u-text-sm"
                optionStyles="padding:0.5rem; text-align: center; width: 2rem;"
                options={abilityOptions}
                selected={$item.system.defaultASI}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.defaultASI",
                        detail
                    )}
            />
        </section>
    {/if}

    <section class="section-wrapper">
        <h3 class="section-title">
            {localize("A5E.Languages")}
        </h3>

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
    </section>

    <section class="section-wrapper">
        <h3 class="section-title">
            {localize("A5E.BackgroundMaxLanguages")}
        </h3>

        <div class="a5e-input-container a5e-input-container--numeric">
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
        </div>
    </section>

    <section class="section-wrapper">
        <h3 class="section-title">
            {localize("A5E.SkillPlural")}
        </h3>

        <MultiStateCheckBoxGroup
            options={skillOptions}
            selected={[skills.fixed, skills.options]}
            hint="Hint: Skills marked as green are fixed, and skills marked as orange are options. Right-click a filter to quickly remove it from the selection."
            on:updateSelection={({ detail }) => updateMulti(detail, "skills")}
        />
    </section>

    <section class="section-wrapper">
        <h3 class="section-title">
            {localize("A5E.BackgroundMaxSkills")}
        </h3>

        <div class="a5e-input-container a5e-input-container--numeric">
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
        </div>
    </section>

    <section class="section-wrapper">
        <h3 class="section-title">
            {localize("A5E.ToolPlural")}
        </h3>

        <input
            class="a5e-input"
            type="text"
            name="system.proficiencies.tools.options"
            value={$item.system.proficiencies.tools.options}
            on:change={({ target }) =>
                updateDocumentDataFromField($item, target.name, target.value)}
        />
    </section>

    <section class="section-wrapper">
        <h3 class="section-title">
            {localize("A5E.BackgroundMaxTools")}
        </h3>

        <div class="a5e-input-container a5e-input-container--numeric">
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
        </div>
    </section>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-inline: 0.5rem;
        overflow-y: auto;
    }
    .section-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.275rem;
    }
    .section-title {
        font-size: 0.833rem;
        font-family: "Signika", sans-serif;
        font-weight: bold;
        margin-bottom: 0.125rem;
    }
</style>
