<script>
    import CheckboxGroup from "../CheckboxGroup.svelte";
    import FormSection from "../FormSection.svelte";

    export let selectedRolls;
    export let rolls;

    function getInvalidSelections(property) {
        return Object.values(property ?? {})
            .flat()
            .reduce((acc, [key, value]) => {
                if (
                    ["generic", "healing", "damage"].includes(value.type) &&
                    !value.formula
                ) {
                    acc.push(key);
                }

                return acc;
            }, []);
    }

    const rollHeadingMap = {
        abilityCheck: "Ability Checks",
        damage: "Damage Rolls",
        generic: "Generic Rolls",
        healing: "Healing Rolls",
        savingThrow: "Saving Throws",
        skillCheck: "Skill Checks",
        toolCheck: "Tool Checks",
    };

    const otherRolls = Object.entries(rolls).reduce(
        (acc, [rollType, rolls]) => {
            if (rollType === "attack") return acc;
            acc[rollType] = rolls;

            return acc;
        },
        {}
    );

    let disabledRolls = getInvalidSelections(rolls);
</script>

<FormSection hint="A5E.RollsHint">
    <div class="roll-wrapper">
        {#each Object.entries(otherRolls) as [rollType, _rolls]}
            {#if _rolls.length}
                <section>
                    <h3 class="section-subheading">
                        {rollHeadingMap[rollType]}
                    </h3>

                    <CheckboxGroup
                        options={_rolls.map(([key, roll]) => [
                            key,
                            roll.label || roll.defaultLabel,
                        ])}
                        disabledOptions={disabledRolls}
                        selected={selectedRolls}
                        on:updateSelection={(event) =>
                            (selectedRolls = event.detail)}
                    />
                </section>
            {/if}
        {/each}
    </div>
</FormSection>

<style lang="scss">
    .roll-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .section-subheading {
        width: 100%;
        font-size: $font-size-sm;
        font-weight: bold;
        margin-bottom: 0.25rem;
    }
</style>
