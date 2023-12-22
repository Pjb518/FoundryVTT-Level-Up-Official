<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import Checkbox from "../components/Checkbox.svelte";
    import FormSection from "../components/FormSection.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { document, appId } = getContext("#external").application;

    const actor = new TJSDocument(document);
    const { A5E } = CONFIG;

    const headings = {
        burrow: "A5E.MovementBurrowingSpeed",
        climb: "A5E.MovementClimbingSpeed",
        fly: "A5E.MovementFlyingSpeed",
        swim: "A5E.MovementSwimmingSpeed",
        walk: "A5E.MovementWalkingSpeed",
    };
</script>

<article>
    {#each Object.entries($actor.system.attributes.movement) as [mode, movementData]}
        {#if mode != "traits"}
            <FormSection
                heading={headings[mode]}
                --item-alignment="center"
                --label-width="7.5rem"
            >
                <div class="u-w-20">
                    <input
                        class="a5e-input"
                        type="number"
                        name="system.attributes.movement.{mode}.distance"
                        value={movementData.distance || 0}
                        min="0"
                        on:change={({ target }) => {
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                Math.max(Number(target.value), 0),
                            );
                        }}
                    />
                </div>

                <select
                    class="u-w-30"
                    name={`system.attributes.movement.${mode}.unit`}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value,
                        )}
                >
                    {#each Object.entries(A5E.distanceUnits) as [key, name]}
                        <option
                            {key}
                            value={key}
                            selected={movementData.unit === key}
                        >
                            {localize(name)}
                        </option>
                    {/each}
                </select>

                {#if mode === "fly"}
                    <Checkbox
                        label="A5E.MovementHover"
                        checked={movementData?.hover}
                        on:updateSelection={({ detail }) => {
                            updateDocumentDataFromField(
                                $actor,
                                "system.attributes.movement.traits.hover",
                                detail,
                            );
                        }}
                    />
                {/if}
            </FormSection>
        {/if}
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
        background: $color-sheet-background;
    }
</style>
