<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "#runtime/svelte/component/core";

    export let elementRoot;
</script>

<ApplicationShell bind:elementRoot>
    <article>
        <h3>Community Discord Server</h3>

        <p>
            The best way to get support is to <a
                href="https://discord.gg/XtkZ6RkN9E"
                target="_blank">join our Discord server</a
            >. We have a very friendly community with lots of experienced users
            who can provide live support should you need any help. We also have
            dedicated channels for filing issue reports or submitting feature
            requests.
        </p>

        <p>
            Our Discord server is also home to most of the Level Up third-party
            publishers, and we make regular posts showcasing new official and
            third-party releases in the announcements channel.
        </p>

        <h3>GitHub</h3>

        <p>
            If you're not into Discord, you can also submit issue reports and
            feature requests on <a
                href="https://github.com/Pjb518/FoundryVTT-Level-Up-Official"
                target="_blank">the system's GitHub repository</a
            >. We check these tickets very frequently, but you're not typically
            going to get a response as quickly as you would on Discord.
        </p>
    </article>
</ApplicationShell>

<style lang="scss">
    :global(.a5e-help-and-support-dialog) {
        min-width: 400px;
        min-height: 300px;
        max-height: 90vh;
    }

    :global(.a5e-help-and-support-dialog .window-content) {
        padding: 0.5rem;
    }

    article {
        height: 100%;
        overflow: auto;
    }
</style>
