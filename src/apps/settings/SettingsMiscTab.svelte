<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import FormSection from "../components/FormSection.svelte";
    import Checkbox from "../components/Checkbox.svelte";

    export let reload;

    const settings = getContext("settings");
    const updates = getContext("updates");

    const isGM = game.user.isGM;

    // Stores
    let showLimitedDesc = settings.getStore("showDescriptionOnLimitedPerms");
    console.log($showLimitedDesc);
</script>

{#if isGM}
    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Sheet Settings</h3>
        </header>

        {#if isGM}
            <FormSection
                hint="A5E.settings.hints.showDescriptionOnLimitedPerms"
                --gap="0.25rem"
            >
                <Checkbox
                    label="A5E.settings.showDescriptionOnLimitedPerms"
                    checked={updates.get("showDescriptionOnLimitedPerms") ??
                        $showLimitedDesc ??
                        false}
                    on:updateSelection={({ detail }) => {
                        updates.set("showDescriptionOnLimitedPerms", detail);
                        reload = true;
                    }}
                />
            </FormSection>
        {/if}
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
