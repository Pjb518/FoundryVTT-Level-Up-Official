<script>
    import { getContext } from "svelte";

    import Checkbox from "../components/Checkbox.svelte";
    import FormSection from "../components/LegacyFormSection.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { document, appId } = getContext("#external").application;

    const actor = document;
</script>

<article>
    <FormSection heading="A5E.ManeuverDCBonus" --direction="column">
        <input
            class="a5e-input"
            type="text"
            name="system.bonuses.maneuverDC"
            value={$actor.system.bonuses.maneuverDC}
            on:change={({ target }) =>
                updateDocumentDataFromField($actor, target.name, target.value)}
        />
    </FormSection>

    {#if $actor.type === "character"}
        <FormSection>
            <Checkbox
                label="A5E.ExertionRecoveryConfigPrompt"
                checked={$actor.system.attributes.exertion.recoverOnRest}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "system.attributes.exertion.recoverOnRest",
                        detail,
                    );
                }}
            />
        </FormSection>
    {/if}
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
