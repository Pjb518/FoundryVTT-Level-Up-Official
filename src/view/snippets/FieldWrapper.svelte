<script lang="ts">
    import { localize } from "#utils/localization/localize.ts";

    type Props = {
        buttons?: Record<string, any>[];
        heading?: string;
        hint?: string;
        showWarning?: boolean;
        warning?: string;
        children?: any;
    };

    let {
        buttons = [],
        heading = "",
        hint = "",
        showWarning = false,
        warning = "",
        children,
    }: Props = $props();
</script>

<section class="a5e-field-wrapper">
    {#if heading}
        <header class="a5e-field-wrapper__header">
            <h3 class="a5e-field-wrapper__heading">{localize(heading)}</h3>

            {#if buttons.length}
                <div class="a5e-field-wrapper__header-button-wrapper">
                    {#each buttons as { classes, display, handler, label, tooltip }}
                        {#if display ?? true}
                            <button
                                class={`a5e-field-wrapper__header-button ${classes}`}
                                onclick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handler();
                                }}
                                data-tooltip={tooltip}
                                data-tooltip-direction="UP"
                            >
                                {localize(label ?? "")}
                            </button>
                        {/if}
                    {/each}
                </div>
            {/if}
        </header>
    {/if}

    {@render children?.()}

    {#if hint}
        <small class="a5e-field-wrapper__hint">{localize(hint)}</small>
    {/if}

    {#if showWarning}
        <small class="a5e-field-wrapper__warning">
            <i class="icon fa-solid fa-circle-exclamation"> </i>
            {localize(warning)}
        </small>
    {/if}
</section>
