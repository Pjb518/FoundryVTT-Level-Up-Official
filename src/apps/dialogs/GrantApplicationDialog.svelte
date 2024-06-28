<svelte:options accessors={true} />

<script lang="ts">
    import type { Grant } from "types/itemGrants";

    import { getContext, setContext } from "svelte";

    import prepareGrantsApplyData from "../../utils/prepareGrantsApplyData";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";
    import Section from "../components/Section.svelte";
    import ClassHitPointsSelection from "../components/ClassHitPointsSelection.svelte";

    export let { allGrants, dialog, optionalGrantsProp, actor, item, cls, clsLevel } =
        // @ts-ignore
        getContext("#external").application;

    // Set contexts
    setContext("actor", actor);
    setContext("item", item);

    function getStartingSelectedGrants(): Set<string> {
        return allGrants.reduce((acc: Set<string>, grant: Grant) => {
            if (!grant.grantedBy?.id) acc.add(grant._id);
            return acc;
        }, new Set<string>());
    }

    function getStartingOptionalGrants() {
        return optionalGrantsProp.filter((grant: Grant) => {
            if (!grant.grantedBy?.id) return true;
            return false;
        });
    }

    function updateActiveGrants() {
        const updatedList = getStartingSelectedGrants();

        // Get selected feature grants
        allGrants.forEach((grant: Grant) => {
            if (grant.grantType !== "feature") return;
            if (applyData.has(grant._id)) updatedList.add(grant._id);
        });

        // Update optional grants
        optionalGrants = optionalGrantsProp.filter((grant: Grant) => {
            if (!grant.grantedBy?.id) return true;
            if (!updatedList.has(grant.grantedBy.id)) return false;

            const uuids = applyData.get(grant.grantedBy.id)?.uuids ?? [];
            const hasSelectionId = grant.grantedBy.selectionId
                ? uuids.includes(grant.grantedBy.selectionId)
                : false;

            if (hasSelectionId) return true;

            return false;
        });

        // // Update active grants
        activeGrants = new Set<string>([...updatedList, ...selectedOptionalGrants]);

        // // Update grants
        grants = getApplicableGrants(activeGrants, selectedOptionalGrants);
        configurableGrants = grants.filter((grant) => grant.requiresConfig);
    }

    // Create a list of grants to show based on selected optional
    // grants and those grants that have configurable properties
    function getApplicableGrants(
        activeGrants: Set<string>,
        selectedOptionalGrants: string[],
    ) {
        const grantsList: {
            grant: Grant;
            requiresConfig: boolean;
            id: string;
        }[] = [];

        // Add all non-optional grants and set config mode
        allGrants.forEach((grant: Grant) => {
            const { grantedBy } = grant;
            if (grantedBy?.id && !activeGrants.has(grantedBy.id)) return;

            const uuids: string[] = applyData.get(grantedBy?.id ?? "")?.uuids ?? [];
            const hasSelectionId = grantedBy?.selectionId
                ? uuids.includes(grantedBy.selectionId)
                : true;

            if (grantedBy?.id && uuids && !hasSelectionId) return;
            if (grant.optional) return;

            let requiresConfig = false;
            if (grant.requiresConfig()) requiresConfig = true;

            grantsList.push({ grant, requiresConfig, id: grant._id });
            activeGrants.add(grant._id);
        });

        // Add all optional grants that are selected
        optionalGrants.forEach((grant: Grant) => {
            const { grantedBy } = grant;
            if (grantedBy?.id && !activeGrants.has(grantedBy.id)) {
                return;
            }

            const uuids: string[] = applyData.get(grantedBy?.id ?? "")?.uuids ?? [];
            const hasSelectionId = grantedBy?.selectionId
                ? uuids.includes(grantedBy.selectionId)
                : true;

            if (grantedBy?.id && !hasSelectionId) return;
            if (!selectedOptionalGrants.includes(grant._id)) return;

            let requiresConfig = false;
            if (grant.requiresConfig()) requiresConfig = true;

            grantsList.push({ grant, requiresConfig, id: grant._id });
            activeGrants.add(grant._id);
        });

        return grantsList;
    }

    function getArchetypeChoices() {
        console.log(cls);
        console.log(clsLevel, cls.system.archetypeLevel);
        if (!cls) return [];
        if (clsLevel !== cls.system.archetypeLevel) return [];

        const classIdentifier = cls?.slug;

        const options = (game as Game).packs.reduce((acc: string[][], pack) => {
            if (pack.metadata.type !== "Item") return acc;

            const uuids = pack.index.reduce((acc2: string[][], i) => {
                if (i.type !== "archetype") return acc2;
                if (i.system.class !== classIdentifier) return acc2;

                acc2.push([i.uuid, i.name || ""]);
                return acc2;
            }, []);

            acc.push(...uuids);
            return acc;
        }, []);

        return options;
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

    let activeGrants: Set<string> = getStartingSelectedGrants();
    let selectedOptionalGrants: string[] = [];
    let clsReturnData: Record<string, any> = {};
    let spellcastingAbility: string =
        cls?.system?.spellcasting?.ability?.options[0] ?? "";

    let archetypeChoices = getArchetypeChoices();

    $: applyData = new Map<string, any>();
    $: grants = getApplicableGrants(activeGrants, selectedOptionalGrants);
    $: optionalGrants = getStartingOptionalGrants();
    $: configurableGrants = grants.filter((grant) => grant.requiresConfig);

    $: spellCastingOptions = cls?.system?.spellcasting?.ability?.options?.map(
        (option: string) => [option, CONFIG.A5E.abilities[option]],
    );

    $: selectedOptionalGrants, applyData, updateActiveGrants();
</script>

<article>
    <section class="a5e-page-wrapper a5e-page-wrapper--scrollable">
        {#if cls && cls?.type === "class"}
            {#if clsLevel > 1}
                <ClassHitPointsSelection {cls} classLevel={clsLevel} bind:clsReturnData />
            {/if}

            {#if clsLevel === 1 && cls.system.spellcasting.ability.options.length}
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

            {#if archetypeChoices.length}
                <Section heading="Archetype Selection">
                    <RadioGroup
                        options={archetypeChoices}
                        allowDeselect={false}
                        selected={clsReturnData.archetype || ""}
                        on:updateSelection={({ detail }) =>
                            (clsReturnData.archetype = detail)}
                    />
                </Section>
            {/if}
        {/if}

        {#if optionalGrants.length}
            <Section heading="Optional Grants Selection">
                <CheckboxGroup
                    options={optionalGrants.map((grant) => [grant._id, grant.label])}
                    selected={selectedOptionalGrants}
                    on:updateSelection={({ detail }) => (selectedOptionalGrants = detail)}
                />
            </Section>
        {/if}

        {#key applyData}
            {#each configurableGrants as { grant, id }}
                <svelte:component
                    this={grant.getSelectionComponent?.()}
                    {...grant.getSelectionComponentProps?.(applyData.get(id) ?? {})}
                    {grant}
                    on:updateSelection={({ detail }) => {
                        applyData.set(id, detail);
                        applyData = applyData;
                    }}
                />
            {/each}
        {/key}

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
