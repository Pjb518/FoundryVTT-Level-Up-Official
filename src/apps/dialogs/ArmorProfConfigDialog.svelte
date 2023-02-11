<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import CustomTagGroup from "../components/CustomTagGroup.svelte";

    export let { actorDocument, appId } = getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const defaultProficiencies = Object.entries(CONFIG.A5E.armorPlural);
</script>

<main>
    <CustomTagGroup
        heading="A5E.ArmorProficiencies"
        options={defaultProficiencies}
        selected={$actor.system.proficiencies.armor}
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
