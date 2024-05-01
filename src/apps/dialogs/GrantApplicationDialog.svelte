<svelte:options accessors={true} />

<script lang="ts">
    import { getContext } from "svelte";

    import prepareGrantsApplyData from "../../utils/prepareGrantsApplyData";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";
    import Section from "../components/Section.svelte";
    import ClassHitPointsSelection from "../components/ClassHitPointsSelection.svelte";

    export let {
        allGrants,
        dialog,
        optionalGrants,
        actor,
        item,
        cls,
        clsLevel,
    } =
        // @ts-ignore
        getContext("#external").application;

    // Create a list of grants to show based on selected optional
    // grants and those grants that have configurable properties
    function getApplicableGrants(selectedOptionalGrants: string[]) {
        const grantsList: any[] = [];

        // Add all non-optional grants and set config mode
        allGrants.forEach((grant) => {
            if (grant.optional) return;

            let requiresConfig = false;
            if (grant.requiresConfig()) requiresConfig = true;

            grantsList.push({ grant, requiresConfig, id: grant._id });
        });

        // Add all optional grants that are selected
        optionalGrants.forEach((grant: any) => {
            if (!selectedOptionalGrants.includes(grant._id)) return;

            let requiresConfig = false;
            if (grant.requiresConfig()) requiresConfig = true;

            grantsList.push({ grant, requiresConfig, id: grant._id });
        });

        return grantsList;
    }

    function onSubmit() {
        const { updateData, documentData } =
            prepareGrantsApplyData(actor, grants, applyData) ?? {};

        clsReturnData.spellcastingAbility = spellcastingAbility || "";

        dialog.submit({
            success: true,
            updateData,
            documentData,
            clsReturnData,
        });
    }

    let selectedOptionalGrants: string[] = [];
    let clsReturnData: Record<string, any> = {};
    let spellcastingAbility: string =
        cls?.system?.spellcasting?.ability?.options[0] ?? "";

    $: applyData = new Map<string, any>();
    $: grants = getApplicableGrants(selectedOptionalGrants);
    $: configurableGrants = grants.filter((grant) => grant.requiresConfig);

    $: spellCastingOptions = cls?.system?.spellcasting?.ability?.options?.map(
        (option: string) => [option, CONFIG.A5E.abilities[option]],
    );
</script>

<article>
    <section class="a5e-page-wrapper a5e-page-wrapper--scrollable">
        {#if cls && cls?.type === "class"}
            {#if cls.system.classLevels > 1}
                <ClassHitPointsSelection
                    {cls}
                    classLevel={clsLevel}
                    bind:clsReturnData
                />
            {/if}

            {#if cls.system.classLevels === 1 && cls.system.spellcasting.ability.options.length}
                <Section heading="Spellcasting Config">
                    <RadioGroup
                        options={spellCastingOptions}
                        allowDeselect={false}
                        selected={spellcastingAbility || ""}
                        on:updateSelection={({ detail }) =>
                            (spellcastingAbility = detail)}
                    />
                </Section>
            {/if}
        {/if}

        {#if optionalGrants.length}
            <Section heading="Optional Grants Selection">
                <CheckboxGroup
                    options={optionalGrants.map((grant) => [
                        grant._id,
                        grant.label,
                    ])}
                    selected={selectedOptionalGrants}
                    on:updateSelection={({ detail }) =>
                        (selectedOptionalGrants = detail)}
                />
            </Section>
        {/if}

        {#each configurableGrants as { grant, id }}
            <svelte:component
                this={grant.getSelectionComponent?.()}
                {...grant.getSelectionComponentProps?.()}
                {grant}
                on:updateSelection={({ detail }) => applyData.set(id, detail)}
            />
        {/each}

        <!-- TODO: Character Builder - Add a proper summary for the various grants -->
        <!-- <Section heading="Summary">
            <ul>
                {#each applyData.entries() as [id, { summary }]}
                    <li>
                        {id}: {summary}
                        {console.log(
                            prepareApplyData(actor, grants, applyData),
                        )}
                    </li>
                {/each}
            </ul>
        </Section> -->

        <button on:click|preventDefault={onSubmit}> Submit </button>
    </section>
</article>

<style lang="scss">
    article {
        padding: 0.75rem;
        max-height: 70vh;
    }
</style>
