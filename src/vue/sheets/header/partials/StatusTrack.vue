<template>
  <div
    class="a5e-track a5e-js-track"
    :class="`a5e-track--${name}`"
    :data-track="name"
  >
    <i
      class="a5e-track__icon fas"
      :class="[{ [`a5e-track__icon--level-${value}`]: value }, icon]"
    ></i>

    <ul class="a5e-track__list">
      <li
        v-for="index in 8"
        :key="index - 1"
        class="a5e-track__list-item a5e-js-track-item"
        :class="{
          'a5e-track__list-item--selected': value === index - 1,
        }"
        :data-degree="index - 1"
        @click="onClickTrackItem(index - 1)"
      >
        {{ index - 1 }}
      </li>
    </ul>

    <div class="a5e-tooltip a5e-tooltip--track a5e-tooltip--obstacle-left">
      {{ localize(tooltipText) }}
    </div>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  props: { icon: String, name: String, tooltipText: String, value: Number },
  setup(props) {
    const actor = inject("actor");

    function onClickTrackItem(degree) {
      actor.update({ [`data.attributes.${props.name}`]: parseInt(degree, 10) });
    }

    return {
      localize: (key) => game.i18n.localize(key),
      onClickTrackItem,
    };
  },
};
</script>
