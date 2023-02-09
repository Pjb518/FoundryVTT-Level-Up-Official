<script>
    import { getContext } from "svelte";

    import CustomTagGroup from "../components/CustomTagGroup.svelte";

    export let { actor, appId } = getContext("#external").application;

    const systemTypes = Object.entries(CONFIG.A5E.creatureTypes);
    $: actorTypes = $actor.system.details.creatureTypes;
</script>

<main>
    <CustomTagGroup
        heading="A5E.CreatureTypePlural"
        options={systemTypes}
        selected={actorTypes}
        name="system.details.creatureTypes"
        document={actor}
    />
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
