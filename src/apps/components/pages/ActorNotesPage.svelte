<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import Editor from "../Editor.svelte";

    const actor = getContext("actor");

    let isGM = game.user.isGM;

    const tabs = {
        notes: {
            label: "A5E.TabNotes",
            display: !isGM,
        },
        bio: {
            label: "A5E.TabBiography",
            display: isGM && $actor.type === "npc",
        },
        privateNotes: {
            label: "A5E.DetailsNotesPrivate",
            display: isGM && $actor.type === "npc",
        },
    };

    let currentEditor = "notes";
</script>

<div class="notes-page">
    <section class="notes__container">
        {#if $actor.type === "npc"}
            <div class="notes__tabs">
                {#each Object.entries(tabs) as [name, { label, display }]}
                    {#if display || isGM}
                        <button
                            class="a5e-button"
                            class:active={currentEditor === name}
                            on:click={() => (currentEditor = name)}
                        >
                            {localize(label)}
                        </button>
                    {/if}
                {/each}
            </div>
        {/if}

        <Editor
            document={actor}
            content={$actor.system.details[currentEditor]}
            updatePath="system.details.{currentEditor}"
        />
    </section>
</div>

<style lang="scss">
    @import "../../../scss/base/variables";

    .notes-page {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 0.5rem;
        overflow: hidden;
    }

    .notes {
        &__container {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            gap: 0.5rem;
            overflow-y: auto;
        }

        &__tabs {
            display: flex;
            align-content: center;
            gap: 0.75rem;
            margin-bottom: 0.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #ccc;
        }
    }

    button {
        background: transparent;
        border: 1px solid #ccc;
        width: fit-content;
        padding-inline: 0.75rem;

        &:focus,
        &:hover {
            box-shadow: none;
        }
    }

    .active {
        background: $color-primary;
        border: 1px solid $color-primary;
        color: white;
    }
</style>
