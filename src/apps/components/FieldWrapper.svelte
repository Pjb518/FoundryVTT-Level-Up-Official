<script lang="ts">
    import { localize } from "#utils/localization/localize.ts";

    export let buttons: Record<string, any>[] = [];
    export let heading = "";
    export let hint = "";
    export let showWarning = false;
    export let warning = "";
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
            <i class="icon fa-solid fa-circle-exclamation" />
            {localize(warning)}
        </small>
    {/if}
</section>
