<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import FormSection from "../components/FormSection.svelte";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let { actorDocument, appId } = getContext("#external").application;

    const actor = new TJSDocument(actorDocument);

    const headings = {
        burrow: "A5E.MovementBurrowingSpeed",
        climb: "A5E.MovementClimbingSpeed",
        fly: "A5E.MovementFlyingSpeed",
        swim: "A5E.MovementSwimmingSpeed",
        walk: "A5E.MovementWalkingSpeed",
    };
</script>

<article>
    <!-- TODO: Maybe make distance a number? -->
    {#each Object.entries($actor.system.attributes.movement) as [mode, distance]}
        {#if mode != "traits"}
            <FormSection heading={headings[mode]} inline={true}>
                <div class="u-w-20">
                    <input
                        class="a5e-input"
                        type="number"
                        name={`system.attributes.movement.${mode}`}
                        value={distance || 0}
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
        {/if}
    {/each}
    <FormSection heading="A5E.MovementHover" inline={true}>
        <div class="u-w-20">
            <input
                class="u-pointer"
                type="checkbox"
                name="system.attributes.movement.traits.hover"
                checked={$actor.system.attributes.movement.traits.hover}
                on:change={({ target }) => {
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.checked
                    );
                }}
            />
        </div>
    </FormSection>
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
