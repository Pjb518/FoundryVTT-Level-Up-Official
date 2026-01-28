<script lang="ts">
    import { getContext, onMount } from "svelte";

    type Props = {
        applicationType?: string;
        content: string;
        document: any;
        field: string;
        onSave?: () => void;
        [key: string]: any;
    };

    function handleSave() {
        const codeMirrorElement = codeMirrorContainerEl?.querySelector("code-mirror");
        const currentContent = codeMirrorElement?.value ?? content;

        try {
            new Function(`return (async function() { ${currentContent} })`)();
            document.update({ [`system.${field}`]: currentContent });
            onSave?.();

            ui.notifications?.info("Macro saved successfully");
        } catch (error) {
            ui.notifications?.error(`Invalid JavaScript: ${error.message}`);

            return;
        }
    }

    let {
        applicationType = "sheet",
        content,
        document,
        field,
        onSave,
        ...rest
    }: Props = $props();

    let codeMirrorContainerEl: HTMLElement;
    let elem: any;

    let application: any = getContext(applicationType);

    const config = {
        value: content,
        language: "javascript",
        indent: 2,
    };

    // Create Editor element and put it in the contents element.
    onMount(async () => {
        elem = foundry.applications.elements.HTMLCodeMirrorElement.create(config);

        codeMirrorContainerEl.innerHTML = elem.outerHTML;
    });
</script>

<section class="a5e-macro-page">
    <div class="a5e-code-editor">
        <div
            id="a5e-code-mirror-macro"
            style="display: contents;"
            class={rest.class ?? ""}
            bind:this={codeMirrorContainerEl}
        ></div>
    </div>

    <button
        onclick={(e) => {
            e.preventDefault();
            handleSave();
        }}
    >
        Save Macro
    </button>
</section>

<style lang="scss">
    .a5e-macro-page {
        display: grid;
        grid-template-rows: minmax(0, 1fr) min-content;
        gap: 0.5rem;
        overflow: hidden;
    }

    .a5e-code-editor {
        height: 25rem;
    }
</style>
