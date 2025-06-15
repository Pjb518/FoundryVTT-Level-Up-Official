<script lang="ts">
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    type Props = {
        dialog: any;
        document: Item;
    };

    function onSubmit() {
        dialog.submit({ actionId: selectedAction });
        dialog.close();
    }

    let { dialog, document }: Props = $props();
    let item = document;

    let selectedAction = $state(item.actions.default.id);
    let options = [...item.actions.entries()]
        .map(([id, action]) => [id, action.name])
        .sort((a, b) => a[1].localeCompare(b[1]));
</script>

<form>
    <RadioGroup
        heading="Select an Action"
        {options}
        selected={selectedAction}
        onUpdateSelection={(value) => (selectedAction = value)}
    />

    <button
        onclick={(e) => {
            e.preventDefault();
            onSubmit();
        }}
    >
        Activate Action
    </button>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
    }
</style>
