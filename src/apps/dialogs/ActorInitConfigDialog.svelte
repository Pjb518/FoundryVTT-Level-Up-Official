<script>
    import { getContext } from "svelte";

    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import prepareAbilityOptions from "../dataPreparationHelpers/prepareAbilityOptions";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { document, appId } = getContext("#external").application;

    const actor = document;
    const abilityOptions = prepareAbilityOptions();

    $: initiative = $actor.system.attributes.initiative;
</script>

<article>
    <div class="u-flex u-flex-col u-gap-md">
        <FormSection heading="A5E.AbilityScore">
            <RadioGroup
                optionStyles="min-width:2rem; text-align: center;"
                options={abilityOptions}
                selected={$actor.system.attributes.initiative.ability}
                allowDeselect={false}
                on:updateSelection={(event) =>
                    updateDocumentDataFromField(
                        $actor,
                        "system.attributes.initiative.ability",
                        event.detail,
                    )}
            />
        </FormSection>

        <ExpertiseDiePicker
            selected={initiative.expertiseDice}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $actor,
                    `system.attributes.initiative.expertiseDice`,
                    event.detail,
                )}
        />

        <FormSection
            heading="A5E.InitiativeBonus"
            hint="This field accepts any values valid in roll formulae."
        >
            <div class="u-w-full">
                <input
                    class="a5e-input"
                    type="text"
                    name="system.attributes.initiative.bonus"
                    value={initiative.bonus}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value,
                        )}
                />
            </div>
        </FormSection>
    </div>
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
