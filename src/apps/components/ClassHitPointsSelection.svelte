<script lang="ts">
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import FieldWrapper from "./FieldWrapper.svelte";
    import RadioGroup from "./RadioGroup.svelte";
    import Section from "./Section.svelte";

    export let cls: any;
    export let classLevel: number;

    function updateHpValue(value: number) {
        updateDocumentDataFromField(
            cls,
            `system.hp.levels.${classLevel}`,
            value,
        );
    }

    // @ts-ignore
    const { classHPTypes } = CONFIG.A5E;
    // TODO: Get default from world settings
    let leveledHpType = "average";

    // @ts-ignore
    $: hp = foundry.utils.getProperty(cls, `system.hp.levels.${classLevel}`);

    if (leveledHpType === "average") {
        updateHpValue(cls.averageHP);
    }
</script>

<Section heading="Hit Points Configuration" --a5e-section-body-gap="0.75rem">
    <RadioGroup
        options={Object.entries(classHPTypes)}
        selected={leveledHpType}
        allowDeselect={false}
        on:updateSelection={({ detail }) => (leveledHpType = detail)}
    />

    {#if leveledHpType === "average"}
        <h3 class="u-text-sm u-text-bold">{cls.averageHP}</h3>
    {:else if leveledHpType === "roll"}
        <!-- TODO: Roll thingy -->
    {:else if leveledHpType === "custom"}
        <FieldWrapper>
            <input
                class="a5e-input a5e-input--small a5e-input--slim"
                type="number"
                min="0"
                value={hp ?? 0}
                on:change={({ target }) => {
                    // @ts-ignore
                    updateHpValue(target?.value);
                }}
            />
        </FieldWrapper>
    {/if}
</Section>
