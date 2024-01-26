<svelte:options accessors={true} />

<script lang="ts">
    import { getContext } from "svelte";

    import prepareGrantsApplyData from "../../utils/prepareGrantsApplyData";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import Section from "../components/Section.svelte";

    export let { allGrants, dialog, optionalGrants, actor } =
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
        const updateData = prepareGrantsApplyData(actor, grants, applyData);
        dialog.submit({
            success: true,
            updateData,
        });
    }

    $: applyData = new Map<string, any>();
    let selectedOptionalGrants: string[] = [];

    $: grants = getApplicableGrants(selectedOptionalGrants);
    $: configurableGrants = grants.filter((grant) => grant.requiresConfig);
</script>

<article>
    <section class="a5e-page-wrapper a5e-page-wrapper--scrollable">
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

        {#each configurableGrants as { grant, id }}
            <svelte:component
                this={grant.getSelectionComponent?.()}
                {...grant.getSelectionComponentProps?.()}
                {grant}
                on:updateSelection={({ detail }) => applyData.set(id, detail)}
            />
        {/each}

        <!-- TODO: Add a proper summary for the various grants -->
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
    }
</style>
