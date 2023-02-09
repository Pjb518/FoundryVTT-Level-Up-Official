<script>
    import { getContext } from "svelte";

    import CustomTagGroup from "../components/CustomTagGroup.svelte";

    export let { actor, appId } = getContext("#external").application;

    const systemDamageTypes = Object.entries(CONFIG.A5E.damageTypes);
    $: actorVulnerabilities = $actor.system.traits.damageVulnerabilities;
</script>

<main>
    <CustomTagGroup
        heading="A5E.DamageTypePlural"
        options={systemDamageTypes}
        selected={actorVulnerabilities}
        name="system.traits.damageVulnerabilities"
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
