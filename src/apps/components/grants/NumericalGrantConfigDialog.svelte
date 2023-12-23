<script>
    import { getContext, onDestroy } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store/fvtt/document";

    import FormSection from "../FormSection.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";

    export let { document, heading, configObject, grantId } =
        getContext("#external").application;

    const item = new TJSDocument(document);

    onDestroy(() => {
        item.destroy();
    });
</script>

<article></article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
    }
</style>
