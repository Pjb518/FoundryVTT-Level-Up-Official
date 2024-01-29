<script>
    import { getContext } from "svelte";

    import Checkbox from "../components/Checkbox.svelte";
    import Section from "../components/Section.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";

    export let reload;

    const settings = getContext("settings");
    const updates = getContext("updates");

    const isGM = game.user.isGM;

    let playersCanAccess = settings.getStore("playersCanAccessPartyViewer");
    let showActorImages = settings.getStore("showActorImagesInPartyViewer");
</script>

<Section heading="Appearance" --a5e-section-body-gap="0.5rem">
    <FieldWrapper>
        <Checkbox
            label="Show character images in the party viewer"
            checked={updates.get("showActorImagesInPartyViewer") ??
                $showActorImages ??
                true}
            on:updateSelection={({ detail }) => {
                updates.set("showActorImagesInPartyViewer", detail);
                reload = true;
            }}
        />
    </FieldWrapper>
</Section>

{#if isGM}
    <Section heading="Player Access" --a5e-section-body-gap="0.5rem">
        <FieldWrapper
            hint="Players will be able to view but not edit the summary information in the Party Viewer window."
        >
            <Checkbox
                label="Players can access the Party Viewer"
                checked={updates.get("playersCanAccessPartyViewer") ??
                    $playersCanAccess ??
                    false}
                on:updateSelection={({ detail }) => {
                    updates.set("playersCanAccessPartyViewer", detail);
                    reload = true;
                }}
            />
        </FieldWrapper>
    </Section>
{/if}
