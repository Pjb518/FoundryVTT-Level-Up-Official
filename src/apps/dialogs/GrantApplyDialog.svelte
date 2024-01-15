<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
    import { localize } from "#runtime/svelte/helper";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import Section from "../components/Section.svelte";

    export let { grants, optionalGrants, actor } =
        getContext("#external").application;

    console.log(grants, optionalGrants, actor);

    function nextGrant() {
        progress = progress + 1;
        if (progress >= grants.length) return;
        currentGrant = grants[progress];
    }

    function previousGrant() {
        progress = progress - 1;
        if (progress < 0) return;
        currentGrant = grants[progress];
    }

    let total = grants.length;
    let progress = -1;
    let selectedOptionalGrants = [];

    let currentGrant = grants[0];
    $: CurrentComponent = currentGrant?.getSelectionComponent();
    $: currentComponentProps = currentGrant?.getSelectionComponentProps();
</script>

<article>
    <!-- Progress Bar -->
    <div class="progress-bar-wrapper">
        <button
            class="nav-button"
            disabled={progress <= -1}
            on:click={previousGrant}
        >
            <i class="fa-solid fa-chevron-left" />
        </button>

        <div class="progress-bar">
            {Math.max(progress, 0)} / {total}
        </div>

        <button
            class="nav-button"
            disabled={progress >= total - 1}
            on:click={nextGrant}
        >
            <i class="fa-solid fa-chevron-right" />
        </button>
    </div>

    <!-- TODO: Display before if optional grants available -->
    {#if progress === -1 && optionalGrants.length}
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
    {#if progress >= 0}
        <svelte:component
            this={CurrentComponent}
            {...currentComponentProps}
            grant={currentGrant}
        />
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
