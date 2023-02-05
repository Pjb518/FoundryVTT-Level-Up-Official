<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import prepareExpertiseDiceOptions from "../handlers/prepareExpertiseDiceOptions";
    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let { actor, appId } = getContext("external").application;

    const expertiseDieOptions = prepareExpertiseDiceOptions();

    $: initiative = $actor.system.attributes.initiative;
</script>

<main>
    <header class="u-px-lg u-py-xl">
        <h1 class="u-font-serif u-text-xl">
            {localize("A5E.InitiativeConfigurationTitle")}
        </h1>
    </header>

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
