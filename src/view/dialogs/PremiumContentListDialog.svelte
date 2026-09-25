<script lang="ts">
    import type { PremiumContentListDialog } from "./initializers/PremiumContentListDialog.svelte.ts";

    import wikiContent from "./PremiumContentListDialog.html?raw";

    type Props = {
        dialog: PremiumContentListDialog;
    };

    let { dialog }: Props = $props();

    function onContentClick(e: MouseEvent) {
        const anchor = (e.target as HTMLElement)?.closest("a");
        if (!anchor?.href) return;

        e.preventDefault();
        window.open(anchor.href, "_blank", "noopener");
    }
</script>

<article>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    <div class="a5e-wiki-content" onclick={onContentClick}>
        {@html wikiContent}
    </div>
</article>

<style lang="scss">
    :global(.a5e-premium-content-list-dialog) {
        min-width: 400px;
        min-height: 500px;
        max-height: 80vh;
    }

    :global(.a5e-premium-content-list-dialog .window-content) {
        padding: 0.5rem;
    }

    article {
        height: 100%;
        padding-inline: 0.25rem;
        overflow: auto;
    }

    .a5e-wiki-content {
        :global(blockquote) {
            padding: 0.5rem 0.75rem;
            margin: 0.75rem 0;
            background: rgba(84, 84, 84, 0.8);
            color: var(--a5e-color-text-light);
            box-shadow: 0 0 10px rgba(59, 59, 59, 0.8) inset;
            border-radius: 4px;
            border-left: 0;
            text-wrap: pretty;
        }

        :global(blockquote p) {
            margin: 0;
        }

        :global(h1) {
            font-size: 1.3rem;
            margin-block: 0.5rem;
        }

        :global(h2) {
            font-size: 1.15rem;
            margin-block: 0.75rem 0.375rem;
            border-bottom: 1px solid var(--a5e-border-color);
        }

        :global(h3) {
            font-size: 1rem;
            margin-block: 0.5rem 0.25rem;
        }

        :global(h4) {
            font-size: 0.9rem;
            margin-block: 0.375rem 0.25rem;
            color: var(--a5e-color-text-medium);
        }

        :global(ul) {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            list-style: none;
            padding: 0;
            margin: 0 0 0.5rem;
        }

        :global(li a) {
            text-decoration: none;
        }
    }
</style>
