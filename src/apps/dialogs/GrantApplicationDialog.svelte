<svelte:options accessors={true} />

<script lang="ts">
    import type { Grant } from "types/itemGrants";

    import { getContext, setContext } from "svelte";

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

    // Set contexts
    setContext("actor", actor);
    setContext("item", item);

    // Create a list of grants to show based on selected optional
    // grants and those grants that have configurable properties
    function getApplicableGrants(selectedOptionalGrants: string[]) {
        const grantsList: {
            grant: Grant;
            requiresConfig: boolean;
            id: string;
        }[] = [];

        // Add all non-optional grants and set config mode
        allGrants.forEach((grant: Grant) => {
            // console.log(grant.label, grant.grantedBy);

            if (grant.optional) return;

            let requiresConfig = false;
            if (grant.requiresConfig()) requiresConfig = true;

            grantsList.push({ grant, requiresConfig, id: grant._id });
        });

        // Add all optional grants that are selected
        optionalGrants.forEach((grant: Grant) => {
            // console.log(grant.label, grant.grantedBy);
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

        // Get ids of non-selected optional grants
        const grantExclusions = optionalGrants.reduce((acc, grant) => {
            if (!selectedOptionalGrants.includes(grant._id)) {
                acc.push(grant._id);
            }

            return acc;
        }, []);

        clsReturnData.spellcastingAbility = spellcastingAbility || "";

        dialog.submit({
            success: true,
            updateData,
            documentData,
            grantExclusions,
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
            {#if clsLevel > 1}
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
                {...grant.getSelectionComponentProps?.(applyData.get(id) ?? {})}
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
        display: flex;
        padding: 0.75rem;
        max-height: 70vh;
        overflow-y: auto;
    }
</style>
