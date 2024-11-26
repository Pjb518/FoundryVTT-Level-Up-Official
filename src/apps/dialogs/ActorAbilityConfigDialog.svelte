<script>
    import { getContext } from "svelte";

    import Checkbox from "../components/Checkbox.svelte";
    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import Section from "../components/Section.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { document, appId, abilityKey } = getContext("#external").application;

    const actor = document;
    const hideExpertiseDice = game.settings.get("a5e", "hideExpertiseDice");

    $: ability = $actor.system.abilities[abilityKey];
</script>

<article>
    <!-- Ability Check Config -->
	<Section heading="Ability Check Configuration">
    		{#if !hideExpertiseDice}
           		 <ExpertiseDiePicker
                		selected={$actor._source.system.abilities[abilityKey]?.check
                    		?.expertiseDice}
                		type={$actor.type}
                		on:updateSelection={({ detail }) =>
                    			updateDocumentDataFromField(
                        			$actor,
                        			`system.abilities.${abilityKey}.check.expertiseDice`,
                        			detail,
                    		)}
           		/>
		{/if}

        	<FieldWrapper heading="A5E.MinimumD20Roll" --direction="column">
            		<div class="u-w-20">
                	<input
                    		class="a5e-input"
                    		type="number"
                    		value={$actor._source.system.abilities[abilityKey]?.check?.minRoll}
                    		min="0"
                    		on:change={({ target }) =>
                       			updateDocumentDataFromField(
                            			$actor,
                            			`system.abilities.${abilityKey}.check.minRoll`,
                            			Number(target.value),
                        		)}
                	/>
            		</div>
        	</FieldWrapper>
        </Section>

    <Section heading="Saving Throw Configuration" --a5e-section-body-gap="0.75rem">
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

        {#if !hideExpertiseDice}
            <ExpertiseDiePicker
                selected={$actor._source.system.abilities[abilityKey]?.save
                    ?.expertiseDice}
                type={$actor.type}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $actor,
                        `system.abilities.${abilityKey}.save.expertiseDice`,
                        detail,
                    )}
            />
        {/if}

        <FieldWrapper heading="A5E.MinimumD20Roll" --direction="column">
            	<div class="u-w-20">
                <input
                    	class="a5e-input"
                    	type="number"
                    	value={$actor._source.system.abilities[abilityKey]?.save?.minRoll}
                    	min="0"
                    	on:change={({ target }) =>
                       		updateDocumentDataFromField(
                            		$actor,
                            		`system.abilities.${abilityKey}.save.minRoll`,
                            		Number(target.value),
                        	)}
                />
            	</div>
        </FieldWrapper>
    </Section>

	{#if abilityKey === "con"}
	   <Section heading="Concentration Check Configuration" --a5e-section-body-gap="0.75rem">
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

        	<FieldWrapper heading="A5E.MinimumD20Roll" --direction="column">
            		<div class="u-w-20">
                	<input
                    		class="a5e-input"
                    		type="number"
                    		value={$actor._source.system.abilities[abilityKey]?.save?.concentrationMinRoll}
                    		min="0"
                    		on:change={({ target }) =>
                       			updateDocumentDataFromField(
                            			$actor,
                            			`system.abilities.${abilityKey}.save.concentrationMinRoll`,
                            			Number(target.value),
                        		)}
                	/>
            		</div>
        	</FieldWrapper>
    	   </Section>
        {/if}
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 1rem;
        overflow: auto;
        background: var(--a5e-color-background-sheet);
    }
</style>
