<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let action;
    export let { actionId, item } = getContext("external").application;

    function addPrompt() {
        const newPrompt = {
            type: "save",
        };

        $item.update({
            [`system.actions.${actionId}.prompts`]: {
                ...action.prompts,
                [foundry.utils.randomID()]: newPrompt,
            },
        });
    }

    function addRangeIncrement() {
        const newRange = {
            range: "short",
        };

        $item.update({
            [`system.actions.${actionId}.ranges`]: {
                ...action.ranges,
                [foundry.utils.randomID()]: newRange,
            },
        });
    }

    function addRoll() {
        const newRoll = {
            type: "attack",
        };

        $item.update({
            [`system.actions.${actionId}.rolls`]: {
                ...action.rolls,
                [foundry.utils.randomID()]: newRoll,
            },
        });
    }

    function deletePrompt(event) {
        const { promptId } = event.target.closest(".prompt").dataset;

        item.get("document").update({
            [`system.actions.${actionId}.prompts`]: {
                [`-=${promptId}`]: null,
            },
        });
    }

    function deleteRangeIncrement(event) {
        const { rangeId } = event.target.closest(".range-increment").dataset;

        item.get("document").update({
            [`system.actions.${actionId}.ranges`]: {
                [`-=${rangeId}`]: null,
            },
        });
    }

    function deleteRoll(event) {
        const { rollId } = event.target.closest(".roll").dataset;

        item.get("document").update({
            [`system.actions.${actionId}.rolls`]: {
                [`-=${rollId}`]: null,
            },
        });
    }

    $: action = $item.system.actions[actionId];
</script>

<main>
    <header class="action-header">
        <input
            class="a5e-input a5e-input--character-name"
            type="text"
            name="name"
            value={$item.system.actions[actionId]?.name}
            placeholder="Action Name"
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $item,
                    `system.actions.${actionId}.name`,
                    target.value
                )}
        />
    </header>

    <section class="action-form">
        <section class="form-section">
            <header class="form-section-header">
                <h2>Range</h2>

                <a on:click={addRangeIncrement}>+ Add Range Increment</a>
            </header>

            <ul class="section-list">
                {#each Object.entries(action.ranges ?? {}) as [id, { range }] (id)}
                    <li class="range-increment" data-range-id={id}>
                        {range}

                        <i
                            class="delete-button fas fa-trash"
                            on:click={deleteRangeIncrement}
                        />
                    </li>
                {:else}
                    <li>None</li>
                {/each}
            </ul>
        </section>

        <section class="form-section">
            <header class="form-section-header">
                <h2>Rolls</h2>

                <a on:click={addRoll}>+ Add Roll</a>
            </header>

            <ul class="section-list">
                {#each Object.entries(action.rolls ?? {}) as [id, roll] (id)}
                    <li class="roll" data-roll-id={id}>
                        {roll.type}

                        <i
                            class="delete-button fas fa-trash"
                            on:click={deleteRoll}
                        />
                    </li>
                {:else}
                    <li>None</li>
                {/each}
            </ul>
        </section>

        <section class="form-section">
            <header class="form-section-header">
                <h2>Prompts</h2>

                <a on:click={addPrompt}>+ Add Prompt</a>
            </header>

            <ul class="section-list">
                {#each Object.entries(action.prompts ?? {}) as [id, prompt] (id)}
                    <li class="prompt" data-prompt-id={id}>
                        {prompt.type}

                        <i
                            class="delete-button fas fa-trash"
                            on:click={deletePrompt}
                        />
                    </li>
                {:else}
                    <li>None</li>
                {/each}
            </ul>
        </section>
    </section>
</main>

<style lang="scss">
    :global {
        .a5e-sheet .dialog-content {
            height: 100%;
        }
    }

    main {
        height: 100%;
        overflow: auto;
    }

    .action {
        &-form {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            padding: 0.75rem;
        }

        &-header {
            padding: 0.75rem;
            border-bottom: 1px solid #ccc;
        }
    }

    .delete-button {
        color: #8b2525;
        margin-left: auto;
        margin-right: 0.5rem;
        padding: 0.25rem;
        cursor: pointer;
        transition: all 0.15s ease-in-out;

        &:hover {
            transform: scale(1.2);
        }
    }

    .form-section {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
        font-family: "Modesto Condensed", serif;
        font-size: 1rem;
        background: #ccc;
        padding: 0.5rem 0.75rem;
        border-radius: 3px;

        &-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }

    .prompt,
    .range-increment,
    .roll {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.25rem 0.5rem;
        border: 1px solid #bbb;
        border-radius: 3px;
    }

    .section-list {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        gap: 0.25rem;
        list-style: none;
    }
</style>
