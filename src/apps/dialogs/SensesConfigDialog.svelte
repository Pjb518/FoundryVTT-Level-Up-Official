<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import FormSection from "../components/FormSection.svelte";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let { actor, appId } = getContext("external").application;

    const headings = {
        blindsight: "A5E.SenseBlindsightRange",
        darkvision: "A5E.SenseDarkvisionRange",
        tremorsense: "A5E.SenseTremorsenseRange",
        truesight: "A5E.SenseTruesightRange",
    };

    $: senses = $actor.system.attributes.senses;
</script>

<main>
    <header class="u-px-lg u-py-xl">
        <h1 class="u-font-serif u-text-xl">
            {localize("A5E.SensesConfigurationPrompt")}
        </h1>
    </header>

    <!-- TODO: Possible conversion to number -->
    {#each Object.entries(senses) as [sense, distance]}
        <FormSection heading={headings[sense]} inline={true}>
            <div class="u-w-20">
                <input
                    class="a5e-input"
                    type="text"
                    name={`system.attributes.senses.${sense}`}
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
