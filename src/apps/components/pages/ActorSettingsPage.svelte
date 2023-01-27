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
    class="u-flex-grow u-grid u-grid-2 u-overflow-y-auto u-gap-md u-px-md"
    style="grid-auto-rows: min-content;"
>
    <div class="u-flex u-flex-col u-gap-md">
        <FormSection>
            <div class="u-align-center u-flex u-gap-md">
                <input
                    class="u-pointer"
                    type="checkbox"
                    name="flags.a5e.trackInventoryWeight"
                    id={`${$actor.id}-track-inventory-weight`}
                    checked={flags.a5e?.trackInventoryWeight ?? true}
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

        {#if flags.a5e?.trackInventoryWeight ?? true}
            <FormSection
                heading="A5E.SettingsCarryCapacityMultiplier"
                hint="Do not increase this number to account for your size category."
            >
                <div class="u-w-full">
                    <div class="u-w-20">
                        <input
                            class="a5e-input"
                            type="number"
                            data-dtype="Number"
                            min="1"
                            name="flags.a5e.carryCapacityMultiplier"
                            value={flags.a5e?.carryCapacityMultiplier || 1}
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $actor,
                                    target.name,
                                    Number(target.value)
                                )}
                        />
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
                    name="flags.a5e.IncludeAbilityModifiersForSkills"
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
                />

                <label class="u-pointer" for={`${$actor.id}-show-spell-tab`}>
                    {localize("A5E.SettingsShowSpellTab")}
                </label>
            </div>
        </FormSection>
    </div>
</section>
