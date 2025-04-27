<script lang="ts">
    import { getContext } from "svelte";

    import ActorHeaderShields from "./ActorHeaderShields.svelte";
    import AbilityScores from "./AbilityScores.svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    let actor: any = getContext("actor");
    let actorStore = $derived(actor.reactive.system);

    let name = $derived(actor.reactive.name);
</script>

<header class="actor-sheet-header">
    <section class="actor-sheet-header-top">
        <section class="actor-sheet-header-top-left">
            <input
                type="text"
                value={name}
                class="a5e-input a5e-input--character-name"
                class:disable-pointer-events={!actor.isOwner}
                placeholder="Name"
                spellcheck="false"
                autocomplete="off"
                onchange={({ target }) =>
                    // @ts-ignore
                    updateDocumentDataFromField(actor, "name", target?.value)}
            />
        </section>

        <ActorHeaderShields />
    </section>

    <AbilityScores />
</header>

<style lang="scss">
    .disable.pointer-events {
        pointer-events: none;
    }

    .actor-sheet-header {
        display: flex;
        flex-direction: column;
        height: fit-content;
        gap: 0.5rem;
        margin-block: 0.5rem;
        margin-inline: 0.25rem;

        &-top {
            display: flex;
            justify-content: space-between;
            width: 100%;
            gap: 0.5rem;
        }

        &-top-left {
            display: flex;
            flex-grow: 1;
            align-items: center;
            margin-left: 0.25rem;
        }
    }
</style>
