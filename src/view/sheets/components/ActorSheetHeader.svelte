<script lang="ts">
    import { getContext } from "svelte";

    import ActorHeaderShields from "./ActorHeaderShields.svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    let actor: any = getContext("actor");
    let actorStore = $derived(actor.reactive);
</script>

<header class="actor-sheet-header">
    <section class="actor-sheet-header-top">
        <section class="actor-sheet-header-top-left">
            <input
                type="text"
                value={actorStore.name}
                class="a5e-input a5e-input--character-name"
                class:disable-pointer-events={!actor.isOwner}
                placeholder="Name"
                spellcheck="false"
                autocomplete="off"
                onchange={({ target }) =>
                    updateDocumentDataFromField(actor, "name", target?.value)}
            />
        </section>

        <ActorHeaderShields />
    </section>
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

        &-top {
            display: flex;
            width: 100%;
            gap: 0.5rem;
        }
    }
</style>
