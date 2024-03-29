<script>
    import { getContext } from "svelte";

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
</script>

<article class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <Section heading="Metadata">
        Slug goes here. <br />
        Class levels go here. <br />
        Used hit dice go here. <br />
    </Section>

    <Section heading="Hit Dice">
        <FieldWrapper
            heading="Hit Dice Size"
            --a5e-field-wrapper-direction="row"
        >
            <select
                value={$item.system.hp.hitDiceSize}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.hp.hitDiceSize",
                        target.value,
                    )}
            >
                {#each hitDiceSize as [size, label]}
                    <option value={size}>{label}</option>
                {/each}
            </select>
        </FieldWrapper>
    </Section>

    <Section heading="Hit Points">HP level display set up goes here.</Section>

    <Section heading="Combat Maneuvers">
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

    <Section heading="Spell Casting">
        <RadioGroup
            heading="Key Ability"
            options={Object.entries(abilities)}
            selected={$item.system.spellcasting.ability}
            on:updateSelection={({ detail }) =>
                updateDocumentDataFromField(
                    $item,
                    "system.spellcasting.ability",
                    detail,
                )}
        />

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
    </Section>

    <Section heading="Wealth">
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
