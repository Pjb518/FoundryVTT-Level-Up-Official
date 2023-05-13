<script>
    import { getContext } from "svelte";

    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    export let { dialog, item } = getContext("#external").application;

    function onSubmit() {
        dialog.submit({ actionId: selectedAction });
    }

    let selectedAction = item.actions.keys()[0];
</script>

<form>
    <FormSection heading="Select an Action">
        <RadioGroup
            options={item.actions
                .entries()
                .map(([id, action]) => [id, action.name])}
            selected={selectedAction}
            on:updateSelection={({ detail }) => (selectedAction = detail)}
        />
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
</style>
