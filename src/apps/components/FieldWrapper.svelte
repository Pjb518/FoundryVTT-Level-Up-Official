<script lang="ts">
    import { localize } from "#runtime/svelte/helper";

    export let buttons: Record<string, any>[] = [];
    export let heading: string = "";
    export let hint: string = "";
    export let showWarning = false;
    export let warning: string = "";
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
                                on:click|preventDefault|stopPropagation={handler}
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

    <slot />

    {#if hint}
        <small class="a5e-field-wrapper__hint">{localize(hint)}</small>
    {/if}

    {#if showWarning}
        <small class="a5e-field-wrapper__warning">
            <i class="fa-solid fa-circle-exclamation" />
            {localize(warning)}
        </small>
    {/if}
</section>
