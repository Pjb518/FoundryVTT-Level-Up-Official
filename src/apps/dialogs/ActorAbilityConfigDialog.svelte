<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import FormSection from "../components/FormSection.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import prepareExpertiseDiceOptions from "../dataPreparationHelpers/prepareExpertiseDiceOptions";
    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let { actorDocument, appId, abilityKey } =
        getContext("#external").application;

    function updateCurrentTab(event) {
        currentTab = tabs[event.detail];
    }

    const actor = new TJSDocument(actorDocument);
    const expertiseDiceOptions = prepareExpertiseDiceOptions();

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

    const checkBonusHeading = localize("A5E.AbilityCheckBonus", {
        ability: localize(CONFIG.A5E.abilities[abilityKey]),
    });

    const saveBonusHeading = localize("A5E.SavingThrowBonus", {
        ability: localize(CONFIG.A5E.abilities[abilityKey]),
    });

    let currentTab = tabs[0];

    $: ability = $actor.system.abilities[abilityKey];
</script>

<article>
    <NavigationBar {currentTab} {tabs} on:tab-change={updateCurrentTab} />

    <!-- Ability Check Config -->
    {#if currentTab.name === "abilityCheck"}
        <div class="u-flex u-flex-col u-gap-md">
            <FormSection heading="A5E.ExpertiseDie">
                <RadioGroup
                    options={expertiseDiceOptions}
                    selected={ability?.check.expertiseDice}
                    optionStyles="min-width:2rem; text-align: center;"
                    on:updateSelection={({ detail }) =>
                        updateDocumentDataFromField(
                            $actor,
                            `system.abilities.${abilityKey}.check.expertiseDice`,
                            detail
                        )}
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
                        name="system.abilities.{abilityKey}.check.bonus"
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
                        id="{appId}-{abilityKey}-proficient"
                        name="system.abilities.{abilityKey}.save.proficient"
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
                        for="{appId}-{abilityKey}-proficient"
                    >
                        {localize("A5E.ProficiencyProficient")}
                    </label>
                </div>
            </FormSection>

            <FormSection heading="A5E.ExpertiseDie">
                <RadioGroup
                    options={expertiseDiceOptions}
                    selected={ability?.save.expertiseDice}
                    optionStyles="min-width:2rem; text-align: center;"
                    on:updateSelection={({ detail }) =>
                        updateDocumentDataFromField(
                            $actor,
                            `system.abilities.${abilityKey}.save.expertiseDice`,
                            detail
                        )}
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
                        name="system.abilities.{abilityKey}.save.bonus"
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
                            name="system.abilities.con.save.concentrationBonus"
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
                        name="system.bonuses.abilities.save"
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
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
        overflow: auto;
        background: rgba(246, 242, 235, 0.5);
    }
</style>
