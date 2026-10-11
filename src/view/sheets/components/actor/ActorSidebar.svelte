<script>
  import ActorHitDice from "./ActorHitDice.svelte";
  import ActorHitPoints from "./ActorHitPoints.svelte";
  import ActorInitiative from "./ActorInitiative.svelte";
  import ActorSidebarAC from "./ActorSidebarAC.svelte";
  import ActorSidebarDetails from "./ActorSidebarDetails.svelte";
  import ActorSidebarFooter from "./ActorSidebarFooter.svelte";
  import ActorSidebarPortrait from "./ActorSidebarPortrait.svelte";
</script>

<aside class="a5e-actor-sidebar">
  <!-- Portrait -->
  <ActorSidebarPortrait />

  <!-- AC and Trackers -->
  <section class="a5e-actor-sidebar__hp-container">
    <ActorHitPoints />

    <ul class="a5e-actor-sidebar__glance-trackers">
      <ActorSidebarAC />
      <ActorHitDice />
      <ActorInitiative />
    </ul>
  </section>

  <!-- Details -->
  <section class="a5e-actor-sidebar__details-wrapper">
    <ActorSidebarDetails />
  </section>

  <!-- AC -->
  <footer class="a5e-actor-sidebar__footer">
    <ActorSidebarFooter />
  </footer>
</aside>

<style lang="scss">
  .a5e-actor-sidebar {
    position: relative;
    grid-area: aside;

    display: flex;
    flex-direction: column;
    flex-grow: 0;
    flex-shrink: 0;
    gap: 0.25rem;

    height: 100%;
    padding: var(--a5e-spacing-sm);
    border-right: 1px solid var(--a5e-border-color);

    background: rgba(0, 0, 0, 0.05);

    &__hp-container {
      display: flex;
      flex-direction: column;
      gap: var(--a5e-spacing-sm);
      margin-bottom: 0.5rem;
    }

    &__glance-trackers {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      gap: var(--a5e-spacing-sm);
      font-family: var(--a5e-condensed-font);
      padding: var(--a5e-spacing-none);
      list-style: none;
      margin: var(--a5e-spacing-none);
    }

    &__details-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--a5e-spacing-sm);
      flex-grow: 1;
      overflow-y: auto;
      overflow-x: clip;
      margin-bottom: 0.5rem;
    }

    &__footer {
      display: flex;
      gap: 0.25rem;
    }
  }
</style>
