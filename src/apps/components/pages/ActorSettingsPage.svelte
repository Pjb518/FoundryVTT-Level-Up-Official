<script>
    import { getContext } from "svelte";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    const globalCurrencyWeightTrackingSelection = game.settings.get(
        "a5e",
        "currencyWeight",
    );

    $: flags = $actor.flags;
</script>

<section
    class="u-flex-grow u-flex u-flex-col u-overflow-y-auto u-gap-md u-px-md"
    style="grid-auto-rows: min-content;"
>
    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Inventory Settings</h3>
        </header>

        <FormSection>
            <Checkbox
                label="A5E.settings.trackInventoryWeight"
                checked={flags?.a5e?.trackInventoryWeight ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.trackInventoryWeight",
                        detail,
                    );
                }}
            />
        </FormSection>

        {#if flags?.a5e?.trackInventoryWeight ?? true}
            <FormSection>
                <Checkbox
                    label="A5E.settings.doubleCarryingCapacity"
                    checked={flags.a5e?.doubleCarryCapacity ?? false}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $actor,
                            "flags.a5e.doubleCarryCapacity",
                            detail,
                        );
                    }}
                />
            </FormSection>

            <FormSection
                hint="A5E.settings.hints.trackCurrencyWeight"
                --gap="0.25rem"
            >
                <Checkbox
                    label="A5E.settings.trackCurrencyWeight"
                    checked={flags.a5e?.trackCurrencyWeight ??
                        globalCurrencyWeightTrackingSelection}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $actor,
                            "flags.a5e.trackCurrencyWeight",
                            detail,
                        );
                    }}
                />
            </FormSection>
        {/if}
    </section>

    {#if $actor.type === "character"}
        <section class="setting-group">
            <header class="setting-header">
                <h3 class="setting-heading">Roll Modifiers</h3>
            </header>

            <FormSection hint="A5E.settings.hints.halflingLuck" --gap="0.25rem">
                <Checkbox
                    label="A5E.settings.halflingLuck"
                    checked={flags.a5e?.halflingLuck ?? false}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $actor,
                            "flags.a5e.halflingLuck",
                            detail,
                        );
                    }}
                />
            </FormSection>

            <FormSection
                hint="A5E.settings.hints.jackOfAllTrades"
                --gap="0.25rem"
            >
                <Checkbox
                    label="A5E.settings.jackOfAllTrades"
                    checked={flags.a5e?.jackOfAllTrades ?? false}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $actor,
                            "flags.a5e.jackOfAllTrades",
                            detail,
                        );
                    }}
                />
            </FormSection>
        </section>
    {/if}

    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Sheet Customization</h3>
        </header>

        <FormSection>
            <Checkbox
                label="A5E.HideGenericResources"
                checked={flags.a5e?.hideGenericResources ??
                    $actor.type === "npc"}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.hideGenericResources",
                        detail,
                    );
                }}
            />
        </FormSection>

        <FormSection>
            <Checkbox
                label="A5E.settings.includeAbilityModifiersForSkills"
                checked={flags.a5e?.includeAbilityModifiersForSkills ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.includeAbilityModifiersForSkills",
                        detail,
                    );
                }}
            />
        </FormSection>

        <FormSection>
            <Checkbox
                label="A5E.settings.showFavoritesSection"
                checked={flags.a5e?.showFavoritesSection ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.showFavoritesSection",
                        detail,
                    );
                }}
            />
        </FormSection>

        <FormSection>
            <Checkbox
                label="A5E.settings.showManeuverTab"
                checked={flags.a5e?.showManeuverTab ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.showManeuverTab",
                        detail,
                    );
                }}
            />
        </FormSection>

        <FormSection>
            <Checkbox
                label="A5E.settings.showPassiveScores"
                checked={flags.a5e?.showPassiveScores ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.showPassiveScores",
                        detail,
                    );
                }}
            />
        </FormSection>

        <FormSection>
            <Checkbox
                label="A5E.settings.showSpellTab"
                checked={flags.a5e?.showSpellTab ?? true}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.showSpellTab",
                        detail,
                    );
                }}
            />
        </FormSection>

        {#if $actor.type === "character"}
            <FormSection>
                <Checkbox
                    label="A5E.settings.showXP"
                    checked={flags.a5e?.showXP ?? true}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $actor,
                            "flags.a5e.showXP",
                            detail,
                        );
                    }}
                />
            </FormSection>
        {/if}
    </section>

    <!-- svelte-ignore missing-declaration -->
    {#if $actor.type === "npc" && game.settings.get("a5e", "randomizeNPCHitPoints")}
        <section class="setting-group">
            <header class="setting-header">
                <h3 class="setting-heading">Token Options</h3>
            </header>

            <FormSection --gap="0.25rem">
                <Checkbox
                    label="Disable Randomized HP Rolls"
                    checked={flags.a5e?.disableRandomizedHP ?? false}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $actor,
                            "flags.a5e.disableRandomizedHP",
                            detail,
                        );
                    }}
                />
            </FormSection>
        </section>
    {/if}

    <section class="setting-group">
        <header class="setting-header">
            <h3 class="setting-heading">Triggers</h3>
        </header>

        <button
            class="a5e-button trigger-button"
            on:click={() => {
                $actor.applyPermanentEffects();
                document.activeElement.blur();
            }}
        >
            Re-Calculate Permanent Effects
        </button>
    </section>
</section>

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

    .trigger-button {
        margin: 0.25rem;
        width: fit-content;
        padding-inline: 0.75rem;
        background: transparent;
        border: 1px solid #4f4f4f;
        transition: $standard-transition;

        &:focus,
        &:hover {
            box-shadow: none;
            background: $color-primary;
            color: $color-light-text;
        }
    }

    .setting-heading {
        font-size: $font-size-sm;
        white-space: nowrap;
    }
</style>
