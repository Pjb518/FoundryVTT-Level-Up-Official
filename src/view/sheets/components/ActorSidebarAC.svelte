<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    let actor = getContext("actor");
    let sheetIsLocked: boolean = getContext("sheetIsLocked");
    let actorStore = $derived(actor.reactive);
</script>

<div class="a5e-actor-sidebar__tracker-container">
    <button class="a5e-button a5e-button--transparent" aria-labelledby="AC">
        <i class="fa-solid fa-person-running"></i>
    </button>
</div>

<div class="a5e-actor-sidebar__tracker-container">
    <button class="a5e-button a5e-button--transparent" aria-labelledby="AC">
        <i class="fa-solid fa-brain"></i>
    </button>
</div>

<div class="a5e-actor-sidebar__tracker-container">
    <button class="a5e-button a5e-button--transparent" aria-labelledby="AC">
        <i class="fa-solid" class:fa-shield={sheetIsLocked}></i>
    </button>

    {actorStore.system.attributes.ac.value}
</div>

<style lang="scss">
    .a5e-actor-sidebar__tracker {
        &-container {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
    }
</style>
