<script lang="ts">
    import { getContext } from "svelte";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import Section from "#view/snippets/Section.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    type Props = {
        reload?: boolean;
    };

    let { reload = $bindable() }: Props = $props();

    let settings: Record<string, { data: any; value: any }> =
        getContext("settings");
    let updates: Map<string, any> = getContext("updates");

    const isGM = game.user!.isGM;

    let playersCanAccess = $derived(
        settings["playersCanAccessPartyViewer"].value,
    );
    let showActorImages = $derived(
        settings["showActorImagesInPartyViewer"].value,
    );
</script>

<Section heading="Appearance" --a5e-section-body-gap="0.5rem">
    <FieldWrapper>
        <Checkbox
            label="Show character images in the party viewer"
            checked={updates.get("showActorImagesInPartyViewer") ??
                showActorImages ??
                true}
            onUpdateSelection={(detail) => {
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
                    playersCanAccess ??
                    false}
                onUpdateSelection={(detail) => {
                    updates.set("playersCanAccessPartyViewer", detail);
                    reload = true;
                }}
            />
        </FieldWrapper>
    </Section>
{/if}
