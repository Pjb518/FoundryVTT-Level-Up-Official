<script>
    import FieldWrapper from "./FieldWrapper.svelte";

    export let heading = "";
    export let hint = "";
    export let fieldValue = "";
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
