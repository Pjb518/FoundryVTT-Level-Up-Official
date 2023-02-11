<script>
    import { getContext } from "svelte";

    export let abilityLabel;

    const actor = getContext("actor");
</script>

<li class="container">
    <slot />

    {#if !($actor.flags?.a5e?.sheetIsLocked ?? true)}
        <button
            on:click={$actor.configureAbilityScore(abilityLabel)}
            class="fas fa-gear a5e-button--edit-config"
        />
    {/if}
</li>

<style lang="scss">
    .container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        color: #f6f2eb;
        font-family: "Modesto Condensed", serif;
        border-radius: 3px;
        gap: 0.25rem;
        overflow: hidden;
    }

    .a5e-button--edit-config {
        top: 0.25rem;
        right: 0.25rem;
    }
</style>
