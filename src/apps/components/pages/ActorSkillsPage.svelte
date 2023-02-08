<script>
    import { getContext } from "svelte";

    import Skill from "../Skill.svelte";

    const actor = getContext("actor");

    $: jackOfAllTrades = $actor.flags.a5e?.jackOfAllTrades;
    $: skills = $actor.system.skills;
</script>

<ul class="skills-container">
    <!-- svelte-ignore missing-declaration (CONFIG)-->
    {#each Object.entries(skills) as [key, skill]}
        <Skill {jackOfAllTrades} {key} {skill} />
    {/each}
</ul>

<style lang="scss">
    .skills-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.25rem;
        margin: 0;
        padding: 0;
        list-style: none;
        overflow-x: auto;
    }
</style>
