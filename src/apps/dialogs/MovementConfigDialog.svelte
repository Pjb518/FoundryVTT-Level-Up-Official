<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import FormSection from "../components/FormSection.svelte";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let { actorDocument, appId } = getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const A5E = CONFIG.A5E;

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
            <FormSection>
                <div class="outer-wrapper">
                    <div class="field-wrapper">
                        <h3 class="form-heading u-flex-shrink-0 u-w-30">
                            {localize(headings[mode])}
                        </h3>

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
                                        Math.max(Number(target.value), 0)
                                    );
                                }}
                            />
                        </div>
                    </div>

                    <select
                        class="u-w-30"
                        name={`system.attributes.movement.${mode}.unit`}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                target.value
                            )}
                    >
                        {#each Object.entries(A5E.distanceUnits) as [key, name]}
                            <option
                                {key}
                                value={key}
                                selected={$actor.system.attributes.movement[
                                    mode
                                ].unit === key}
                            >
                                {localize(name)}
                            </option>
                        {/each}
                    </select>
                </div>

                {#if mode === "fly"}
                    <div class="u-align-center u-flex u-gap-md">
                        <input
                            id="{appId}-hover"
                            class="u-pointer"
                            type="checkbox"
                            name="system.attributes.movement.traits.hover"
                            checked={$actor.system.attributes.movement.traits
                                ?.hover}
                            on:change={({ target }) => {
                                updateDocumentDataFromField(
                                    $actor,
                                    target.name,
                                    target.checked
                                );
                            }}
                        />

                        <label for="{appId}-hover" class="u-pointer">
                            {localize("A5E.MovementHover")}
                        </label>
                    </div>
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
        background: rgba(246, 242, 235, 0.5);
    }

    .form-heading {
        font-size: 0.833rem;
        font-weight: bold;
    }

    .field-wrapper {
        display: flex;
        align-items: center;
    }

    .outer-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .u-pointer {
        margin-left: 0px;
    }
</style>
