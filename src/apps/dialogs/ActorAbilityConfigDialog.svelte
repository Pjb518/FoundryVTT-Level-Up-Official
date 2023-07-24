<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import Checkbox from "../components/Checkbox.svelte";
    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FormSection from "../components/FormSection.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

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
                <ExpertiseDiePicker
                    selected={ability?.check.expertiseDice}
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
                --direction="column"
            >
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
            </FormSection>

            <FormSection
                heading="A5E.AbilityCheckBonusGlobal"
                hint="This bonus is added to all ability check modifiers, including skill modifiers. This field accepts any values valid in roll formulae."
                --direction="column"
            >
                <input
                    class="a5e-input"
                    type="text"
                    value={$actor.system.bonuses.abilities.check}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            "system.bonuses.abilities.check",
                            target.value
                        )}
                />
            </FormSection>
        </div>

        <!-- Saving Throw Config  -->
    {:else if currentTab.name === "savingThrow"}
        <div class="u-flex u-flex-col u-gap-md">
            <FormSection>
                <Checkbox
                    label="A5E.ProficiencyProficient"
                    checked={ability.save.proficient}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $actor,
                            `system.abilities.${abilityKey}.save.proficient`,
                            detail
                        );
                    }}
                />
            </FormSection>

            <FormSection heading="A5E.ExpertiseDie">
                <ExpertiseDiePicker
                    selected={ability?.save.expertiseDice}
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
                --direction="column"
            >
                <input
                    class="a5e-input"
                    type="text"
                    value={ability.save.bonus}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            `system.abilities.${abilityKey}.save.bonus`,
                            target.value
                        )}
                />
            </FormSection>

            {#if abilityKey === "con"}
                <FormSection
                    heading="A5E.ConcentrationCheckBonus"
                    hint="This field accepts any values valid in roll formulae."
                    --direction="column"
                >
                    <input
                        class="a5e-input"
                        type="text"
                        value={ability.save?.concentrationBonus ?? 0}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                "system.abilities.con.save.concentrationBonus",
                                target.value
                            )}
                    />
                </FormSection>
            {/if}

            <FormSection
                heading="A5E.SavingThrowBonusGlobal"
                hint="This bonus is added to all saving throw modifiers. This field accepts any values valid in roll formulae."
                --direction="column"
            >
                <input
                    class="a5e-input"
                    type="text"
                    value={$actor.system.bonuses.abilities.save}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            "system.bonuses.abilities.save",
                            target.value
                        )}
                />
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
