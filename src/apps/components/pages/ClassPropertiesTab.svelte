<script>
    import { getContext } from "svelte";

    import getHPComponents from "../../../utils/getHPComponents";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Section from "../Section.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    const item = getContext("item");
    const abilities = { none: "None", ...CONFIG.A5E.abilities };
    const casterTypes = CONFIG.A5E.casterTypes;
    const hitDiceSize = [
        [6, "d6"],
        [8, "d8"],
        [10, "d10"],
        [12, "d12"],
    ];

    $: classLevel = $item.system.classLevels;
    $: totalHp = getHPComponents($item.parent);
</script>

<article class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <Section heading="Metadata" --a5e-section-body-gap="0.75rem">
        <FieldWrapper heading="Class Identifier">
            <input
                class="a5e-input a5e-input--slim"
                value={$item.system.slug || $item.slug || ""}
                type="text"
                on:change={({ target }) => {
                    updateDocumentDataFromField(
                        $item,
                        "system.slug",
                        target.value.slugify(),
                    );
                }}
            />
        </FieldWrapper>
    </Section>

    <Section heading="Hit Dice" --a5e-section-body-gap="0.75rem">
        <RadioGroup
            heading="Hit Dice Size"
            options={hitDiceSize}
            selected={$item.system.hp.hitDiceSize}
            on:updateSelection={({ detail }) =>
                updateDocumentDataFromField(
                    $item,
                    "system.hp.hitDiceSize",
                    detail,
                )}
        />

        <FieldWrapper heading="Hit Dice Used">
            <input
                class="a5e-input a5e-input--small a5e-input--slim"
                type="number"
                value={$item.system.hp.hitDiceUsed}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.hp.hitDiceUsed",
                        Number(target.value),
                    )}
            />
        </FieldWrapper>
    </Section>

    <Section heading="Hit Points" --a5e-section-body-gap="0.75rem">
        <div class="class-hit-point-container">
            {#each Object.entries($item.system.hp.levels) as [level, hp]}
                {#if level <= classLevel}
                    <!-- {#if true} -->
                    <input
                        class="a5e-input a5e-input--small a5e-input--slim"
                        type="number"
                        value={hp ?? 0}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                `system.hp.levels.${level}`,
                                Number(target.value),
                            )}
                    />
                {/if}
            {/each}
        </div>

        <hr class="a5e-rule" />

        <span> {totalHp}</span>
    </Section>

    <Section heading="Combat Maneuvers" --a5e-section-body-gap="0.75rem">
        <FieldWrapper heading="Starting Manuevers Count">
            <input
                class="a5e-input a5e-input--small a5e-input--slim"
                type="number"
                value={$item.system.combatManeuvers.startingManeuvers}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.combatManeuvers.startingManeuvers",
                        Number(target.value),
                    )}
            />
        </FieldWrapper>
    </Section>

    <Section heading="Spell Casting" --a5e-section-body-gap="0.75rem">
        <RadioGroup
            heading="Spellcasting Ability"
            options={Object.entries(abilities)}
            selected={$item.system.spellcasting.ability}
            on:updateSelection={({ detail }) =>
                updateDocumentDataFromField(
                    $item,
                    "system.spellcasting.ability",
                    detail,
                )}
        />

        {#if $item.system.spellcasting.ability !== "none"}
            <RadioGroup
                heading="Caster Type"
                options={Object.entries(casterTypes)}
                selected={$item.system.spellcasting.casterType}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.spellcasting.casterType",
                        detail,
                    )}
            />

            Known cantrips go here. <br />
            Known spells go here. <br />
        {/if}
    </Section>

    <Section heading="Wealth" --a5e-section-body-gap="0.75rem">
        <input
            type="text"
            value={$item.system.wealth}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    "system.wealth",
                    target.value,
                )}
        />
    </Section>
</article>

<style lang="scss">
    .class-hit-point-container {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 0.5rem;
    }
</style>
