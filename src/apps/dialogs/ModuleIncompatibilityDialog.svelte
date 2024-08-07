<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";

    async function deactivateIncompatibleModules() {
        const modules = game.settings.get("core", "moduleConfiguration");

        const moduleUpdates = activeIncompatibleModules.reduce((updates, [key]) => {
            updates[key] = false;
            return updates;
        }, {});

        await game.settings.set(
            "core",
            "moduleConfiguration",
            foundry.utils.mergeObject(modules, moduleUpdates),
        );

        window.location.reload();
    }

    function getPriorityColor(priorityLevel) {
        switch (priorityLevel) {
            case "low":
                return "color: #ffb404;";
            case "medium":
                return "color: #fe8006;";
            case "high":
                return "color: #fe3901;";
        }
    }

    function getPriorityTooltipLabel(priorityLevel) {
        switch (priorityLevel) {
            case "low":
                return "Low Priority: No Adverse Effects";
            case "medium":
                return "Medium Priority: Limited Adverse Effects on System Functionality";
            case "high":
                return "High Priority: Adverse Effects on System Functionality";
        }
    }

    export let { activeIncompatibleModules } = getContext("#external").application;

    $: modules = activeIncompatibleModules.map(([module, { reason, priority }]) => [
        game.modules.get(module)?.title,
        reason,
        priority,
    ]);
</script>

<article class="main-announcement-container">
    <ul class="module-list">
        {#each modules as [moduleTitle, reason, priority]}
            <li>
                <header class="module__header">
                    <h3 class="module__title">{moduleTitle}</h3>

                    <i
                        class="module__priority-icon fa-solid fa-circle"
                        style={getPriorityColor(priority)}
                        data-tooltip={getPriorityTooltipLabel(priority)}
                        data-tooltip-direction="UP"
                    ></i>
                </header>
                {reason}
            </li>
        {/each}
    </ul>

    <button on:click={() => deactivateIncompatibleModules()}> Deactivate All </button>
</article>

<style lang="scss">
    :global(.a5e-sheet--announcement) {
        max-height: 90vh;
        overflow: hidden;
    }

    :global(.a5e-sheet--announcement main) {
        height: 100%;
        overflow-y: auto;
    }

    .main-announcement-container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.5rem;
    }

    .module-list {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .module {
        &__header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: var(--a5e-text-size-sm);
        }

        &__priority-icon {
            cursor: pointer;
        }

        &__title {
            font-weight: bold;
        }
    }
</style>
