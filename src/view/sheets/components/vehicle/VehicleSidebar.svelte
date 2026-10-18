<script lang="ts">
  import { getContext } from "svelte";
  import { localize } from "#utils/localization/localize.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";
  import { editDocumentImage } from "#utils/view/editDocumentImage.ts";

  import ActorHitPoints from "../actor/ActorHitPoints.svelte";
  import ActorSidebarAC from "../actor/ActorSidebarAC.svelte";
  import VehicleSidebarDetails from "./VehicleSidebarDetails.svelte";

  let actor: any = getContext("actor");

  let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

  let system = $derived(actor.reactive.system);
  let hp = $derived(system.attributes.hp);

  let hpPrimaryPercentage = $derived(
    Math.floor(Math.min((hp.value / hp.max) * 100, 100)) || 0,
  );
  let hpTempPercentage = $derived(Math.min(((hp.temp || 0) / hp.max) * 100, 100) || 0);

  function onEditImage(event: MouseEvent) {
    editDocumentImage(actor, { shiftKey: event.shiftKey });
  }
</script>

<aside class="a5e-actor-sidebar">
  <!-- Portrait -->
  <section class="a5e-vehicle-sidebar__portrait">
    <div
      class="a5e-actor-hp-bar"
      style="
                --primary-hp-percentage: {hpPrimaryPercentage};
                --temp-hp-percentage: {hpTempPercentage};
                --secondary-bar-color: #2FA6B1;
            "
    >
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <img
        class="a5e-vehicle-sidebar__image"
        src={actor.reactive.img}
        alt={actor.reactive.name}
        onclick={onEditImage}
      />
    </div>
  </section>

  <!-- AC and HP -->
  <section class="a5e-actor-sidebar__hp-container">
    <ActorHitPoints />

    <ul class="a5e-actor-sidebar__glance-trackers">
      <ActorSidebarAC />

      <!-- Momentum -->
      <li class="a5e-vehicle-tracker">
        <span class="a5e-vehicle-tracker__label">
          {localize("A5E.vehicle.momentum")}
        </span>

        <button
          type="button"
          class="a5e-vehicle-tracker__button"
          class:a5e-vehicle-tracker__button--active={system.momentum}
          class:disable-pointer-events={!actor.isOwner}
          aria-label={localize("A5E.vehicle.momentum")}
          aria-pressed={system.momentum}
          onclick={() =>
            updateDocumentDataFromField(actor, "system.momentum", !system.momentum)}
        >
          <i class="fa-solid fa-wind"></i>
        </button>
      </li>

      <!-- Collision -->
      <li class="a5e-vehicle-tracker">
        <span class="a5e-vehicle-tracker__label">
          {localize("A5E.vehicle.collision.button")}
        </span>

        {#if sheetIsLocked()}
          <button
            type="button"
            class="a5e-vehicle-tracker__button"
            class:a5e-vehicle-tracker__button--disabled={!system.momentum}
            class:disable-pointer-events={!actor.isOwner}
            aria-label={localize("A5E.vehicle.collision.roll")}
            aria-disabled={!system.momentum}
            data-tooltip={system.momentum
              ? "A5E.vehicle.collision.roll"
              : "A5E.vehicle.noMomentum"}
            data-tooltip-direction="DOWN"
            onclick={() => system.momentum && actor.rollCollision()}
          >
            <i class="fa-solid fa-burst"></i>
          </button>
        {:else}
          <button
            type="button"
            class="a5e-vehicle-tracker__button"
            class:disable-pointer-events={!actor.isOwner}
            aria-label={localize("A5E.vehicle.collision.configure")}
            data-tooltip="A5E.vehicle.collision.configure"
            data-tooltip-direction="DOWN"
            onclick={() => actor.configureCollision()}
          >
            <i class="fa-solid fa-gear"></i>
          </button>
        {/if}
      </li>
    </ul>
  </section>

  <!-- Details -->
  <section class="a5e-actor-sidebar__details-wrapper">
    <VehicleSidebarDetails />
  </section>
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
    padding: 0.5rem;
    border-right: 1px solid var(--a5e-border-color);

    background: rgba(0, 0, 0, 0.05);

    &__hp-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    &__glance-trackers {
      display: flex;
      justify-content: space-evenly;
      align-items: flex-start;
      gap: 0.5rem;
      font-family: var(--a5e-condensed-font);
      padding: 0;
      list-style: none;
      margin: 0;
    }

    &__details-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex-grow: 1;
      overflow-y: auto;
      overflow-x: clip;
      margin-bottom: 0.5rem;
    }
  }

  .a5e-vehicle-sidebar {
    &__portrait {
      display: flex;
      justify-content: center;
      margin-block-end: 0.5rem;
    }

    &__image {
      border-radius: 50%;
      cursor: pointer;
      width: 8rem;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      object-position: top;
      z-index: 1;
    }
  }

  .disable-pointer-events {
    pointer-events: none;
  }

  .a5e-vehicle-tracker {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;

    &__label {
      padding-bottom: 0.125rem;
      margin: 0.1rem;
      font-family: var(--a5e-condensed-font);
      font-size: var(--a5e-sm-text);
      font-weight: 700;
    }

    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      padding: 0;

      border: none;
      background-color: transparent;
      font-size: var(--a5e-xl-text);
      color: var(--a5e-text-color-medium);
      cursor: pointer;
      transition: var(--a5e-transition-standard);

      &:focus,
      &:hover {
        color: var(--a5e-text-color-dark);
      }

      &--disabled {
        opacity: 0.4;
        cursor: not-allowed;

        &:hover,
        &:focus {
          color: var(--a5e-text-color-medium);
        }
      }

      &--active {
        color: var(--a5e-color-advantage);

        &:hover,
        &:focus {
          color: var(--a5e-color-primary);
        }
      }
    }
  }

  @property --primary-hp-percentage {
    syntax: "<number>";
    inherits: true;
    initial-value: 1;
  }

  @property --temp-hp-percentage {
    syntax: "<number>";
    inherits: true;
    initial-value: 1;
  }

  .a5e-actor-hp-bar {
    position: relative;
    width: 9rem;
    aspect-ratio: 1;
    display: inline-grid;
    place-content: center;

    &:before {
      --bar-thickness: 10px;

      background: conic-gradient(
        from 41.5deg,
        hsl(var(--primary-hp-percentage), 50%, 35%)
          calc(var(--primary-hp-percentage) * 0.775%),
        rgba(0, 0, 0, 0.08) calc(var(--primary-hp-percentage) * 0.775%),
        rgba(0, 0, 0, 0.08) 279deg,
        transparent 0
      );

      @media (prefers-reduced-motion: no-preference) {
        animation: fillPrimaryRing 1s 0.25s both;
      }
    }

    &:after {
      --bar-thickness: 5px;

      background: conic-gradient(
        from 41.5deg,
        var(--secondary-bar-color) calc(var(--temp-hp-percentage) * 0.775%),
        transparent 0
      );

      @media (prefers-reduced-motion: no-preference) {
        animation: fillSecondaryRing 1s 0.25s both;
      }
    }

    &:before,
    &:after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 9rem;
      height: 9rem;
      transform: rotate(90deg);
      border-radius: 50%;
      inset: 0;

      -webkit-mask: radial-gradient(
        farthest-side,
        #0000 calc(99% - var(--bar-thickness)),
        #000 calc(100% - var(--bar-thickness))
      );

      mask: radial-gradient(
        farthest-side,
        #0000 calc(99% - var(--bar-thickness)),
        #000 calc(100% - var(--bar-thickness))
      );
    }
  }

  @keyframes fillPrimaryRing {
    from {
      --primary-hp-percentage: 0;
    }
  }

  @keyframes fillSecondaryRing {
    from {
      --temp-hp-percentage: 0;
    }
  }
</style>
