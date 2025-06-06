<script lang="ts">
    import { getContext, onMount } from "svelte";

    type EditorOptions =
        foundry.applications.elements.HTMLProseMirrorElement.ProseMirrorInputConfig;
    type EnrichOptions = TextEditor.EnrichmentOptions;

    type Props = {
        applicationType?: string;
        content: string;
        document: any;
        documentUuid: string;
        enriched?: string | null;
        editorOptions?: EditorOptions;
        enrichOptions?: EnrichOptions;
        field: string;
        manageSecrets?: boolean;
        onSave?: () => void;
        [key: string]: any;
    };

    function bindSecretUI() {
        if (!manageSecrets || !actualEditorOptions.toggled) {
            return;
        }

        // @ts-ignore
        const secret = new foundry.applications.ux.HTMLSecret({
            parentSelector: "prose-mirror",
            callbacks: {
                content: (_secret: HTMLElement) => content,
                update: (secret: HTMLElement, content: string) => {
                    secret.closest<HTMLElement & { value: string }>(
                        "prose-mirror",
                    )!.value = content;
                },
            },
        });

        queueMicrotask(() => {
            secret.bind(proseMirrorContainerEl);
        });
    }

    function handleSave() {
        application?.submit();
        onSave?.();
        bindSecretUI();
    }

    function onEditorActivation(node: HTMLElement) {
        node.addEventListener("click", (e: MouseEvent) => {
            if (
                e.target instanceof HTMLElement &&
                e.target.closest('[data-action="save"]')
            ) {
                handleSave();
            }
        });

        node.addEventListener("keydown", (e) => {
            if (
                game.keyboard.isModifierActive(
                    // @ts-ignore
                    foundry.helpers.interaction.KeyboardManager.MODIFIER_KEYS
                        .CONTROL,
                ) &&
                e.key === "s"
            ) {
                handleSave();
            }
        });
    }

    let {
        applicationType = "sheet",
        content,
        document,
        documentUuid,
        enriched = null,
        editorOptions = {} as EditorOptions,
        enrichOptions = {} as EnrichOptions,
        field,
        manageSecrets = false,
        onSave,
        ...rest
    }: Props = $props();

    let proseMirrorContainerEl: HTMLElement;

    let application: any = getContext(applicationType);

    let actualEditorOptions = $derived(
        foundry.utils.mergeObject(
            {
                name: field,
                collaborate: false,
                compact: false,
                documentUUID: documentUuid,
                editable: true,
                height: 200,
                toggled: true,
                value: content,
                enriched: enriched ?? content,
            },
            editorOptions,
        ) as EditorOptions,
    );

    let actualEnrichedOptions = $derived(
        foundry.utils.mergeObject(
            {
                secrets: document.isOwner || game.user?.isGM,
                rollData: document.isEmbedded
                    ? document.actor?.getRollData()
                    : document?.getRollData(),
                relativeTo: document,
            },
            enrichOptions,
        ),
    ) as EnrichOptions;

    // Create Editor element and put it in the contents element.
    onMount(async () => {
        enriched = await TextEditor.enrichHTML(content, actualEnrichedOptions);

        const element =
            foundry.applications.elements.HTMLProseMirrorElement.create(
                actualEditorOptions,
            );

        proseMirrorContainerEl.innerHTML = element.outerHTML;

        proseMirrorContainerEl.firstChild?.addEventListener(
            "plugins",
            (e: any) => {
                e.detail.highlightDocumentMatches =
                    // @ts-ignore
                    ProseMirror.ProseMirrorHighlightMatchesPlugin.build(
                        ProseMirror.defaultSchema,
                    );
            },
        );

        bindSecretUI();
    });
</script>

<div
    style="display: contents;"
    class={rest.class ?? ""}
    bind:this={proseMirrorContainerEl}
    use:onEditorActivation
></div>
