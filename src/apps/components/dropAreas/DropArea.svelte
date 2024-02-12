<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import FieldWrapper from "../FieldWrapper.svelte";

    export let type = "";
    export let documentType = "";

    function onDrop(dragEvent: DragEvent) {
        if (!type) dispatch("document-dropped", dragEvent);

        if (type === "uuid") {
            try {
                const dataTransfer = dragEvent.dataTransfer;
                if (!dataTransfer) return;

                const { uuid, type }: { uuid: string; type: string } =
                    JSON.parse(dataTransfer.getData("text/plain"));

                if (type !== documentType) return;
                dispatch("document-dropped", { dragEvent, uuid });
            } catch (err) {
                console.error(err);
            }
        }
    }

    const dispatch = createEventDispatcher();
</script>

<FieldWrapper>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="drop-area" on:drop|preventDefault|stopPropagation={onDrop}>
        <i class="drop-icon fa-sold fa-plus" />
    </div>
</FieldWrapper>

<style lang="scss">
    .drop-area {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 3.25rem;
        border-radius: 4px;
        border: 2px dashed #bbb;
        padding: 0.125rem;
        box-sizing: border-box;
    }

    .drop-icon {
        color: #888;
        font-size: $font-size-xl;
        font-style: normal;
    }
</style>
