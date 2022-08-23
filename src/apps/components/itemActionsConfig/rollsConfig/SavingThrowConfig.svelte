<script>
    import RollTypeConfig from "./RollTypeConfig.svelte";

    export let action;
    export let actionId;
    export let item;
    export let roll;
    export let rollId;
</script>

<RollTypeConfig {action} {actionId} {item} {roll} {rollId} />
