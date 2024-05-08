<svelte:options accessors={true} />

<script lang="ts">
    import { getContext } from "svelte";

    import RadioGroup from "../components/RadioGroup.svelte";

    export let { dialog, tab, defaultSelection } =
        // @ts-ignore
        getContext("#external").application;

    const TYPES = {
        inventory: "object",
        maneuvers: "maneuver",
        spells: "spell",
    };

    const compendiumType = TYPES[tab];

    function getCompendiums() {
        const packs: string[][] = [];
        // @ts-ignore
        game.packs.forEach((pack) => {
            const id = pack.metadata.id || pack.collection;
            if (!id) return;

            if (pack.metadata.type !== "Item") return;

            const indexTypes: string[] = [...pack.index]
                .map((index) => index.type)
                .filter(Boolean);
            if (!indexTypes.every((type: string) => compendiumType === type))
                return;

            packs.push([id, pack.metadata.label]);
        });

        return packs;
    }

    function onSubmit() {
        // @ts-ignore
        game.settings.set(
            "a5e",
            "hideActorCompendiumSelectionDialog",
            hideSelectionDialog,
        );

        dialog.submit({ pack: selected });
    }

    const selections = getCompendiums();
    let selected = defaultSelection;
    // @ts-ignore
    let hideSelectionDialog = game.settings.get(
        "a5e",
        "hideActorCompendiumSelectionDialog",
    );
</script>

<article>
    <RadioGroup
        options={selections}
        {selected}
        on:updateSelection={({ detail }) => (selected = detail)}
    />

    <button on:click|preventDefault={onSubmit}> Submit </button>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        padding: 0.75rem;
        gap: 1rem;
        background: $color-sheet-background;
    }
</style>
