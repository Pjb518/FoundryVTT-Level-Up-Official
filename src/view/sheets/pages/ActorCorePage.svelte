<script lang="ts">
    import { getContext } from "svelte";

    import ActorSkillsPage from "./ActorSkillsPage.svelte";

    let actor: any = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

    let actorStore = $derived(actor.reactive.system);
</script>

{#if actor.reactive.flags.a5e?.showFavoritesSection ?? true}
    <!--  -->
{:else}
    <ActorSkillsPage />
{/if}
