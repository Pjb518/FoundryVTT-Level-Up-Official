<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import Checkbox from "../components/Checkbox.svelte";
    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FormSection from "../components/FormSection.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";

    import createNote from "../handlers/createNote";
    import editNote from "../handlers/editNote";
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
                            detail,
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
                            target.value,
                        )}
                />
            </FormSection>

            <header class="notes-header">
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
            </ul>
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
                            detail,
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
                            detail,
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
                            target.value,
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
                                target.value,
                            )}
                    />
                </FormSection>
            {/if}

            <header class="notes-header">
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
            </ul>
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
        background: $color-sheet-background;
    }

    .add-button,
    .edit-button {
        width: fit-content;
        min-width: 1.5rem;
        padding: 0.25rem;
        line-height: 1;
        background: transparent;
        text-align: center;
    }

    .notes-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 0.125rem;
        border-bottom: 1px solid #ccc;
    }

    .notes-heading {
        font-size: 1rem;
        font-weight: bold;
    }

    .notes-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin: 0;
        padding: 0;
        list-style: none;

        &__note {
            display: flex;
            justify-content: space-between;
        }
    }
</style>
