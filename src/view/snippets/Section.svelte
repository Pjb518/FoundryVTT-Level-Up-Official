<script lang="ts">
    import { localize } from "#utils/localization/localize.ts";

    type Props = {
        headerButtons?: any[];
        headerClasses?: string;
        heading?: string;
        hint?: string;
        showWarning?: boolean;
        warning?: string;
        children?: any;
    };

    let {
        headerButtons = [],
        headerClasses = "",
        heading = "",
        hint = "",
        showWarning = false,
        warning = "",
        children,
    }: Props = $props();
</script>

<section class="a5e-section">
    {#if heading}
        <header class="a5e-section-header {headerClasses}">
            <h3 class="a5e-section-header__heading">{localize(heading)}</h3>

            {#if headerButtons.length}
                <div class="a5e-section-header__button-wrapper">
                    {#each headerButtons as { classes = "", display, handler, htmlString, label, tooltip }}
                        {#if display ?? true}
                            <button
                                class={`a5e-section-header__button ${classes}`}
                                onclick={(e) => {
                                    e.preventDefault();
                                    handler(e);
                                }}
                                data-tooltip={tooltip}
                                data-tooltip-direction="UP"
                            >
                                {#if htmlString}
                                    {@html htmlString}
                                {:else if label}
                                    {localize(label)}
                                {:else}
                                    {localize("")}
                                {/if}
                            </button>
                        {/if}
                    {/each}
                </div>
            {/if}
        </header>
    {/if}

    <div class="a5e-section__body">
        {#if hint}
            <small class="a5e-section__hint">{localize(hint)}</small>
        {/if}

        {#if showWarning}
            <small class="a5e-section__warning">
                <i class="icon fa-solid fa-circle-exclamation"></i>
                {localize(warning)}
            </small>
        {/if}

        {@render children?.()}
    </div>
</section>
