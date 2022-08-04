<script>
    import { getContext } from "svelte";

    export let updatePath;

    const item = getContext("item");

    function onDrop(event) {
        try {
            const { uuid } = JSON.parse(
                event.dataTransfer.getData("text/plain")
            );

            $item.update({ [`system.${updatePath}`]: uuid });
        } catch (err) {
            console.error(err);
        }
    }
</script>

<div class="drop-area" on:drop|preventDefault|stopPropagation={onDrop}>
    <slot />
</div>

<style lang="scss">
    .drop-area {
        height: 5rem;
        background: #ccc;
        border-radius: 4px;
    }
</style>
