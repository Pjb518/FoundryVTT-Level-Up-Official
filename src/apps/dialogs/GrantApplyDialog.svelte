<svelte:options accessors={true} />

<script lang="ts">
    import { getContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
    import { localize } from "#runtime/svelte/helper";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import Section from "../components/Section.svelte";

    export let { allGrants, optionalGrants, actor } =
        // @ts-ignore
        getContext("#external").application;

    function nextGrant() {
        console.log(applyData);

        if (state === 0) {
            state = 1;
            return;
        }

        if (state === 1 && progress === total - 1) {
            state = 2;
            return;
        }

        if (progress === total - 1) return;

        progress = progress + 1;
        currentGrant = configurableGrants[progress];
    }

    function previousGrant() {
        if (progress === total - 1 && state === 2) {
            state = 1;
            return;
        }

        if (progress === 0 && state === 1) {
            state = 0;
            return;
        }

        if (progress === 0) return;

        progress = progress - 1;
        currentGrant = configurableGrants[progress];
    }

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

    let applyData = new Map<string, any>();
    let progress = 0;
    let selectedOptionalGrants: string[] = [];
    let state = optionalGrants.length ? 0 : 1;

    $: grants = getApplicableGrants(selectedOptionalGrants);
    $: configurableGrants = grants.filter((grant) => grant.requiresConfig);
    $: totalApplicable = grants.length;
    $: total = configurableGrants.length;

    $: currentGrant = configurableGrants[progress];
    $: CurrentComponent = currentGrant?.grant?.getSelectionComponent?.();
    $: currentComponentProps =
        currentGrant?.grant?.getSelectionComponentProps?.();

    $: progressDisplay =
        state === 0 ? 0 : state === 1 ? progress : progress + 1;
    $: progressTooltip = `
        Total Applicable Grants: ${totalApplicable}
        Total Configurable Grants: ${total}
        Current Grant: ${currentGrant?.grant?.label}
        Current Grant Progress: ${progress + 1} / ${total}
    `;
</script>

<article>
    <!-- Progress Bar -->
    <div class="progress-bar-wrapper">
        <button
            class="nav-button"
            disabled={state === 0 && progress === 0}
            on:click={previousGrant}
        >
            <i class="fa-solid fa-chevron-left" />
        </button>

        <div
            class="progress-bar"
            data-tooltip={progressTooltip}
            data-tooltip-direction="UP"
        >
            {progressDisplay} / {total}
        </div>

        <button
            class="nav-button"
            disabled={state === 2 && progress >= total - 1}
            on:click={nextGrant}
        >
            <i class="fa-solid fa-chevron-right" />
        </button>
    </div>

    {#if state === 0}
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

    <!-- Current Grant -->
    {#if state === 1}
        <svelte:component
            this={CurrentComponent}
            {...currentComponentProps}
            grant={currentGrant.grant}
            on:updateSelection={({ detail }) =>
                applyData.set(currentGrant.id, detail)}
        />
    {/if}

    <!-- Summary and Submit Page -->
    {#if state === 2}
        <Section heading="Summary">
            <ul>
                {#each applyData.entries() as [id, { summary }]}
                    <li>
                        {id}: {summary}
                    </li>
                {/each}
            </ul>
        </Section>

        <button> Submit </button>
    {/if}
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.75rem;
    }

    .progress-bar-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }

    .progress-bar {
        display: flex;
        flex-grow: 1;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        border-radius: 0.3rem;
        height: 1.5rem;
        border: 1px solid black;
        background-color: var(--color-primary);
        color: var(--color-primary-text);
    }

    .nav-button {
        display: flex;
        justify-content: center;
        align-items: center;
        background: transparent;
        border: 0;
        padding: 0;
        width: min-content;
        transition: all 0.15s ease-in-out;

        &:hover,
        &:focus {
            transform: scale(1.2);
            box-shadow: none;
        }
    }
</style>
