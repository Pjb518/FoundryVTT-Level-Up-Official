<script>
    import { createEventDispatcher, getContext } from "svelte";

    const dispatch = createEventDispatcher();
</script>

<button
    class="sheet-lock fas fa-plus"
    on:click={() => dispatch("add-button-clicked")}
/>

<style lang="scss">
    .sheet-lock {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
        width: fit-content;
        padding: 0 0.125rem;
        margin-left: auto;
        font-size: $font-size-md;
        color: inherit;
        opacity: 0.85;
        background: transparent;
        cursor: pointer;

        // Nudge the button down 1px so that it _looks_ centred
        top: 1px;

        transition: $standard-transition;

        &:focus,
        &:hover {
            transform: scale(1.1);
            box-shadow: none;
        }
    }
</style>
