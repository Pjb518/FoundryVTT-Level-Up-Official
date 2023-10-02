<svelte:options accessors={true} />

<script>
    import { getContext, onDestroy } from "svelte";
    import { EmptyApplicationShell } from "#runtime/svelte/component/core";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
    // import { draggable } from "#runtime/svelte/store/position";

    const { application } = getContext("#external");
    export let { HUD } = getContext("#external").application;

    export let elementRoot = void 0;

    // Get the right most position of the sidebar
    console.log("Creating A5EEffectsPanel");
    // TODO: Switch this to a mutation observer
    const sidebarHook = Hooks.on("collapseSidebar", () => {
        sidebarStartPosition = getRightPosition();
    });

    function getRightPosition() {
        const uiRight = document.querySelector("#ui-right");
        const uiRightRect = uiRight.getBoundingClientRect();
        return uiRightRect.left;
    }

    let sidebarStartPosition = getRightPosition();

    const position = application.position;
    const panelWidth = position.stores.width;
    position.stores.top.set(20);

    $: position.stores.left.set(sidebarStartPosition - $panelWidth - 5);

    // Get current controlled token
    function getReactiveActor() {
        actor?.destroy();
        if (!HUD.token) return null;
        return new TJSDocument(HUD.actor);
    }

    let token = HUD.token;
    $: actor = getReactiveActor(token);

    const controlledHook = Hooks.on("controlToken", () => {
        token = HUD.token;
    });

    // Destroy Hooks on unmount
    onDestroy(() => {
        console.log("Destroying A5EEffectsPanel");
        Hooks.off("collapseSidebar", sidebarHook);
        Hooks.off("controlToken", controlledHook);
    });

    // Get Panel Data
    console.log(token);
    $: effects = [
        ...($actor?.temporaryEffects || []),
        ...(token?.effects || []),
    ].sort((a, b) => a.name.localeCompare(b.name));
</script>

<EmptyApplicationShell bind:elementRoot>
    {#if token && $actor && effects.length}
        <article id="a5e-effects-panel">
            <ul>
                {#each effects as { name }}
                    <li>
                        {name}
                    </li>
                {/each}
            </ul>
        </article>
    {/if}
</EmptyApplicationShell>

<style lang="scss">
    #a5e-effects-panel {
        background-color: aliceblue;
        pointer-events: initial;
        padding: 0.75rem;
        // display: flex;
        // flex-direction: column;
        // gap: 10px;
        height: 100%;
        // width: 100%;
        // background: rgba(255 255 255);
        // padding: 8px;
    }

    // div {
    //     display: flex;
    //     flex-direction: column;
    //     gap: 10px;
    //     height: 100%;
    //     width: 100%;
    //     background: rgba(255 255 255);
    //     padding: 8px;
    // }

    // input {
    //     background: rgba(255, 0, 0, 0.5);
    //     color: white;
    // }

    // input::placeholder {
    //     color: lightgray;
    // }
</style>
