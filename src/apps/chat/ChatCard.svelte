<script>
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import CheckHeader from "./header/CheckHeader.svelte";
    import ItemActivationHeader from "./header/ItemActivationHeader.svelte";

    import CheckBody from "./body/CheckBody.svelte";
    import ItemActivationBody from "./body/ItemActivationBody.svelte";

    function getHeaderComponent() {
        switch ($message?.flags?.a5e?.cardType) {
            case "item":
                return ItemActivationHeader;
            case "abilityCheck":
            case "savingThrow":
            case "skillCheck":
                return CheckHeader;
        }
    }

    function getBodyComponent() {
        switch ($message?.flags?.a5e?.cardType) {
            case "item":
                return ItemActivationBody;
            case "abilityCheck":
            case "savingThrow":
            case "skillCheck":
                return CheckBody;
        }
    }

    export let messageDocument;

    const message = new TJSDocument(messageDocument);
</script>

<svelte:component this={getHeaderComponent()} {message} />

<svelte:component this={getBodyComponent()} {message} />
