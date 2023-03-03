<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import prepareAbilityOptions from "../../handlers/prepareAbilityOptions";

    import LinkedDocumentsHelper from "../../utils/LinkedDocumentsHelper";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import RadioGroup from "../RadioGroup.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";
    import CustomTagGroup from "../CustomTagGroup.svelte";

    const item = getContext("item");

    const abilityOptions = [
        ["none", localize("A5E.None")],
        ...prepareAbilityOptions(),
    ];
    const defaultLanguages = Object.entries(CONFIG.A5E.languages);
    const skillOptions = Object.entries(CONFIG.A5E.skills);
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
                optionClasses="u-p-md u-text-center u-w-12"
                options={abilityOptions}
                selected={$item.system.defaultASI}
                name="system.defaultASI"
                document={item}
            />
        </section>
    {/if}

    <section class="section-wrapper">
        <CustomTagGroup
            heading="A5E.Languages"
            options={defaultLanguages}
            selected={$item.system.proficiencies.languages.options}
            name="system.proficiencies.languages.options"
            document={item}
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

        <CheckboxGroup
            options={skillOptions}
            selected={$item.system.proficiencies.skills.options}
            name="system.proficiencies.skills.options"
            document={item}
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
