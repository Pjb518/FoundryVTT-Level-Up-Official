<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";

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

    export let { activeIncompatibleModules } =
        getContext("#external").application;
</script>

<article class="main-announcement-container">
    <ul class="module-list">
        {#each activeIncompatibleModules as [module, { reason, priority }]}
            <li>
                <header class="module__header">
                    <h3 class="module__title">
                        {game.modules.get(module)?.title}
                    </h3>

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
            font-size: 0.833rem;
        }

        &__priority-icon {
            cursor: pointer;
        }

        &__title {
            font-weight: bold;
        }
    }
</style>
