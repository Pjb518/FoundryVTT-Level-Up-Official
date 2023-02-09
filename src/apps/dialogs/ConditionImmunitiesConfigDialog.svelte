<script>
    import { getContext } from "svelte";

    import CustomTagGroup from "../components/CustomTagGroup.svelte";

    export let { actor, appId } = getContext("#external").application;

    const systemImmunities = Object.entries(CONFIG.A5E.conditions);
    $: actorImmunities = $actor.system.traits.conditionImmunities;
</script>

<main>
    <CustomTagGroup
        heading="A5E.ConditionImmunities"
        options={systemImmunities}
        selected={actorImmunities}
        name="system.traits.conditionImmunities"
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
