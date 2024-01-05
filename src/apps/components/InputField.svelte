<script>
    import FieldWrapper from "./FieldWrapper.svelte";

    export let heading = null;
    export let hint = null;
    export let fieldValue = null;
    export let updateFunction;

    function onValueChange(newValue) {
        fieldValue = newValue;
        updateFunction();
    }
</script>

<FieldWrapper {heading} {hint}>
    <input
        class="a5e-input"
        type="text"
        value={fieldValue || ""}
        on:change={({ target }) => onValueChange(target.value)}
    />
</FieldWrapper>
