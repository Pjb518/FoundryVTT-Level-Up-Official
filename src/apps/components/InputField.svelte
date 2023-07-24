<script>
    import { localize } from "#runtime/svelte/helper";

    export let heading = null;
    export let hint = null;
    export let inline = false;
    export let reduceMargin = false;
    export let fieldValue = null;
    export let updateFunction;

    function onValueChange(newValue) {
        fieldValue = newValue;
        updateFunction();
    }
</script>

<section
    class="a5e-form__section u-flex u-flex-col u-gap-md"
    class:a5e-form__section--reduced-margin={reduceMargin}
    class:a5e-form__section--inline={inline}
>
    {#if heading}
        <h3
            class="u-text-bold u-text-sm"
            class:u-flex-shrink-0={inline}
            class:u-mb-0={inline}
        >
            {localize(heading)}
        </h3>
    {/if}

    <div class="a5e-input-container" class:a5e-input-container--inline={inline}>
        <input
            class="a5e-input"
            type="text"
            value={fieldValue || ""}
            on:change={({ target }) => onValueChange(target.value)}
        />
    </div>

    {#if hint}
        <span class="a5e-form__hint"> {localize(hint)} </span>
    {/if}
</section>
