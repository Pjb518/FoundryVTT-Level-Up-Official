<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";
    import CustomTagGroup from "../CustomTagGroup.svelte";

    const item = getContext("item");

    async function updateMulti(selection, type) {
        const [fixed, options] = selection;

        await $item.update({
            [`system.proficiencies.${type}.options`]: options,
            [`system.proficiencies.${type}.fixed`]: fixed,
        });
    }

    const languageOptions = Object.entries(CONFIG.A5E.languages);
    const skillOptions = Object.entries(CONFIG.A5E.skills);
    const armorOptions = Object.entries(CONFIG.A5E.armor);
    const abilityOptions = [
        ["none", localize("A5E.None")],
        ...Object.entries(CONFIG.A5E.abilities),
    ];

    $: languages = $item.system.proficiencies.languages;
    $: skills = $item.system.proficiencies.skills;
    $: armor = $item.system.proficiencies.armor;
    $: weapons = $item.system.proficiencies.weapons;
    $: tools = $item.system.proficiencies.tools;
</script>

<article>
    {#if $item.type === "background"}
        <FormSection>
            <Checkbox
                label="A5E.advancementSheet.ASIIncludes"
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
            <FormSection
                heading="A5E.advancementSheet.ASIDefault"
                --direction="column"
            >
                <RadioGroup
                    optionStyles="min-width:2rem; text-align: center;"
                    options={abilityOptions}
                    selected={$item.system.defaultASI}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $item,
                            "system.defaultASI",
                            detail
                        );
                    }}
                />
            </FormSection>
        {/if}
    {/if}

    <!-- Languages -->
    <FormSection --direction="column" --gap="1rem">
        <section class="u-flex u-flex-col u-gap-sm">
            <h3 class="u-text-bold u-text-sm">
                {localize("A5E.advancementSheet.mandatoryOptions", {
                    type: localize("A5E.Languages"),
                })}
            </h3>

            <CustomTagGroup
                options={languageOptions}
                selected={languages.fixed}
                disabledOptions={languages.options}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.proficiencies.languages.fixed",
                        detail
                    )}
            />
        </section>

        <section class="u-flex u-flex-col u-gap-sm">
            <h3 class="u-text-bold u-text-sm">
                {localize("A5E.advancementSheet.optionalOptions", {
                    type: localize("A5E.Languages"),
                })}
            </h3>

            <CustomTagGroup
                options={languageOptions}
                selected={languages.options}
                disabledOptions={languages.fixed}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.proficiencies.languages.options",
                        detail
                    )}
            />
        </section>

        <section class="u-flex u-flex-col u-gap-sm">
            <h3 class="u-text-bold u-text-sm">
                {localize("A5E.advancementSheet.additionalOptions", {
                    type: localize("A5E.Languages"),
                })}
            </h3>

            <input
                class="a5e-input a5e-input--small a5e-input--slim"
                type="number"
                name="system.proficiencies.languages.count"
                value={languages.count ?? 0}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        target.name,
                        parseInt(target.value, 10) ?? 0
                    )}
            />
        </section>
    </FormSection>

    <!-- Skills -->
    <FormSection --direction="column" --gap="1rem">
        <section class="u-flex u-flex-col u-gap-sm">
            <h3 class="u-text-bold u-text-sm">
                {localize("A5E.advancementSheet.mandatoryOptions", {
                    type: localize("A5E.SkillPlural"),
                })}
            </h3>

            <CheckboxGroup
                options={skillOptions}
                selected={skills.fixed}
                disabledOptions={skills.options}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.proficiencies.skills.fixed",
                        detail
                    )}
            />
        </section>

        <section class="u-flex u-flex-col u-gap-sm">
            <h3 class="u-text-bold u-text-sm">
                {localize("A5E.advancementSheet.optionalOptions", {
                    type: localize("A5E.SkillPlural"),
                })}
            </h3>

            <CheckboxGroup
                options={skillOptions}
                selected={skills.options}
                disabledOptions={skills.fixed}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.proficiencies.skills.options",
                        detail
                    )}
            />
        </section>

        <section class="u-flex u-flex-col u-gap-sm">
            <h3 class="u-text-bold u-text-sm">
                {localize("A5E.advancementSheet.additionalOptions", {
                    type: localize("A5E.SkillPlural"),
                })}
            </h3>

            <input
                class="a5e-input a5e-input--small a5e-input--slim"
                type="number"
                name="system.proficiencies.skills.count"
                value={skills.count ?? 0}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        target.name,
                        parseInt(target.value, 10) ?? 0
                    )}
            />
        </section>
    </FormSection>

    <!-- Armor -->
    <FormSection --direction="column" --gap="1rem">
        <section class="u-flex u-flex-col u-gap-sm">
            <h3 class="u-text-bold u-text-sm">
                {localize("A5E.advancementSheet.mandatoryOptions", {
                    type: localize("A5E.ArmorPlural"),
                })}
            </h3>

            <CheckboxGroup
                options={armorOptions}
                selected={armor.fixed}
                disabledOptions={armor.options}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.proficiencies.armor.fixed",
                        detail
                    )}
            />
        </section>

        <section class="u-flex u-flex-col u-gap-sm">
            <h3 class="u-text-bold u-text-sm">
                {localize("A5E.advancementSheet.optionalOptions", {
                    type: localize("A5E.ArmorPlural"),
                })}
            </h3>

            <CheckboxGroup
                options={armorOptions}
                selected={armor.options}
                disabledOptions={armor.fixed}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.proficiencies.armor.options",
                        detail
                    )}
            />
        </section>

        <section class="u-flex u-flex-col u-gap-sm">
            <h3 class="u-text-bold u-text-sm">
                {localize("A5E.advancementSheet.additionalOptions", {
                    type: localize("A5E.ArmorPlural"),
                })}
            </h3>

            <input
                class="a5e-input a5e-input--small a5e-input--slim"
                type="number"
                name="system.proficiencies.armor.count"
                value={armor.count ?? 0}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        target.name,
                        parseInt(target.value, 10) ?? 0
                    )}
            />
        </section>
    </FormSection>

    <!-- Weapons -->
    <FormSection --direction="column" --gap="1rem">
        <section class="u-flex u-flex-col u-gap-sm">
            <h3 class="u-text-bold u-text-sm">
                {localize("A5E.advancementSheet.mandatoryOptions", {
                    type: localize("A5E.Weapons"),
                })}
            </h3>

            <input
                class="a5e-input a5e-input--slim"
                type="text"
                name="system.proficiencies.weapons.options"
                value={weapons.options ?? ""}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        target.name,
                        target.value
                    )}
            />
        </section>

        <section class="u-flex u-flex-col u-gap-sm">
            <h3 class="u-text-bold u-text-sm">
                {localize("A5E.advancementSheet.additionalOptions", {
                    type: localize("A5E.Weapons"),
                })}
            </h3>

            <input
                class="a5e-input a5e-input--small a5e-input--slim"
                type="number"
                name="system.proficiencies.weapons.count"
                value={weapons.count ?? 0}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        target.name,
                        parseInt(target.value, 10) ?? 0
                    )}
            />
        </section>
    </FormSection>

    <!-- Tools -->
    <FormSection --direction="column" --gap="1rem">
        <section class="u-flex u-flex-col u-gap-sm">
            <h3 class="u-text-bold u-text-sm">
                {localize("A5E.advancementSheet.mandatoryOptions", {
                    type: localize("A5E.ToolPlural"),
                })}
            </h3>

            <input
                class="a5e-input a5e-input--slim"
                type="text"
                name="system.proficiencies.tools.options"
                value={tools.options ?? ""}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        target.name,
                        target.value
                    )}
            />
        </section>

        <section class="u-flex u-flex-col u-gap-sm">
            <h3 class="u-text-bold u-text-sm">
                {localize("A5E.advancementSheet.additionalOptions", {
                    type: localize("A5E.ToolPlural"),
                })}
            </h3>

            <input
                class="a5e-input a5e-input--small a5e-input--slim"
                type="number"
                name="system.proficiencies.tools.count"
                value={tools.count ?? 0}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        target.name,
                        parseInt(target.value, 10) ?? 0
                    )}
            />
        </section>
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
