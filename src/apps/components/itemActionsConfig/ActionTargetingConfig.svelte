<script>
    export let actionId;
    export let item;

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

    function deleteRangeIncrement(event) {
        const { rangeId } = event.target.closest(".range-increment").dataset;

        item.get("document").update({
            [`system.actions.${actionId}.ranges`]: {
                [`-=${rangeId}`]: null,
            },
        });
    }

    $: action = $item.system.actions[actionId];
</script>

<header class="section-header">
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
        <li class="none">None</li>
    {/each}
</ul>

<style lang="scss">
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

    .none {
        color: #555;
        text-align: center;
        font-size: 1rem;
    }

    .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.25rem 0.25rem 0.25rem;
        font-family: "Modesto Condensed", serif;
        font-size: 1rem;
        border-bottom: 1px solid #ccc;
    }

    .range-increment {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem;
        border: 1px solid #bbb;
        border-radius: 3px;
        font-size: 1rem;
    }

    .section-list {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        gap: 0.25rem;
        list-style: none;
        font-family: "Modesto Condensed", serif;
    }
</style>
