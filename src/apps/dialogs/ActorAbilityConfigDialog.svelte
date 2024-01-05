<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import Checkbox from "../components/Checkbox.svelte";
    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";
    import Section from "../components/Section.svelte";

    import createNote from "../handlers/createNote";
    import editNote from "../handlers/editNote";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { document, appId, abilityKey } =
        getContext("#external").application;

    function updateCurrentTab(event) {
        currentTab = tabs[event.detail];
    }

    const actor = document;
    const hideExpertiseDice = game.settings.get("a5e", "hideExpertiseDice");

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

    let currentTab = hideExpertiseDice ? tabs[1] : tabs[0];

    $: ability = $actor.system.abilities[abilityKey];
</script>

<article>
    {#if !hideExpertiseDice}
        <NavigationBar {currentTab} {tabs} on:tab-change={updateCurrentTab} />
    {/if}

    <!-- Ability Check Config -->
    {#if currentTab.name === "abilityCheck"}
        <Section --a5e-section-body-padding="0 0.25rem">
            <ExpertiseDiePicker
                selected={ability?.check.expertiseDice}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $actor,
                        `system.abilities.${abilityKey}.check.expertiseDice`,
                        detail,
                    )}
            />

            <!-- <header class="notes-header">
                <h3 class="notes-heading">Notes</h3>

                <button
                    class="add-button fa-solid fa-plus"
                    on:click={() =>
                        createNote($actor, "abilityCheck", abilityKey)}
                ></button>
            </header>

            <ul class="notes-list">
                {#each Object.entries(ability.check.notes) as [id, note]}
                    <li class="notes-list__note">
                        {note.title || "New Note"}

                        <button
                            class="edit-button fa-solid fa-pen-to-square"
                            on:click={() =>
                                editNote(
                                    $actor,
                                    "abilityCheck",
                                    abilityKey,
                                    id,
                                )}
                        ></button>
                    </li>
                {:else}
                    <p>None</p>
                {/each}
            </ul> -->
        </Section>

        <!-- Saving Throw Config  -->
    {:else if currentTab.name === "savingThrow"}
        <Section
            --a5e-section-body-padding="0 0.25rem"
            --a5e-section-body-gap="0.75rem"
        >
            <FieldWrapper
                hint="Determines whether to add this actor's proficiency bonus to its saving throws"
            >
                <Checkbox
                    label="A5E.ProficiencyProficient"
                    checked={ability.save.proficient}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $actor,
                            `system.abilities.${abilityKey}.save.proficient`,
                            detail,
                        );
                    }}
                />
            </FieldWrapper>

            <ExpertiseDiePicker
                selected={ability?.save.expertiseDice}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $actor,
                        `system.abilities.${abilityKey}.save.expertiseDice`,
                        detail,
                    )}
            />

            {#if abilityKey === "con"}
                <FieldWrapper
                    heading="A5E.ConcentrationCheckBonus"
                    hint="This field accepts any values valid in roll formulae."
                >
                    <input
                        class="a5e-input"
                        type="text"
                        value={ability.save?.concentrationBonus ?? 0}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                "system.abilities.con.save.concentrationBonus",
                                target.value,
                            )}
                    />
                </FieldWrapper>
            {/if}

            <!-- <header class="notes-header">
                <h3 class="notes-heading">Notes</h3>

                <button
                    class="add-button fa-solid fa-plus"
                    on:click={() =>
                        createNote($actor, "savingThrow", abilityKey)}
                ></button>
            </header>

            <ul class="notes-list">
                {#each Object.entries(ability.save.notes) as [id, note]}
                    <li class="notes-list__note">
                        {note.title || "New Note"}

                        <button
                            class="edit-button fa-solid fa-pen-to-square"
                            on:click={() =>
                                editNote($actor, "savingThrow", abilityKey, id)}
                        ></button>
                    </li>
                {:else}
                    <p>None</p>
                {/each}
            </ul> -->
        </Section>
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
        background: $color-sheet-background;
    }
</style>
