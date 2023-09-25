<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "#runtime/svelte/component/core";
    import { getContext, setContext } from "svelte";

    import CompendiumItemList from "../components/CompendiumItemList.svelte";

    export let { document, sheet } = getContext("#external").application;
    export let elementRoot;

    console.log(document);
</script>

<ApplicationShell bind:elementRoot>
    <CompendiumItemList
        documents={[...document.index]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((document) => document.uuid)}
        compendiumType="spell"
    />
</ApplicationShell>
