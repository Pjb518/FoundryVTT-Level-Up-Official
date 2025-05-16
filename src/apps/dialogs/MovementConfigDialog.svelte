<script>
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import Checkbox from "../components/Checkbox.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let document;
    export let appId;

    const actor = document;
    const { A5E } = CONFIG;

    const headings = {
        burrow: "A5E.details.movement.types.burrow",
        climb: "A5E.details.movement.types.climb",
        fly: "A5E.details.movement.types.fly",
        swim: "A5E.details.movement.types.swim",
        walk: "A5E.details.movement.types.walk",
    };
</script>

<article>
    {#each Object.entries($actor._source.system.attributes.movement) as [mode, movementData]}
        {#if mode != "traits"}
            <FieldWrapper
                heading={headings[mode]}
                --a5e-field-wrapper-direction="row"
                --a5e-field-wrapper-background="rgba(0, 0, 0, 0.05)"
                --a5e-field-wrapper-padding="0.5rem"
                --a5e-field-wrapper-item-alignment="center"
                --a5e-field-wrapper-label-width="7.5rem"
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
                        label="A5E.details.movement.hover"
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
            </FieldWrapper>
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
    }
</style>
