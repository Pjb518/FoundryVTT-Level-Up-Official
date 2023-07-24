<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FormSection from "../components/FormSection.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { actorDocument, appId } = getContext("#external").application;

    const actor = new TJSDocument(actorDocument);

    $: initiative = $actor.system.attributes.initiative;
</script>

<article>
    <div class="u-flex u-flex-col u-gap-md">
        <FormSection heading="A5E.ExpertiseDie">
            <ExpertiseDiePicker
                selected={initiative.expertiseDice}
                on:updateSelection={(event) =>
                    updateDocumentDataFromField(
                        $actor,
                        `system.attributes.initiative.expertiseDice`,
                        event.detail
                    )}
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
