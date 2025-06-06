<script>
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import FieldWrapper from "../FieldWrapper.svelte";
    import Tag from "../Tag.svelte";

    import determineIfPropertyModifiedByEffect from "../../../utils/determineIfPropertyModifiedByEffect ";
    import prepareAlignment from "../../dataPreparationHelpers/prepareAlignment";
    import prepareArmorProficiencies from "../../dataPreparationHelpers/prepareArmorProficiencies";
    import prepareConditionImmunities from "../../dataPreparationHelpers/prepareConditionImmunities";
    import prepareCreatureTerrains from "../../dataPreparationHelpers/prepareCreatureTerrains";
    import prepareCreatureTypes from "../../dataPreparationHelpers/prepareCreatureTypes";
    import prepareCreatureSize from "../../dataPreparationHelpers/prepareCreatureSize";
    import prepareDamageImmunities from "../../dataPreparationHelpers/prepareDamageImmunities";
    import prepareDamageResistances from "../../dataPreparationHelpers/prepareDamageResistances";
    import prepareDamageVulnerabilities from "../../dataPreparationHelpers/prepareDamageVulnerabilities";
    import prepareLanguageProficiencies from "../../dataPreparationHelpers/prepareLanguageProficiencies";
    import prepareManeuverTraditions from "../../dataPreparationHelpers/prepareManeuverTraditions";
    import prepareSenses from "../../dataPreparationHelpers/prepareSenses";
    import prepareMovementData from "../../dataPreparationHelpers/prepareMovementData";
    import prepareToolProficiencies from "../../dataPreparationHelpers/prepareToolProficiencies";
    import prepareWeaponProficiencies from "../../dataPreparationHelpers/prepareWeaponProficiencies";

    const actor = getContext("actor");

    function openConfig(dialogMethod, propertyKey) {
        if (!determineIfPropertyModifiedByEffect($actor, propertyKey))
            return $actor[dialogMethod]({ propertyKey });

        ui.notifications.warn(
            localize("A5E.validations.warnings.modifiedByEffect"),
        );
    }

    $: details = [
        {
            heading: localize("A5E.details.movement.title"),
            values: prepareMovementData($actor),
            dialogMethod: "configureMovement",
            propertyKey: "system.attributes.movement",
            tooltip: "Configure Movement",
        },
        {
            heading: localize("A5E.senses.special"),
            values: prepareSenses($actor),
            dialogMethod: "configureSenses",
            propertyKey: "system.attributes.senses",
            tooltip: "Configure Senses",
        },
        {
            heading: localize("A5E.details.languages"),
            values: prepareLanguageProficiencies($actor),
            dialogMethod: "configureLanguages",
            propertyKey: "system.proficiencies.languages",
            tooltip: "Configure Languages",
        },
        {
            heading: localize("A5E.conditions.immunities"),
            values: prepareConditionImmunities($actor),
            dialogMethod: "configureConditionImmunities",
            propertyKey: "system.traits.conditionImmunities",
            tooltip: "Configure Condition Immunities",
        },
        {
            heading: localize("A5E.traits.headings.damage.immunities"),
            values: prepareDamageImmunities($actor),
            dialogMethod: "configureDamageImmunities",
            propertyKey: "system.traits.damageImmunities",
            tooltip: "Configure Damage Immunities",
        },
        {
            heading: localize("A5E.traits.headings.damage.resistances"),
            values: prepareDamageResistances($actor),
            dialogMethod: "configureDamageResistances",
            propertyKey: "system.traits.damageResistances",
            tooltip: "Configure Damage Resistances",
        },
        {
            heading: localize("A5E.traits.headings.damage.vulnerabilities"),
            values: prepareDamageVulnerabilities($actor),
            dialogMethod: "configureDamageVulnerabilities",
            propertyKey: "system.traits.damageVulnerabilities",
            tooltip: "Configure Damage Vulnerabilities",
        },
        {
            heading: localize("A5E.maneuvers.headings.traditionPlural"),
            values: prepareManeuverTraditions($actor),
            dialogMethod: "configureManeuverTraditions",
            propertyKey: "system.proficiencies.traditions",
            tooltip: "Configure Maneuver Traditions",
            display: $actor.type === "character",
        },
        {
            heading: localize("A5E.weapons.proficiencies"),
            values: prepareWeaponProficiencies($actor),
            dialogMethod: "configureWeaponProficiencies",
            propertyKey: "system.proficiencies.weapons",
            tooltip: "Configure Weapon Proficiencies",
        },
        {
            heading: localize("A5E.armorClass.headings.proficiencies"),
            values: prepareArmorProficiencies($actor),
            dialogMethod: "configureArmorProficiencies",
            propertyKey: "system.proficiencies.armor",
            tooltip: "Configure Armor Proficiencies",
        },
        {
            heading: localize("A5E.tools.proficiencies"),
            values: prepareToolProficiencies($actor),
            dialogMethod: "configureToolProficiencies",
            propertyKey: "system.proficiencies.tools",
            tooltip: "Configure Tool Proficiencies",
        },
        {
            heading: localize("A5E.traits.size.title"),
            values: prepareCreatureSize($actor),
            dialogMethod: "configureSizeCategory",
            propertyKey: "system.traits.size",
            tooltip: "Configure Size Category",
        },
        {
            heading: localize("A5E.details.creature.labels.types"),
            values: prepareCreatureTypes($actor),
            dialogMethod: "configureCreatureTypes",
            propertyKey: "system.details.creatureTypes",
            tooltip: "Configure Creature Types",
        },
        {
            heading: localize("A5E.details.creature.labels.terrain"),
            values: prepareCreatureTerrains($actor),
            dialogMethod: "configureCreatureTerrains",
            propertyKey: "system.details.terrain",
            tooltip: "Configure Creature Terrains",
            display: $actor.type === "npc",
        },
        {
            heading: localize("A5E.traits.headings.alignments"),
            values: prepareAlignment($actor),
            dialogMethod: "configureAlignment",
            propertyKey: "system.traits.alignment",
            tooltip: "Configure Alignment",
        },
    ];

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : ($actor.flags?.a5e?.sheetIsLocked ?? true);
</script>

{#each details as { dialogMethod, display, heading, propertyKey, tooltip, values }}
    {#if (values.length || !sheetIsLocked) && (display ?? true)}
        <FieldWrapper
            {heading}
            buttons={[
                {
                    classes:
                        "icon fa-solid fa-gear a5e-field-wrapper__header-button--scale",
                    display: !sheetIsLocked,
                    handler: () => openConfig(dialogMethod, propertyKey),
                    tooltip,
                },
            ]}
            --a5e-field-wrapper-heading-weight="400"
            --a5e-header-button-color="var(--a5e-button-gray)"
            --a5e-header-button-color-hover="var(--a5e-button-gray-hover)"
        >
            <ul class="details-list">
                {#each values as tag}
                    <Tag
                        label={tag}
                        value={tag}
                        tight={true}
                        optionStyles="
                            color: var(--a5e-color-dark);
                            background-color: var(--a5e-background-medium);
                            max-width: 98%;
                            border: 1px solid var(--a5e-border-color);
                        "
                        disabled={true}
                    />
                {/each}
            </ul>
        </FieldWrapper>
    {/if}
{/each}

<style lang="scss">
    .details-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        font-size: var(--a5e-text-size-xxs);
        margin: 0;
        padding: 0;
        list-style: none;
    }
</style>
