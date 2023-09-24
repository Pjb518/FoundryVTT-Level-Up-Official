<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "#runtime/svelte/component/core";

    import NavigationBar from "../components/navigation/NavigationBar.svelte";
    import PremiumContentListIntroduction from "./PremiumContentListIntroduction.svelte";

    export let elementRoot;

    function getCurrentTabComponent({ name }) {
        switch (name) {
            case "intro":
                return PremiumContentListIntroduction;
            // case "singleDocuments":
            //     return InstructionsDialogIndividual;
            // case "multipleDocuments":
            //     return InstructionsDialogMany;
            // case "compendia":
            //     return InstructionsDialogCompendia;
            // case "v10":
            //     return InstructionsDialogV10;
            // default:
            //     return InstructionsDialogIntro;
        }
    }

    const tabs = [
        { name: "intro", label: "Introduction" },
        // { name: "singleDocuments", label: "Single Documents" },
        // { name: "multipleDocuments", label: "Multiple Documents" },
        // { name: "compendia", label: "Compendium Packs" },
        // { name: "v10", label: "V10" },
    ];

    let currentTab = tabs[0];
</script>

<ApplicationShell bind:elementRoot>
    <NavigationBar
        {currentTab}
        {tabs}
        on:change-tab={({ detail }) => (currentTab = tabs[detail])}
    />

    <article>
        <svelte:component
            this={getCurrentTabComponent(currentTab)}
            on:change-tab={({ detail }) => (currentTab = tabs[detail])}
        />
    </article>
</ApplicationShell>

<style lang="scss">
    :global(.a5e-premium-content-list-dialog) {
        min-width: 400px;
        min-height: 500px;
        max-height: 90vh;
    }

    :global(.a5e-premium-content-list-dialog .window-content) {
        padding: 0.5rem;
    }

    article {
        height: 100%;
        overflow: auto;
    }
</style>
