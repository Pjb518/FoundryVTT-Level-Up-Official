<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

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
    let actorStore = $derived(actor.reactive);

    type Detail = {
        heading: string;
        values: string[];
        dialogMethod: string;
        propertyKey: string;
        tooltip: string;
        display?: boolean;
    };

    let details: Detail[] = $derived([
        {
            heading: localize("A5E.Movement"),
            values: prepareMovementData(actorStore),
            dialogMethod: "configureMovement",
            propertyKey: "system.attributes.movement",
            tooltip: "Configure Movement",
        },
        {
            heading: localize("A5E.SensesSpecial"),
            values: prepareSenses(actorStore),
            dialogMethod: "configureSenses",
            propertyKey: "system.attributes.senses",
            tooltip: "Configure Senses",
        },
        {
            heading: localize("A5E.Languages"),
            values: prepareLanguageProficiencies(actorStore),
            dialogMethod: "configureLanguages",
            propertyKey: "system.proficiencies.languages",
            tooltip: "Configure Languages",
        },
        {
            heading: localize("A5E.ConditionImmunities"),
            values: prepareConditionImmunities(actorStore),
            dialogMethod: "configureConditionImmunities",
            propertyKey: "system.traits.conditionImmunities",
            tooltip: "Configure Condition Immunities",
        },
        {
            heading: localize("A5E.DamageImmunities"),
            values: prepareDamageImmunities(actorStore),
            dialogMethod: "configureDamageImmunities",
            propertyKey: "system.traits.damageImmunities",
            tooltip: "Configure Damage Immunities",
        },
        {
            heading: localize("A5E.DamageResistances"),
            values: prepareDamageResistances(actorStore),
            dialogMethod: "configureDamageResistances",
            propertyKey: "system.traits.damageResistances",
            tooltip: "Configure Damage Resistances",
        },
        {
            heading: localize("A5E.DamageVulnerabilities"),
            values: prepareDamageVulnerabilities(actorStore),
            dialogMethod: "configureDamageVulnerabilities",
            propertyKey: "system.traits.damageVulnerabilities",
            tooltip: "Configure Damage Vulnerabilities",
        },
        {
            heading: localize("A5E.ManeuverTraditionPlural"),
            values: prepareManeuverTraditions(actorStore),
            dialogMethod: "configureManeuverTraditions",
            propertyKey: "system.proficiencies.traditions",
            tooltip: "Configure Maneuver Traditions",
            display: actorStore.type === "character",
        },
        {
            heading: localize("A5E.WeaponProficiencies"),
            values: prepareWeaponProficiencies(actorStore),
            dialogMethod: "configureWeaponProficiencies",
            propertyKey: "system.proficiencies.weapons",
            tooltip: "Configure Weapon Proficiencies",
        },
        {
            heading: localize("A5E.ArmorProficiencies"),
            values: prepareArmorProficiencies(actorStore),
            dialogMethod: "configureArmorProficiencies",
            propertyKey: "system.proficiencies.armor",
            tooltip: "Configure Armor Proficiencies",
        },
        {
            heading: localize("A5E.ToolProficiencies"),
            values: prepareToolProficiencies(actorStore),
            dialogMethod: "configureToolProficiencies",
            propertyKey: "system.proficiencies.tools",
            tooltip: "Configure Tool Proficiencies",
        },
        {
            heading: localize("A5E.Size"),
            values: prepareCreatureSize(actorStore),
            dialogMethod: "configureSizeCategory",
            propertyKey: "system.traits.size",
            tooltip: "Configure Size Category",
        },
        {
            heading: localize("A5E.CreatureTypesLabel"),
            values: prepareCreatureTypes(actorStore),
            dialogMethod: "configureCreatureTypes",
            propertyKey: "system.details.creatureTypes",
            tooltip: "Configure Creature Types",
        },
        {
            heading: localize("A5E.CreatureTerrainsLabel"),
            values: prepareCreatureTerrains(actorStore),
            dialogMethod: "configureCreatureTerrains",
            propertyKey: "system.details.terrain",
            tooltip: "Configure Creature Terrains",
            display: actorStore.type === "npc",
        },
        {
            heading: localize("A5E.Alignments"),
            values: prepareAlignment(actorStore),
            dialogMethod: "configureAlignment",
            propertyKey: "system.traits.alignment",
            tooltip: "Configure Alignment",
        },
    ]);

    let sheetIsLocked = $derived(
        !actor.isOwner ? true : (actorStore.flags?.a5e?.sheetIsLocked ?? true),
    );
</script>

{#each details as { dialogMethod, display, heading, propertyKey, tooltip, values }}
    {#if (values.length || !sheetIsLocked) && (display ?? true)}
        <div class="a5e-actor-details__section">
            <span class="a5e-actor-details-heading"> {heading}: </span>
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
        }

        &-heading {
            font-size: var(--a5e-sm-text);
            font-weight: 600;
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
