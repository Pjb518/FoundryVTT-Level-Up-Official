<script lang="ts">
    import { setContext } from "svelte";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";
    import AbilityScoresGeneration from "./components/AbilityScoresGeneration.svelte";
    import type { MancerDialog } from "./Mancer.svelte.ts";

    import { getSteps } from "./utils/mancerHelpers.ts";

    type Props = {
        actor: Character;
        dialog: MancerDialog;
        charOptions: Awaited<
            ReturnType<MancerDialog["_prepareContext"]>
        >["charOptions"];
    };

    function getCurrentComponent() {
        return (
            steps.find((s) => s.step === currentStep)?.component ??
            steps[0]?.component
        );
    }

    let { actor, dialog, charOptions } = $props();
    const steps = getSteps();

    let currentStep = $state(0);
    let currentComponent = $derived(getCurrentComponent());
    $inspect(currentComponent);

    setContext("actor", actor);
</script>

<main class="a5e-mancer">
    <header class="a5e-mancer__header">
        <input
            class="a5e-input"
            type="text"
            value={actor.reactive.name}
            onchange={({ currentTarget }) =>
                updateDocumentDataFromField(actor, "name", currentTarget.value)}
        />
    </header>

    <aside class="a5e-mancer__aside">
        <!-- We'll track the step we're on here -->
        <ul>
            {#each steps as { step, label }}
                {step}: {label}
            {/each}
        </ul>
    </aside>

    <article class="a5e-mancer__main">
        <AbilityScoresGeneration></AbilityScoresGeneration>
        <!--  -->
    </article>

    <footer class="a5e-mancer__footer"></footer>
</main>

<style lang="scss">
    .a5e-mancer {
        display: grid;
        grid-template-areas: "aside header" "aside main" "aside footer";
        grid-template-columns: 2fr 4fr;
        grid-template-rows: min-content minmax(0, 1fr) min-content;
        gap: var(--a5e-spacing-sm);
        height: 100%;

        &__aside {
            grid-area: aside;

            background: var(--a5e-actor-sheet-aside-background);
        }

        &__header {
            grid-area: header;
            padding: var(--a5e-spacing-md);
        }

        &__main {
            grid-area: main;

            padding: var(--a5e-spacing-md);
        }

        &__footer {
            grid-area: footer;
        }
    }
</style>
