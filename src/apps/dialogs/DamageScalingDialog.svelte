<script>
    export let actionId;
    export let dialog;
    export let item;
    export let rollId;

    $: roll = $item.actions[actionId].rolls[rollId];
</script>

<form>{roll.formula}</form>
