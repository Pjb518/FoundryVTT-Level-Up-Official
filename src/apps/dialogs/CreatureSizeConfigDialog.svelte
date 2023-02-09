<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    export let { actor, appId } = getContext("#external").application;

    const creatureSizes = Object.entries(CONFIG.A5E.actorSizes);
</script>

<main>
    <FormSection heading="A5E.SizeCategory">
        <RadioGroup
            options={creatureSizes}
            selected={$actor.system.traits.size}
            name="system.traits.size"
            document={actor}
        />
    </FormSection>
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
