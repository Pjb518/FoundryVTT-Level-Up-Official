<script>
    import { getContext } from "svelte";

    import CustomTagGroup from "../components/CustomTagGroup.svelte";

    export let { actor, appId } = getContext("external").application;

    const systemDamageTypes = Object.entries(CONFIG.A5E.damageTypes);
    $: actorImmunities = $actor.system.traits.damageImmunities;
</script>

<main>
    <CustomTagGroup
        heading="A5E.DamageTypePlural"
        options={systemDamageTypes}
        selected={actorImmunities}
        name="system.traits.damageImmunities"
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
