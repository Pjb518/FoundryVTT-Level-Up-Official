<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import FormSection from "../components/FormSection.svelte";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let { actorDocument, appId } = getContext("#external").application;

    const actor = new TJSDocument(actorDocument);

    const headings = {
        blindsight: "A5E.SenseBlindsightRange",
        darkvision: "A5E.SenseDarkvisionRange",
        tremorsense: "A5E.SenseTremorsenseRange",
        truesight: "A5E.SenseTruesightRange",
    };
</script>

<article>
    <!-- TODO: Possible conversion to number -->
    {#each Object.entries($actor.system.attributes.senses) as [sense, distance]}
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
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
        overflow: auto;
        background: rgba(246, 242, 235, 0.5);
    }
</style>
