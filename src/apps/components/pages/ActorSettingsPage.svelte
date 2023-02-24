<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import FormSection from "../FormSection.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    const globalCurrencyWeightTrackingSelection = game.settings.get(
        "a5e",
        "currencyWeight"
    );

    $: flags = $actor.flags;
</script>

<section
    class="u-flex-grow u-flex u-flex-col u-overflow-y-auto u-gap-md u-px-md"
    style="grid-auto-rows: min-content;"
>
    <div class="u-flex u-flex-col u-gap-md">
        <FormSection
            hint="When enabled, half of your proficiency bonus (rounded down) will be added to all ability checks that do not already include your proficiency bonus."
        >
            <div class="u-align-center u-flex u-gap-md">
                <div class="u-align-center u-flex u-gap-md">
                    <input
                        class="u-pointer"
                        type="checkbox"
                        name="flags.a5e.jackOfAllTrades"
                        id={`${$actor.id}-jack-of-all-trades`}
                        checked={flags.a5e?.jackOfAllTrades ?? false}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                target.checked
                            )}
                    />

                    <label
                        class="u-pointer"
                        for={`${$actor.id}-jack-of-all-trades`}
                    >
                        {localize("A5E.SettingsJackOfAllTrades")}
                    </label>
                </div>
            </div>
        </FormSection>

        <FormSection
            hint="When enabled d20 rolls resulting in a 1 will be automatically rerolled."
        >
            <div class="u-align-center u-flex u-gap-md">
                <div class="u-align-center u-flex u-gap-md">
                    <input
                        class="u-pointer"
                        type="checkbox"
                        name="flags.a5e.halflingLuck"
                        id={`${$actor.id}-halfling-luck`}
                        checked={flags.a5e?.halflingLuck ?? false}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $actor,
                                target.name,
                                target.checked
                            )}
                    />

                    <label class="u-pointer" for={`${$actor.id}-halfling-luck`}>
                        {localize("A5E.SettingsHalflingLuck")}
                    </label>
                </div>
            </div>
        </FormSection>

        <FormSection>
            <div class="u-align-center u-flex u-gap-md">
                <input
                    class="u-pointer"
                    type="checkbox"
                    name="flags.a5e.trackInventoryWeight"
                    id={`${$actor.id}-track-inventory-weight`}
                    checked={$actor.flags?.a5e?.trackInventoryWeight ?? true}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.checked
                        )}
                />

                <label
                    class="u-pointer"
                    for={`${$actor.id}-track-inventory-weight`}
                >
                    {localize("A5E.SettingsTrackInventoryWeight")}
                </label>
            </div>
        </FormSection>

        {#if $actor.flags?.a5e?.trackInventoryWeight ?? true}
            <FormSection>
                <div class="u-align-center u-flex u-gap-md">
                    <div class="u-align-center u-flex u-gap-md">
                        <input
                            class="u-pointer"
                            type="checkbox"
                            name="flags.a5e.doubleCarryCapacity"
                            id={`${$actor.id}-track-currency-weight`}
                            checked={flags.a5e?.doubleCarryCapacity ?? false}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $actor,
                                    target.name,
                                    target.checked
                                )}
                        />

                        <label
                            class="u-pointer"
                            for={`${$actor.id}-track-currency-weight`}
                        >
                            {localize("A5E.SettingsDoubleCarryCapacity")}
                        </label>
                    </div>
                </div>
            </FormSection>

            <FormSection
                hint="If selected, 0.02lbs. per coin will be added to the inventory weight."
            >
                <div class="u-align-center u-flex u-gap-md">
                    <div class="u-align-center u-flex u-gap-md">
                        <input
                            class="u-pointer"
                            type="checkbox"
                            name="flags.a5e.trackCurrencyWeight"
                            id={`${$actor.id}-track-currency-weight`}
                            checked={flags.a5e?.trackCurrencyWeight ??
                                globalCurrencyWeightTrackingSelection}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $actor,
                                    target.name,
                                    target.checked
                                )}
                        />

                        <label
                            class="u-pointer"
                            for={`${$actor.id}-track-currency-weight`}
                        >
                            {localize("A5E.SettingsTrackCurrencyWeight")}
                        </label>
                    </div>
                </div>
            </FormSection>
        {/if}

        {#if $actor.type === "character"}
            <FormSection>
                <div class="u-align-center u-flex u-gap-md">
                    <input
                        class="u-pointer"
                        type="checkbox"
                        name="flags.a5e.showXp"
                        id={`${actor.id}-show-xp`}
                        checked={flags.a5e?.showXP ?? true}
                        on:change={({ target }) => {
                            $actor, target.name, target.checked;
                        }}
                    />
                </div>

                <label for={`${actor.id}-show-xp`} class="u-pointer">
                    {localize("A5E.SettingsShowXP")}
                </label>
            </FormSection>
        {/if}

        <FormSection>
            <div class="u-align-center u-flex u-gap-md">
                <input
                    class="u-pointer"
                    type="checkbox"
                    name="flags.a5e.includeAbilityModifiersForSkills"
                    id={`${actor.id}-include-ability-mods-for-skills`}
                    checked={flags.a5e?.includeAbilityModifiersForSkills ??
                        $actor.type === "npc"}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.checked
                        )}
                />

                <label
                    class="u-pointer"
                    for={`${$actor.id}-include-ability-mods-for-skills`}
                >
                    {localize("A5E.SettingsIncludeAbilityModifiersForSkills")}
                </label>
            </div>
        </FormSection>

        <FormSection>
            <div class="u-align-center u-flex u-gap-md">
                <input
                    class="u-pointer"
                    type="checkbox"
                    name="flags.a5e.showManeuverTab"
                    id={`${$actor.id}-show-maneuver-tab`}
                    checked={flags.a5e?.showManeuverTab ?? true}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.checked
                        )}
                />

                <label class="u-pointer" for={`${$actor.id}-show-maneuver-tab`}>
                    {localize("A5E.SettingsShowManeuverTab")}
                </label>
            </div>
        </FormSection>

        <FormSection>
            <div class="u-align-center u-flex u-gap-md">
                <input
                    class="u-pointer"
                    type="checkbox"
                    name="flags.a5e.showSpellTab"
                    id={`${$actor.id}-show-spell-tab`}
                    checked={flags.a5e?.showSpellTab ?? true}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.checked
                        )}
                />

                <label class="u-pointer" for={`${$actor.id}-show-spell-tab`}>
                    {localize("A5E.SettingsShowSpellTab")}
                </label>
            </div>
        </FormSection>
    </div>
</section>
