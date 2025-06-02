<script lang="ts">
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    type Props = {
        type: string;
        documentType: string;
        onDocumentDropped: (data: any) => void;
    };

    function onDrop(dragEvent: DragEvent) {
        dragEvent.preventDefault();
        dragEvent.stopPropagation();
        if (!type) onDocumentDropped(dragEvent);

        if (type === "uuid") {
            try {
                const dataTransfer = dragEvent.dataTransfer;
                if (!dataTransfer) return;

                const { uuid, type }: { uuid: string; type: string } =
                    JSON.parse(dataTransfer.getData("text/plain"));

                if (type !== documentType) return;
                onDocumentDropped({ dragEvent, uuid });
            } catch (err) {
                console.error(err);
            }
        }
    }

    let { type, documentType, onDocumentDropped }: Props = $props();
</script>

<FieldWrapper>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="a5e-drop-area" ondrop={onDrop}>
        <i class="a5e-drop-icon fa-sold fa-plus"></i>
    </div>
</FieldWrapper>

<style lang="scss">
    .a5e-drop-area {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 3.25rem;
        border-radius: 4px;
        border: 2px dashed var(--a5e-border-color);
        padding: 0.125rem;
        box-sizing: border-box;
    }

    .a5e-drop-icon {
        color: var(--a5e-border-color);
        font-size: var(--a5e-xl-text);
        font-style: normal;
    }
</style>
