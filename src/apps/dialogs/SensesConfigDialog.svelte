<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import FormSection from "../components/FormSection.svelte";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let { actorDocument, appId } = getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const A5E = CONFIG.A5E;

    const headings = {
        blindsight: "A5E.SenseBlindsightRange",
        darkvision: "A5E.SenseDarkvisionRange",
        tremorsense: "A5E.SenseTremorsenseRange",
        truesight: "A5E.SenseTruesightRange",
    };
</script>

<article>
    <!-- TODO: Possible conversion to number -->
    {#each Object.entries($actor.system.attributes.senses) as [sense, senseData]}
        <FormSection heading={headings[sense]} inline={true}>
            <div class="u-w-20">
                <input
                    class="a5e-input"
                    disabled={senseData.unit === "unlimited"}
                    type={senseData.unit === "unlimited" ? "text" : "number"}
                    name="system.attributes.senses.{sense}.distance"
                    value={senseData.unit === "unlimited"
                        ? "—"
                        : senseData.distance || 0}
                    on:change={({ target }) => {
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            Number(target.value)
                        );
                    }}
                />
            </div>
            <div class="u-w-20">
                <select
                    class="u-w-30"
                    name="system.attributes.senses.{sense}.unit"
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                >
                    {#each Object.entries(A5E.visionUnits) as [key, name]}
                        <option
                            {key}
                            value={key}
                            selected={$actor.system.attributes.senses[sense]
                                .unit === key}
                        >
                            {localize(name)}
                        </option>
                    {/each}
                </select>
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
