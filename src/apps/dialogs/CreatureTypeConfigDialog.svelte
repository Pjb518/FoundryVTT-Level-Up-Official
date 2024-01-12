<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import Checkbox from "../components/Checkbox.svelte";
    import CustomTagGroup from "../components/CustomTagGroup.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import Section from "../components/Section.svelte";

    export let { document, appId } = getContext("#external").application;

    const actor = document;
    const systemTypes = Object.entries(CONFIG.A5E.creatureTypes);
</script>

<Section --a5e-section-body-padding="0.75rem" --a5e-section-body-gap="0.75rem">
    <FieldWrapper>
        <CustomTagGroup
            heading="A5E.CreatureTypePlural"
            options={systemTypes}
            selected={$actor.system.details.creatureTypes}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $actor,
                    "system.details.creatureTypes",
                    event.detail,
                )}
        />
    </FieldWrapper>

    <FieldWrapper>
        <Checkbox
            label="A5E.CreatureSwarm"
            checked={$actor.system.details.isSwarm}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    "system.details.isSwarm",
                    detail,
                );
            }}
        />
    </FieldWrapper>
</Section>

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
