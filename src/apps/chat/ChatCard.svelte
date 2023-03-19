<svelte:options accessors={true} />

<script>
    import { setContext } from "svelte";
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
            case "hitDice":
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
            case "hitDice":
            case "savingThrow":
            case "skillCheck":
                return CheckBody;
        }
    }

    async function modifyRolls() {}

    async function repeatCard() {}

    export let messageDocument;

    let hideDescription =
        game.settings.get("a5e", "hideChatDescriptionsByDefault") ?? false;

    const message = new TJSDocument(messageDocument);

    setContext("message", message);
</script>

<svelte:component
    this={getHeaderComponent()}
    {message}
    on:modifyRolls={() => modifyRolls()}
    on:repeatCard={() => repeatCard()}
    on:toggleDescription={() => (hideDescription = !hideDescription)}
/>

<svelte:component this={getBodyComponent()} {message} {hideDescription} />
