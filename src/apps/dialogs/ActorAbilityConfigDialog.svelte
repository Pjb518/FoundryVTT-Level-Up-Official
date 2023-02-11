<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import FormSection from "../components/FormSection.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import prepareExpertiseDiceOptions from "../handlers/prepareExpertiseDiceOptions";
    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let { actorDocument, appId, abilityKey } =
        getContext("#external").application;

    function updateCurrentTab(event) {
        currentTab = tabs[event.detail];
    }

    const actor = new TJSDocument(actorDocument);

    const tabs = [
        {
            name: "abilityCheck",
            label: "A5E.TabAbilityCheck",
        },
        {
            name: "savingThrow",
            label: "A5E.TabSavingThrow",
        },
    ];

    const expertiseDieOptions = prepareExpertiseDiceOptions();

    const checkBonusHeading = game.i18n.format("A5E.AbilityCheckBonus", {
        ability: game.i18n.localize(CONFIG.A5E.abilities[abilityKey]),
    });

    const saveBonusHeading = game.i18n.format("A5E.SavingThrowBonus", {
        ability: game.i18n.localize(CONFIG.A5E.abilities[abilityKey]),
    });

    $: ability = $actor.system.abilities[abilityKey];
    $: currentTab = tabs[0];
</script>

<main>
    <NavigationBar {currentTab} {tabs} on:tab-change={updateCurrentTab} />

    <!-- Ability Check Config -->
    {#if currentTab.name === "abilityCheck"}
        <div class="u-flex u-flex-col u-gap-md">
            <FormSection heading="A5E.ExpertiseDie">
                <RadioGroup
                    options={expertiseDieOptions}
                    selected={ability.check.expertiseDice}
                    name={`system.abilities.${abilityKey}.check.expertiseDice`}
                    document={actor}
                />
            </FormSection>

            <FormSection
                heading={checkBonusHeading}
                hint="This field accepts any values valid in roll formulae."
            >
                <div class="u-w-full">
                    <input
                        class="a5e-input"
                        type="text"
                        name={`system.abilities.${abilityKey}.check.bonus`}
                        value={ability.check.bonus}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                target.value
                            )}
                    />
                </div>
            </FormSection>

            <FormSection
                heading="A5E.AbilityCheckBonusGlobal"
                hint="This bonus is added to all ability check modifiers, including skill modifiers. This field accepts any values valid in roll formulae."
            >
                <div class="u-w-full">
                    <input
                        class="a5e-input"
                        type="text"
                        name="system.bonuses.abilities.check"
                        value={$actor.system.bonuses.abilities.check}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                target.value
                            )}
                    />
                </div>
            </FormSection>
        </div>

        <!-- Saving Throw Config  -->
    {:else if currentTab.name === "savingThrow"}
        <div class="u-flex u-flex-col u-gap-md">
            <FormSection>
                <div class="u-align-center u-flex u-gap-md">
                    <input
                        class="u-pointer"
                        type="checkbox"
                        id={`${appId}-${abilityKey}-proficient`}
                        name={`system.abilities.${abilityKey}.save.proficient`}
                        value={$actor.system.abilities[abilityKey].save
                            .proficient}
                        checked={ability.save.proficient}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                target.value
                            )}
                    />

                    <label
                        class="u-pointer"
                        for={`${appId}-${abilityKey}-proficient`}
                    >
                        {localize("A5E.ProficiencyProficient")}
                    </label>
                </div>
            </FormSection>

            <FormSection heading="A5E.ExpertiseDie">
                <RadioGroup
                    listClasses="a5e-radio-group--expertise u-gap-md u-mb-md u-text-sm"
                    optionClasses="u-p-md u-text-center u-w-12"
                    options={expertiseDieOptions}
                    selected={ability.save.expertiseDice}
                    name={`system.abilities.${abilityKey}.save.expertiseDice`}
                    document={actor}
                />
            </FormSection>

            <FormSection
                heading={saveBonusHeading}
                hint="This field accepts any values valid in roll formulae."
            >
                <div class="u-w-full">
                    <input
                        class="a5e-input"
                        type="text"
                        name={`system.abilities.${abilityKey}.save.bonus`}
                        value={ability.save.bonus}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                target.value
                            )}
                    />
                </div>
            </FormSection>

            {#if abilityKey === "con"}
                <FormSection
                    heading="A5E.ConcentrationCheckBonus"
                    hint="This field accepts any values valid in roll formulae."
                >
                    <div class="u-w-full">
                        <input
                            class="a5e-input"
                            type="text"
                            name={`system.abilities.con.save.concentrationBonus`}
                            value={ability.save?.concentrationBonus ?? 0}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $actor,
                                    target.name,
                                    target.value
                                )}
                        />
                    </div>
                </FormSection>
            {/if}

            <FormSection
                heading="A5E.SavingThrowBonusGlobal"
                hint="This bonus is added to all saving throw modifiers. This field accepts any values valid in roll formulae."
            >
                <div class="u-w-full">
                    <input
                        class="a5e-input"
                        type="text"
                        name={`system.bonuses.abilities.save`}
                        value={$actor.system.bonuses.abilities.save}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                target.value
                            )}
                    />
                </div>
            </FormSection>
        </div>
    {/if}
</main>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
        overflow: auto;
        background: rgba(246, 242, 235, 0.5);
    }
</style>
