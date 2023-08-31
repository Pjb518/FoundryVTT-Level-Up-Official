<script>
    import { createEventDispatcher } from "svelte";
    import { TJSIconButton } from "#standard/component";

    const dispatch = createEventDispatcher();
</script>

<TJSIconButton
    title="Show Description"
    icon="fas fa-info-circle"
    onPress={() => dispatch("updateSelection")}
    --tjs-icon-button-background-hover="none"
    --tjs-icon-button-background-focus="none"
    --tjs-icon-button-background-focus-visible="none"
    --tjs-icon-button-background-selected="none"
    --tjs-icon-button-text-shadow-hover="none"
    --tjs-icon-button-text-shadow-focus="none"
    --tjs-icon-button-transition="$standard-transition"
    --tjs-icon-button-diameter="1rem"
    --tjs-icon-button-border-radius="0"
/>
