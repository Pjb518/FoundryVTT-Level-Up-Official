<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import prepareArmorProficiencies from "../../handlers/prepareArmorProficiencies";
    import prepareConditionImmunities from "../../handlers/prepareConditionImmunities";
    import prepareCreatureTypes from "../../handlers/prepareCreatureTypes";
    import prepareCreatureSize from "../../handlers/prepareCreatureSize";
    import prepareDamageImmunities from "../../handlers/prepareDamageImmunities";
    import prepareDamageResistances from "../../handlers/prepareDamageResistances";
    import prepareDamageVulnerabilities from "../../handlers/prepareDamageVulnerabilities";
    import prepareLanguageProficiencies from "../../handlers/prepareLanguageProficiencies";
    import prepareSenses from "../../handlers/prepareSenses";
    import prepareMovementData from "../../handlers/prepareMovementData";
    import prepareToolProficiencies from "../../handlers/prepareToolProficiencies";
    import prepareWeaponProficiencies from "../../handlers/prepareWeaponProficiencies";

    const actor = getContext("actor");

    $: details = [
        {
            label: localize("A5E.Movement"),
            values: prepareMovementData($actor),
        },
        { label: localize("A5E.SensesSpecial"), values: prepareSenses($actor) },
        {
            label: localize("A5E.Languages"),
            values: prepareLanguageProficiencies($actor),
        },
        {
            label: localize("A5E.ConditionImmunities"),
            values: prepareConditionImmunities($actor),
        },
        {
            label: localize("A5E.DamageImmunities"),
            values: prepareDamageImmunities($actor),
        },
        {
            label: localize("A5E.DamageResistances"),
            values: prepareDamageResistances($actor),
        },
        {
            label: localize("A5E.DamageVulnerabilities"),
            values: prepareDamageVulnerabilities($actor),
        },
        {
            label: localize("A5E.WeaponProficiencies"),
            values: prepareWeaponProficiencies($actor),
        },
        {
            label: localize("A5E.ArmorProficiencies"),
            values: prepareArmorProficiencies($actor),
        },
        {
            label: localize("A5E.ToolProficiencies"),
            values: prepareToolProficiencies($actor),
        },
        {
            label: localize("A5E.Size"),
            values: prepareCreatureSize($actor),
        },
        {
            label: localize("A5E.CreatureTypesLabel"),
            values: prepareCreatureTypes($actor),
        },
    ];

    $: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

{#each details as { label, values }}
    {#if values.length || !sheetIsLocked}
        <section class="details-section">
            <h2 class="details-header">
                {label}
            </h2>

            {#if !sheetIsLocked}
                <i class="fas fa-gear a5e-config-button details-config" />
            {/if}

            <ul class="details-list">
                {#each values as tag}
                    <li class="a5e-tag a5e-tag--tight details-tag">
                        {tag}
                    </li>
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
        font-family: "Modesto Condensed", serif;
        font-size: 1rem;
        margin-bottom: 0.25rem;
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
