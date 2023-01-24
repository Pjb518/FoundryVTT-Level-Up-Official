<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import FormSection from "../components/FormSection.svelte";
    import NavigationBar from "../components/navigation/NavigationBar.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import prepareExpertiseDiceOptions from "../handlers/prepareExpertiseDiceOptions";
    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let { actor, appId } = getContext("external").application;

    const headings = {
        burrow: "A5E.MovementBurrowingSpeed",
        climb: "A5E.MovementClimbingSpeed",
        fly: "A5E.MovementFlyingSpeed",
        swim: "A5E.MovementSwimmingSpeed",
        walk: "A5E.MovementWalkingSpeed",
    };

    $: movement = $actor.system.attributes.movement;
</script>

<main>
    <header class="u-px-lg u-py-xl">
        <h1 class="u-font-serif u-text-xl">
            {localize("A5E.MovementConfigurationPrompt")}
        </h1>
    </header>

    <!-- TODO: Maybe make distance a number? -->
    {#each Object.entries(movement) as [mode, distance]}
        <FormSection heading={headings[mode]} inline={true}>
            <div class="u-w-20">
                <input
                    class="a5e-input"
                    type="text"
                    name={`system.attributes.movement.${mode}`}
                    value={distance || ""}
                    on:change={({ target }) => {
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        );
                    }}
                />
            </div>
        </FormSection>
    {/each}
</main>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
        overflow: auto;
        background: rgba(246, 242, 235, 0.5);
    }
</style>
