<svelte:options accessors={true} />

<script>
    import { getContext, onDestroy } from "svelte";
    import { EmptyApplicationShell } from "#runtime/svelte/component/core";
    // import { draggable } from "#runtime/svelte/store/position";

    const { application } = getContext("#external");

    export let elementRoot = void 0;

    // Get the right most position of the sidebar
    const sidebarHook = Hooks.on("collapseSidebar", () => {
        sidebarStartPosition = getRightPosition();
    });

    function getRightPosition() {
        const uiRight = document.querySelector("#ui-right");
        const uiRightRect = uiRight.getBoundingClientRect();
        return uiRightRect.left;
    }

    onDestroy(() => {
        Hooks.off("collapseSidebar", sidebarHook);
    });

    let sidebarStartPosition = getRightPosition();

    const position = application.position;
    const panelWidth = position.stores.width;
    position.stores.top.set(20);

    $: position.stores.left.set(sidebarStartPosition - $panelWidth - 5);
</script>

<EmptyApplicationShell bind:elementRoot>
    <article id="a5e-effects-panel">
        <!--  -->
        Effects go here
    </article>
</EmptyApplicationShell>

<style lang="scss">
    #a5e-effects-panel {
        background-color: aliceblue;
        padding: 0.75rem;
        pointer-events: initial;
        // display: flex;
        // flex-direction: column;
        // gap: 10px;
        // height: 100%;
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
