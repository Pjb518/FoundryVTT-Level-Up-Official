<script lang="ts">
    import Checkbox from "#view/snippets/Checkbox.svelte";
    import ExpertiseDiePicker from "#view/snippets/ExpertiseDiePicker.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    type Props = {
        document: any;
        abilityKey: string;
    };

    let { document, abilityKey }: Props = $props();

    let actor = document;
    const hideExpertiseDice = game.settings.get(
        "a5e",
        "hideExpertiseDice",
    ) as boolean;

    let ability = $derived(actor.reactive.system.abilities[abilityKey]);
</script>

<article>
    <!-- Ability Check Config -->
    {#if !hideExpertiseDice}
        <Section heading="Ability Check Configuration">
            <ExpertiseDiePicker
                selected={actor.reactive._source.system.abilities[abilityKey]
                    ?.check?.expertiseDice}
                type={actor.type}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(
                        actor,
                        `system.abilities.${abilityKey}.check.expertiseDice`,
                        value,
                    )}
            />
        </Section>
    {/if}

    <Section
        heading="Saving Throw Configuration"
        --a5e-section-body-gap="0.75rem"
    >
        <FieldWrapper
            hint="Determines whether to add this actor's proficiency bonus to its saving throws"
        >
            <Checkbox
                label="A5E.proficiency.proficient"
                checked={ability.save.proficient}
                onUpdateSelection={(value) => {
                    updateDocumentDataFromField(
                        actor,
                        `system.abilities.${abilityKey}.save.proficient`,
                        value,
                    );
                }}
            />
        </FieldWrapper>

        {#if !hideExpertiseDice}
            <ExpertiseDiePicker
                selected={actor.reactive._source.system.abilities[abilityKey]
                    ?.save?.expertiseDice}
                type={actor.type}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(
                        actor,
                        `system.abilities.${abilityKey}.save.expertiseDice`,
                        value,
                    )}
            />
        {/if}

        {#if abilityKey === "con"}
            <FieldWrapper
                heading="A5E.bonuses.labels.concentration.sectionHeader"
                hint="This field accepts any values valid in roll formulae."
            >
                <input
                    class="a5e-input a5e-input--slim"
                    type="text"
                    value={ability.save?.concentrationBonus ?? 0}
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            actor,
                            "system.abilities.con.save.concentrationBonus",
                            currentTarget.value,
                        )}
                />
            </FieldWrapper>
        {/if}
    </Section>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 1rem;
        overflow: auto;
    }
</style>
