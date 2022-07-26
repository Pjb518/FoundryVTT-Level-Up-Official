<script>
    import { getContext } from "svelte";

    import AbilityScore from "./AbilityScore.svelte";
    import ArmorClass from "./ArmorClass.svelte";
    import AttributeWrapper from "./AttributeWrapper.svelte";
    import Health from "./Health.svelte";
    import Initiative from "./Initiative.svelte";
    import StatusTrack from "./StatusTrack.svelte";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    const actor = getContext("actor");
</script>

<header class="sheet-header">
    <div class="a5e-sheet-header__left">
        <img
            class="a5e-image a5e-image--actor-header"
            src={$actor.img}
            alt={$actor.name}
            title={$actor.name}
            data-edit="img"
        />

        <StatusTrack
            icon="fa-running"
            tooltipText="A5E.Fatigue"
            trackProperty="fatigue"
            value={$actor.system.attributes.fatigue}
        />

        <StatusTrack
            icon="fa-brain"
            tooltipText="A5E.Strife"
            trackProperty="strife"
            value={$actor.system.attributes.strife}
        />

        <Health />
    </div>

    <div class="u-flex u-gap-xl">
        <div class="u-flex-grow">
            <input
                v-else
                type="text"
                name="name"
                value={$actor.name}
                class="a5e-input a5e-input--character-name"
                placeholder="Name"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value
                    )}
            />
        </div>

        {#if $actor.type === "character"}
            <div class="u-flex u-text-medium">
                <input
                    class="a5e-input a5e-input--classes"
                    type="text"
                    name="system.details.classes"
                    value={$actor.system.details.classes}
                    placeholder="Class"
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                />
            </div>
        {/if}
    </div>

    <div>
        <ul class="ability-score-list">
            <AttributeWrapper heading="A5E.ArmorClassAbbr">
                <ArmorClass />
            </AttributeWrapper>

            <AttributeWrapper heading="A5E.Initiative">
                <Initiative />
            </AttributeWrapper>

            {#each Object.entries($actor.system.abilities) as [abilityLabel, ability]}
                <AttributeWrapper heading={abilityLabel}>
                    <AbilityScore {ability} {abilityLabel} />
                </AttributeWrapper>
            {/each}
        </ul>
    </div>
</header>

<style>
    .ability-score-list {
        display: flex;
        gap: 0.5rem;
        margin: 0;
        padding: 0;
        list-style: none;
        font-family: "Modesto Condensed", serif;
    }

    .sheet-header {
        display: grid;
        padding: 1rem;
        padding-bottom: 0.75rem;
        column-gap: 1rem;
        grid-template-areas:
            "left primary-details"
            "left secondary-details"
            "left movement"
            "left primary-attributes";
        grid-template-columns: max-content 1fr;
        row-gap: 0.25rem;
    }
</style>
