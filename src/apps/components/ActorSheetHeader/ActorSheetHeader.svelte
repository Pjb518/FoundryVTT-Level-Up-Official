<script>
    import { getContext } from "svelte";

    import AbilityScores from "./AbilityScores.svelte";
    import CharacterShields from "./CharacterShields.svelte";
    import NpcShields from "./NpcShields.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");
</script>

<header class="sheet-header">
    <section class="sheet-header-top">
        <section class="sheet-header-top-left">
            <input
                type="text"
                name="name"
                value={$actor.name}
                class="a5e-input a5e-input--character-name"
                placeholder="Name"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value
                    )}
            />
        </section>

        {#if $actor.type === "character"}
            <section>
                <CharacterShields />
            </section>
        {:else}
            <section>
                <NpcShields />
            </section>
        {/if}
    </section>

    <AbilityScores />
</header>

<style>
    .sheet-header {
        display: flex;
        flex-direction: column;
        height: fit-content;
        gap: 0.5rem;
    }

    .sheet-header-top {
        display: flex;
        width: 100%;
        gap: 0.5rem;
    }

    .sheet-header-top-left {
        display: flex;
        flex-grow: 1;
        align-items: center;
        margin-left: 0.125rem;
    }
</style>
