<script>
    import { getContext } from "svelte";

    import Checkbox from "../components/Checkbox.svelte";
    import FormSection from "../components/LegacyFormSection.svelte";

    export let reload;

    const settings = getContext("settings");
    const updates = getContext("updates");

    const isGM = game.user.isGM;

    let playersCanAccess = settings.getStore("playersCanAccessPartyViewer");
    let showActorImages = settings.getStore("showActorImagesInPartyViewer");
</script>

<section class="setting-group">
    <header class="setting-header">
        <h3 class="setting-heading">Appearance</h3>
    </header>

    <FormSection --gap="0.25rem">
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
    </FormSection>
</section>

{#if isGM}
    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Player Access</h3>
        </header>

        <FormSection
            hint="Players will be able to view but not edit the summary information in the Party Viewer window."
            --gap="0.25rem"
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
        </FormSection>
    </section>
{/if}

<style lang="scss">
    .setting-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        &:not(:last-child) {
            margin-bottom: 0.25rem;
        }
    }

    .setting-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.5rem 0.25rem 0.125rem;
        border-bottom: 1px solid #ccc;
    }

    .setting-heading {
        font-size: $font-size-sm;
        white-space: nowrap;
    }
</style>
