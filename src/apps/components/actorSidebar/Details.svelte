<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import Tag from "../Tag.svelte";

    import determineIfPropertyModifiedByEffect from "../../../utils/determineIfPropertyModifiedByEffect ";
    import prepareArmorProficiencies from "../../dataPreparationHelpers/prepareArmorProficiencies";
    import prepareConditionImmunities from "../../dataPreparationHelpers/prepareConditionImmunities";
    import prepareCreatureTypes from "../../dataPreparationHelpers/prepareCreatureTypes";
    import prepareCreatureSize from "../../dataPreparationHelpers/prepareCreatureSize";
    import prepareDamageImmunities from "../../dataPreparationHelpers/prepareDamageImmunities";
    import prepareDamageResistances from "../../dataPreparationHelpers/prepareDamageResistances";
    import prepareDamageVulnerabilities from "../../dataPreparationHelpers/prepareDamageVulnerabilities";
    import prepareLanguageProficiencies from "../../dataPreparationHelpers/prepareLanguageProficiencies";
    import prepareSenses from "../../dataPreparationHelpers/prepareSenses";
    import prepareMovementData from "../../dataPreparationHelpers/prepareMovementData";
    import prepareToolProficiencies from "../../dataPreparationHelpers/prepareToolProficiencies";
    import prepareWeaponProficiencies from "../../dataPreparationHelpers/prepareWeaponProficiencies";

    const actor = getContext("actor");

    function openConfig(dialogMethod, propertyKey) {
        if (!determineIfPropertyModifiedByEffect($actor, propertyKey))
            return $actor[dialogMethod]();

        ui.notifications.warn(
            localize("A5E.validations.warnings.modifiedByEffect")
        );
    }

    $: details = [
        {
            label: localize("A5E.Movement"),
            values: prepareMovementData($actor),
            dialogMethod: "configureMovement",
            propertyKey: "system.attributes.movement",
        },
        {
            label: localize("A5E.SensesSpecial"),
            values: prepareSenses($actor),
            dialogMethod: "configureSenses",
            propertyKey: "system.attributes.senses",
        },
        {
            label: localize("A5E.Languages"),
            values: prepareLanguageProficiencies($actor),
            dialogMethod: "configureLanguages",
            propertyKey: "system.proficiencies.languages",
        },
        {
            label: localize("A5E.ConditionImmunities"),
            values: prepareConditionImmunities($actor),
            dialogMethod: "configureConditionImmunities",
            propertyKey: "system.traits.conditionImmunities",
        },
        {
            label: localize("A5E.DamageImmunities"),
            values: prepareDamageImmunities($actor),
            dialogMethod: "configureDamageImmunities",
            propertyKey: "system.traits.damageImmunities",
        },
        {
            label: localize("A5E.DamageResistances"),
            values: prepareDamageResistances($actor),
            dialogMethod: "configureDamageResistances",
            propertyKey: "system.traits.damageResistances",
        },
        {
            label: localize("A5E.DamageVulnerabilities"),
            values: prepareDamageVulnerabilities($actor),
            dialogMethod: "configureDamageVulnerabilities",
            propertyKey: "system.traits.damageVulnerabilities",
        },
        {
            label: localize("A5E.WeaponProficiencies"),
            values: prepareWeaponProficiencies($actor),
            dialogMethod: "configureWeaponProficiencies",
            propertyKey: "system.proficiencies.weapons",
        },
        {
            label: localize("A5E.ArmorProficiencies"),
            values: prepareArmorProficiencies($actor),
            dialogMethod: "configureArmorProficiencies",
            propertyKey: "system.proficiencies.armor",
        },
        {
            label: localize("A5E.ToolProficiencies"),
            values: prepareToolProficiencies($actor),
            dialogMethod: "configureToolProficiencies",
            propertyKey: "system.proficiencies.tools",
        },
        {
            label: localize("A5E.Size"),
            values: prepareCreatureSize($actor),
            dialogMethod: "configureSizeCategory",
            propertyKey: "system.traits.size",
        },
        {
            label: localize("A5E.CreatureTypesLabel"),
            values: prepareCreatureTypes($actor),
            dialogMethod: "configureCreatureTypes",
            propertyKey: "system.details.creatureTypes",
        },
    ];

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

{#each details as { label, values, dialogMethod, propertyKey }}
    {#if values.length || !sheetIsLocked}
        <section class="details-section">
            <h2 class="details-header">
                {label}
            </h2>

            {#if !sheetIsLocked}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <i
                    class="fas fa-gear a5e-config-button details-config"
                    on:click={() => openConfig(dialogMethod, propertyKey)}
                />
            {/if}

            <ul class="details-list">
                {#each values as tag}
                    <Tag
                        label={tag}
                        value={tag}
                        tight={true}
                        optionStyles="
                            color: black;
                            background-color: rgba(0 0 0 / 0.05);
                            max-width: 98%;
                            border: 1px solid #ccc;
                        "
                        disabled={true}
                    />
                {/each}
            </ul>
        </section>
    {/if}
{/each}

<style lang="scss">
    .details-section {
        position: relative;
    }

    .details-header {
        font-family: $font-secondary;
        font-size: 0.833rem;
        // font-weight: bold;
        padding-left: 0.125rem;
        padding-bottom: 0.125rem;
        margin-bottom: 0.275rem;
        border-bottom: 1px solid #ccc;
    }

    .details-config {
        position: absolute;
        top: 0.125rem;
        right: 0.125rem;
    }

    .details-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        font-size: 0.579rem;
        margin: 0;
        padding: 0;
        list-style: none;
    }
</style>
