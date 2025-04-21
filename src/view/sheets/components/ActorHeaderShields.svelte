<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    let actor: any = getContext("actor");
    let actorStore = $derived(actor.reactive);

    let levelSource = "";
    let characterLevel = 1;
    let levelIsLocked = false;
</script>

<div class="a5e-actor-header-shields__container">
    {#if actorStore.type === "npc"}
        <!-- Inspiration -->
        <div class="a5e-actor-details-box">
            <label
                for="{actor.id}-inspiration"
                class="a5e-actor-details-box__label"
            >
                {localize("A5E.Inspiration")}
            </label>

            <button
                class="a5e-actor-details-box__button"
                aria-labelledby="Insipiration"
            >
                <i class="fa-solid fa-dice-d20"></i>
            </button>
        </div>
    {/if}

    {#if actorStore.type === "npc"}{/if}

    {#if actorStore.type === "npc"}
        <!-- Level -->
        <div class="a5e-actor-details-box">
            <label for="{actor.id}-level"> Level </label>

            <input
                id="{actor.id}-level"
                class="a5e-actor-details-bpx__input"
                class:a5e-disable-pointer-events={!actor.isOwner}
                data-tooltip={levelSource}
                data-tooltip-direction="DOWN"
                type="number"
                value={characterLevel}
                placeholder="0"
                min="0"
                disabled={levelIsLocked}
                onchange={({ target }) =>
                    updateDocumentDataFromField(
                        actor,
                        "system.details.level",
                        Number(target?.value),
                    )}
            />
        </div>
    {/if}

    {#if actorStore.type === "npc"}
        <!-- Proficiency -->
        <div class="a5e-actor-details-box">
            <label for="{actor.id}-prof" class="a5e-actor-details-box__label">
                Prof.
            </label>

            <input
                id="{actor.id}-prof"
                class="a5e-actor-details-box__input"
                type="number"
                value={actorStore.system.attributes.prof}
                placeholder="0"
                min="0"
                disabled
            />
        </div>
    {/if}

    {#if actorStore.type === "npc"}
        <!-- XP -->
    {/if}
</div>

<style lang="scss">
    .a5e-actor-header-shields {
        &__container {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            border-radius: 4px;
            height: 100%;
            font-family: var(--a5e-condensed-font);
        }
    }
</style>
