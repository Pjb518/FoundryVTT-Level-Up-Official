<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";
    import { determineIfPropertyModifiedByEffect } from "#utils/determineIfPropertyModifiedByEffect .ts";

    import { prepareAlignment } from "#utils/view/helpers/prepareAlignment.ts";
    import { prepareArmorProficiencies } from "#utils/view/helpers/prepareArmorProficiencies.ts";
    import { prepareConditionImmunities } from "#utils/view/helpers/prepareConditionImmunities.ts";
    import { prepareCreatureTerrains } from "#utils/view/helpers/prepareCreatureTerrains.ts";
    import { prepareCreatureTypes } from "#utils/view/helpers/prepareCreatureTypes.ts";
    import { prepareCreatureSize } from "#utils/view/helpers/prepareCreatureSize.ts";
    import { prepareDamageImmunities } from "#utils/view/helpers/prepareDamageImmunities.ts";
    import { prepareDamageResistances } from "#utils/view/helpers/prepareDamageResistances.ts";
    import { prepareDamageVulnerabilities } from "#utils/view/helpers/prepareDamageVulnerabilities.ts";
    import { prepareLanguageProficiencies } from "#utils/view/helpers/prepareLanguageProficiencies.ts";
    import { prepareManeuverTraditions } from "#utils/view/helpers/prepareManeuverTraditions.ts";
    import { prepareMovementData } from "#utils/view/helpers/prepareMovementData.ts";
    import { prepareSenses } from "#utils/view/helpers/prepareSenses.ts";
    import { prepareToolProficiencies } from "#utils/view/helpers/prepareToolProficiencies.ts";
    import { prepareWeaponProficiencies } from "#utils/view/helpers/prepareWeaponProficiencies.ts";

    let actor: any = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

    type Detail = {
        heading: string;
        values: string[];
        dialogMethod: string;
        propertyKey: string;
        tooltip: string;
        display?: boolean;
    };

    function openConfig(dialogMethod: string, propertyKey: string) {
        if (!determineIfPropertyModifiedByEffect(actor, propertyKey)) {
            return actor[dialogMethod]?.({ propertyKey });
        }

        ui.notifications.warn(
            localize("A5E.validations.warnings.modifiedByEffect"),
        );
    }

    let details: Detail[] = $derived([
        {
            heading: localize("A5E.details.movement.title"),
            values: prepareMovementData(actor.reactive),
            dialogMethod: "configureMovement",
            propertyKey: "system.attributes.movement",
            tooltip: "Configure Movement",
        },
        {
            heading: localize("A5E.senses.special"),
            values: prepareSenses(actor.reactive),
            dialogMethod: "configureSenses",
            propertyKey: "system.attributes.senses",
            tooltip: "Configure Senses",
        },
        {
            heading: localize("A5E.details.languages"),
            values: prepareLanguageProficiencies(actor.reactive),
            dialogMethod: "configureLanguages",
            propertyKey: "system.proficiencies.languages",
            tooltip: "Configure Languages",
        },
        {
            heading: localize("A5E.conditions.immunities"),
            values: prepareConditionImmunities(actor.reactive),
            dialogMethod: "configureConditionImmunities",
            propertyKey: "system.traits.conditionImmunities",
            tooltip: "Configure Condition Immunities",
        },
        {
            heading: localize("A5E.traits.headings.damage.immunities"),
            values: prepareDamageImmunities(actor.reactive),
            dialogMethod: "configureDamageImmunities",
            propertyKey: "system.traits.damageImmunities",
            tooltip: "Configure Damage Immunities",
        },
        {
            heading: localize("A5E.traits.headings.damage.resistances"),
            values: prepareDamageResistances(actor.reactive),
            dialogMethod: "configureDamageResistances",
            propertyKey: "system.traits.damageResistances",
            tooltip: "Configure Damage Resistances",
        },
        {
            heading: localize("A5E.traits.headings.damage.vulnerabilities"),
            values: prepareDamageVulnerabilities(actor.reactive),
            dialogMethod: "configureDamageVulnerabilities",
            propertyKey: "system.traits.damageVulnerabilities",
            tooltip: "Configure Damage Vulnerabilities",
        },
        {
            heading: localize("A5E.maneuvers.headings.traditionPlural"),
            values: prepareManeuverTraditions(actor.reactive),
            dialogMethod: "configureManeuverTraditions",
            propertyKey: "system.proficiencies.traditions",
            tooltip: "Configure Maneuver Traditions",
            display: actor.reactive.type === "character",
        },
        {
            heading: localize("A5E.weapons.proficiencies"),
            values: prepareWeaponProficiencies(actor.reactive),
            dialogMethod: "configureWeaponProficiencies",
            propertyKey: "system.proficiencies.weapons",
            tooltip: "Configure Weapon Proficiencies",
        },
        {
            heading: localize("A5E.armorClass.headings.proficiencies"),
            values: prepareArmorProficiencies(actor.reactive),
            dialogMethod: "configureArmorProficiencies",
            propertyKey: "system.proficiencies.armor",
            tooltip: "Configure Armor Proficiencies",
        },
        {
            heading: localize("A5E.tools.proficiencies"),
            values: prepareToolProficiencies(actor.reactive),
            dialogMethod: "configureToolProficiencies",
            propertyKey: "system.proficiencies.tools",
            tooltip: "Configure Tool Proficiencies",
        },
        {
            heading: localize("A5E.traits.size.title"),
            values: prepareCreatureSize(actor.reactive),
            dialogMethod: "configureSizeCategory",
            propertyKey: "system.traits.size",
            tooltip: "Configure Size Category",
        },
        {
            heading: localize("A5E.details.creature.labels.types"),
            values: prepareCreatureTypes(actor.reactive),
            dialogMethod: "configureCreatureTypes",
            propertyKey: "system.details.creatureTypes",
            tooltip: "Configure Creature Types",
        },
        {
            heading: localize("A5E.details.creature.labels.terrain"),
            values: prepareCreatureTerrains(actor.reactive),
            dialogMethod: "configureCreatureTerrains",
            propertyKey: "system.details.terrain",
            tooltip: "Configure Creature Terrains",
            display: actor.reactive.type === "npc",
        },
        {
            heading: localize("A5E.traits.headings.alignments"),
            values: prepareAlignment(actor.reactive),
            dialogMethod: "configureAlignment",
            propertyKey: "system.traits.alignment",
            tooltip: "Configure Alignment",
        },
    ]);
</script>

{#each details as { dialogMethod, display, heading, propertyKey, tooltip, values }}
    {#if (values.length || !sheetIsLocked()) && (display ?? true)}
        <div class="a5e-actor-details__section">
            <div class="a5e-actor-details__section-header">
                <span class="a5e-actor-details__section-heading">
                    {heading}:
                </span>

                {#if !sheetIsLocked()}
                    <button
                        class="a5e-button a5e-button--config"
                        aria-labelledby="Configure"
                        data-tooltip={tooltip}
                        onclick={() => openConfig(dialogMethod, propertyKey)}
                    >
                        <i class="fa-solid fa-cog"></i>
                    </button>
                {/if}
            </div>

            <ul class="a5e-actor-details-values">
                {#each values as value}
                    <li class="a5e-actor-details-value">
                        {value}
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
{/each}

<style lang="scss">
    .a5e-actor-details {
        &__section {
            font-size: var(--a5e-sm-text);

            &-header {
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }

            &-heading {
                font-weight: 600;
            }
        }

        &-values {
            margin: 0;
            padding: 0;

            display: flex;
            flex-wrap: wrap;

            list-style: none;
            font-size: var(--a5e-sm-text);
        }

        &-value {
            margin: 0;
            padding-inline: 0.125rem;
        }

        &-value:nth-of-type(n):not(:last-child) {
            &:after {
                content: ", ";
            }
        }
    }
</style>
