<template>
  <form
    @submit.prevent="onSubmit"
    class="a5e-form u-py-lg u-px-xl a5e-form--reactive-dialog"
  >
    <numeric-field
      heading="A5E.MovementWalkingSpeed"
      :initialValue="walkingSpeed"
      @update-field-value="updateWalkingSpeed"
    />

    <numeric-field
      heading="A5E.MovementBurrowingSpeed"
      :initialValue="burrowingSpeed"
      @update-field-value="updateBurrowingSpeed"
    />

    <numeric-field
      heading="A5E.MovementClimbingSpeed"
      :initialValue="climbingSpeed"
      @update-field-value="updateClimbingSpeed"
    />

    <numeric-field
      heading="A5E.MovementFlyingSpeed"
      :initialValue="flyingSpeed"
      @update-field-value="updateFlyingSpeed"
    />

    <numeric-field
      heading="A5E.MovementSwimmingSpeed"
      :initialValue="swimmingSpeed"
      @update-field-value="updateSwimmingSpeed"
    />

    <button class="a5e-button" type="submit">
      <i class="fas fa-save"></i> {{ submitText }}
    </button>
  </form>
</template>

<script>
import NumericField from "./partials/NumericField.vue";

import { ref } from "vue";

export default {
  components: { NumericField },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const movementData = actor.data.data.attributes.movement;

    const burrowingSpeed = ref(movementData.burrow);
    const climbingSpeed = ref(movementData.climb);
    const flyingSpeed = ref(movementData.fly);
    const swimmingSpeed = ref(movementData.swim);
    const walkingSpeed = ref(movementData.walk);

    // TODO: Combine all of these into a single function
    function updateBurrowingSpeed(value) {
      burrowingSpeed.value = value;
    }

    function updateClimbingSpeed(value) {
      climbingSpeed.value = value;
    }

    function updateFlyingSpeed(value) {
      flyingSpeed.value = value;
    }

    function updateSwimmingSpeed(value) {
      swimmingSpeed.value = value;
    }

    function updateWalkingSpeed(value) {
      walkingSpeed.value = value;
    }

    function onSubmit() {
      const data = {};
      const basePath = "data.attributes.movement";

      data[`${basePath}.burrow`] = burrowingSpeed.value;
      data[`${basePath}.climb`] = climbingSpeed.value;
      data[`${basePath}.fly`] = flyingSpeed.value;
      data[`${basePath}.swim`] = swimmingSpeed.value;
      data[`${basePath}.walk`] = walkingSpeed.value;

      actor.update(data);
      appWindow.submit();
    }

    return {
      burrowingSpeed,
      climbingSpeed,
      flyingSpeed,
      swimmingSpeed,
      walkingSpeed,
      updateBurrowingSpeed,
      updateClimbingSpeed,
      updateFlyingSpeed,
      updateSwimmingSpeed,
      updateWalkingSpeed,
      onSubmit,
      submitText: game.i18n.localize("A5E.SaveSubmit"),
    };
  },
};
</script>
