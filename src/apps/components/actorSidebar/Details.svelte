<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import FieldWrapper from "../FieldWrapper.svelte";
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
            localize("A5E.validations.warnings.modifiedByEffect"),
        );
    }

    $: details = [
        {
            heading: localize("A5E.Movement"),
            values: prepareMovementData($actor),
            dialogMethod: "configureMovement",
            propertyKey: "system.attributes.movement",
        },
        {
            heading: localize("A5E.SensesSpecial"),
            values: prepareSenses($actor),
            dialogMethod: "configureSenses",
            propertyKey: "system.attributes.senses",
        },
        {
            heading: localize("A5E.Languages"),
            values: prepareLanguageProficiencies($actor),
            dialogMethod: "configureLanguages",
            propertyKey: "system.proficiencies.languages",
        },
        {
            heading: localize("A5E.ConditionImmunities"),
            values: prepareConditionImmunities($actor),
            dialogMethod: "configureConditionImmunities",
            propertyKey: "system.traits.conditionImmunities",
        },
        {
            heading: localize("A5E.DamageImmunities"),
            values: prepareDamageImmunities($actor),
            dialogMethod: "configureDamageImmunities",
            propertyKey: "system.traits.damageImmunities",
        },
        {
            heading: localize("A5E.DamageResistances"),
            values: prepareDamageResistances($actor),
            dialogMethod: "configureDamageResistances",
            propertyKey: "system.traits.damageResistances",
        },
        {
            heading: localize("A5E.DamageVulnerabilities"),
            values: prepareDamageVulnerabilities($actor),
            dialogMethod: "configureDamageVulnerabilities",
            propertyKey: "system.traits.damageVulnerabilities",
        },
        {
            heading: localize("A5E.WeaponProficiencies"),
            values: prepareWeaponProficiencies($actor),
            dialogMethod: "configureWeaponProficiencies",
            propertyKey: "system.proficiencies.weapons",
        },
        {
            heading: localize("A5E.ArmorProficiencies"),
            values: prepareArmorProficiencies($actor),
            dialogMethod: "configureArmorProficiencies",
            propertyKey: "system.proficiencies.armor",
        },
        {
            heading: localize("A5E.ToolProficiencies"),
            values: prepareToolProficiencies($actor),
            dialogMethod: "configureToolProficiencies",
            propertyKey: "system.proficiencies.tools",
        },
        {
            heading: localize("A5E.Size"),
            values: prepareCreatureSize($actor),
            dialogMethod: "configureSizeCategory",
            propertyKey: "system.traits.size",
        },
        {
            heading: localize("A5E.CreatureTypesLabel"),
            values: prepareCreatureTypes($actor),
            dialogMethod: "configureCreatureTypes",
            propertyKey: "system.details.creatureTypes",
        },
    ];

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

{#each details as { heading, values, dialogMethod, propertyKey }}
    {#if values.length || !sheetIsLocked}
        <FieldWrapper
            {heading}
            buttons={[
                {
                    classes:
                        "fa-solid fa-gear a5e-field-wrapper__header-button--scale",
                    display: !sheetIsLocked,
                    handler: () => openConfig(dialogMethod, propertyKey),
                },
            ]}
            --a5e-field-wrapper-heading-weight="400"
            --a5e-header-button-color="rgba(0, 0, 0, 0.2)"
            --a5e-header-button-color-hover="#555"
        >
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
