<svelte:options accessors={true} />

<script>
    import { setContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import CheckHeader from "./header/CheckHeader.svelte";
    import ItemActivationHeader from "./header/ItemActivationHeader.svelte";

    // import CheckBody from "./body/CheckBody.svelte";
    import CardBody from "./body/CardBody.svelte";
    import ItemActivationFooter from "./footer/ItemActivationFooter.svelte";

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

<CardBody
    {message}
    hideDescription={hideDescription ||
        $message?.flags?.a5e?.cardType !== "item"}
/>

{#if $message?.flags?.a5e?.cardType === "item"}
    <ItemActivationFooter {message} />
{/if}
