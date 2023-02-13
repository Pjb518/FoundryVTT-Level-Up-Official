<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    export let { actorDocument, appId } = getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const creatureSizes = Object.entries(CONFIG.A5E.actorSizes);
</script>

<article>
    <FormSection heading="A5E.SizeCategory">
        <RadioGroup
            options={creatureSizes}
            selected={$actor.system.traits.size}
            name="system.traits.size"
            document={actor}
        />
    </FormSection>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 0.5rem;
        overflow: auto;
        background: rgba(246, 242, 235, 0.5);
    }
</style>
