<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import prepareExpertiseDiceOptions from "../handlers/prepareExpertiseDiceOptions";

    export let { actor, label } = getContext("external").application;

    const heading = CONFIG.A5E.abilities[label];
    const expertiseDieOptions = prepareExpertiseDiceOptions();

    $: ability = $actor.system.abilities[label];
</script>

<div class="u-flex u-flex-col u-gap-md">
    <FormSection heading="A5E.ExpertiseDie">
        <RadioGroup
            options={expertiseDieOptions}
            selected={ability.check.expertiseDice}
            name={`system.abilities.${label}.check.expertiseDice`}
            document={actor}
        />
    </FormSection>
</div>
