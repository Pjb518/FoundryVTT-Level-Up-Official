<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import prepareExpertiseDiceOptions from "../handlers/prepareExpertiseDiceOptions";
    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let { actorDocument, appId } = getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const expertiseDieOptions = prepareExpertiseDiceOptions();

    $: initiative = $actor.system.attributes.initiative;
</script>

<main>
    <div class="u-flex u-flex-col u-gap-md">
        <FormSection heading="A5E.ExpertiseDie">
            <RadioGroup
                listClasses="a5e-radio-group--expertise u-gap-md u-mb-md u-text-sm"
                optionClasses="u-p-md u-text-center u-w-12"
                options={expertiseDieOptions}
                selected={initiative.expertiseDice}
                name={`system.attributes.initiative.expertiseDice`}
                document={actor}
            />
        </FormSection>

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
