<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

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
    import Tag from "../Tag.svelte";

    const actor = getContext("actor");

    $: details = [
        {
            label: localize("A5E.Movement"),
            values: prepareMovementData($actor),
            dialogMethod: "configureMovement",
        },
        {
            label: localize("A5E.SensesSpecial"),
            values: prepareSenses($actor),
            dialogMethod: "configureSenses",
        },
        {
            label: localize("A5E.Languages"),
            values: prepareLanguageProficiencies($actor),
            dialogMethod: "configureLanguages",
        },
        {
            label: localize("A5E.ConditionImmunities"),
            values: prepareConditionImmunities($actor),
            dialogMethod: "configureConditionImmunities",
        },
        {
            label: localize("A5E.DamageImmunities"),
            values: prepareDamageImmunities($actor),
            dialogMethod: "configureDamageImmunities",
        },
        {
            label: localize("A5E.DamageResistances"),
            values: prepareDamageResistances($actor),
            dialogMethod: "configureDamageResistances",
        },
        {
            label: localize("A5E.DamageVulnerabilities"),
            values: prepareDamageVulnerabilities($actor),
            dialogMethod: "configureDamageVulnerabilities",
        },
        {
            label: localize("A5E.WeaponProficiencies"),
            values: prepareWeaponProficiencies($actor),
            dialogMethod: "configureWeaponProficiencies",
        },
        {
            label: localize("A5E.ArmorProficiencies"),
            values: prepareArmorProficiencies($actor),
            dialogMethod: "configureArmorProficiencies",
        },
        {
            label: localize("A5E.ToolProficiencies"),
            values: prepareToolProficiencies($actor),
            dialogMethod: "configureToolProficiencies",
        },
        {
            label: localize("A5E.Size"),
            values: prepareCreatureSize($actor),
            dialogMethod: "configureSizeCategory",
        },
        {
            label: localize("A5E.CreatureTypesLabel"),
            values: prepareCreatureTypes($actor),
            dialogMethod: "configureCreatureTypes",
        },
    ];

    $: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

{#each details as { label, values, dialogMethod }}
    {#if values.length || !sheetIsLocked}
        <section class="details-section">
            <h2 class="details-header">
                {label}
            </h2>

            {#if !sheetIsLocked}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <i
                    class="fas fa-gear a5e-config-button details-config"
                    on:click={() => $actor[dialogMethod]()}
                />
            {/if}

            <ul class="details-list">
                {#each values as tag}
                    <!-- <li class="a5e-tag a5e-tag--tight details-tag">
                        {tag}
                    </li> -->
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
        font-family: "Signika", sans-serif;
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

    .details-tag {
        border: 1px solid #ccc;
        background-color: rgba(0 0 0 / 0.05);
        border-radius: 3px;
        color: black;
        max-width: 98%;
        white-space: normal;
    }
</style>
