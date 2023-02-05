<script>
    import { getContext } from "svelte";

    import CustomTagGroup from "../components/CustomTagGroup.svelte";

    export let { actor, appId } = getContext("external").application;

    const defaultProficiencies = Object.entries(CONFIG.A5E.armorPlural);
    $: actorProficiencies = $actor.system.proficiencies.armor;
</script>

<main>
    <CustomTagGroup
        heading="A5E.ArmorProficiencies"
        options={defaultProficiencies}
        selected={actorProficiencies}
        name="system.proficiencies.armor"
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
