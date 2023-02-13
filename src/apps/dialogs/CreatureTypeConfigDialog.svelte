<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import CustomTagGroup from "../components/CustomTagGroup.svelte";

    export let { actorDocument, appId } = getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const systemTypes = Object.entries(CONFIG.A5E.creatureTypes);
</script>

<article>
    <CustomTagGroup
        heading="A5E.CreatureTypePlural"
        options={systemTypes}
        selected={$actor.system.details.creatureTypes}
        name="system.details.creatureTypes"
        document={actor}
    />
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
