<script lang="ts">
    import { localize } from "#runtime/svelte/helper";

    export let headerButtons: any[] = [];
    export let headerClasses: string = "";
    export let heading: string = "";
    export let hint: string = "";
    export let showWarning: boolean = false;
    export let warning: string = "";
</script>

<section class="a5e-section">
    {#if heading}
        <header class="a5e-section-header {headerClasses}">
            <h3 class="a5e-section-header__heading">{localize(heading)}</h3>

            {#if headerButtons.length}
                <div class="a5e-section-header__button-wrapper">
                    {#each headerButtons as { classes, display, handler, htmlString, label, tooltip }}
                        {#if display ?? true}
                            <button
                                class={`a5e-section-header__button ${classes}`}
                                on:click|stopPropagation={handler}
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
                <i class="fa-solid fa-circle-exclamation" />
                {localize(warning)}
            </small>
        {/if}

        <slot />
    </div>
</section>
