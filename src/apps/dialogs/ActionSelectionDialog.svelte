<script>
    import { getContext } from "svelte";

    import FormSection from "../components/FormSection.svelte";

    export let { dialog, item } = getContext("#external").application;

    const randomId = foundry.utils.randomID();

    function onSubmit() {
        dialog.submit({ actionId: selectedAction });
    }

    let selectedAction = item.actions.keys()[0];
</script>

<form>
    <FormSection heading="Select an Action">
        <div class="options">
            {#each item.actions.entries() as [id, action]}
                <input
                    class="u-hidden"
                    type="radio"
                    id={`${randomId}-action-${id}`}
                    value={id}
                    bind:group={selectedAction}
                />

                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <label
                    class="option u-text-center"
                    class:active={selectedAction === id}
                    for={`${randomId}-action-${id}`}
                >
                    {action.name}
                </label>
            {/each}
        </div>
    </FormSection>

    <button on:click|preventDefault={onSubmit}>Activate Action</button>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
        background: rgba(246, 242, 235, 0.5);
    }

    .options {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        width: 100%;
    }

    .option {
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 3px;
        transition: all ease-in-out 0.15s;
        white-space: nowrap;
        border: 1px solid #7e7960;
    }

    .active {
        background: #425f65;
        border-color: darken(#425f65, 5%);
        color: lighten(#425f65, 80%);
    }
</style>
