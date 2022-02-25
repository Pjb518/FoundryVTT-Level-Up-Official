<template>
  <div
    class="a5e-box u-flex u-flex-wrap u-gap-md u-p-md"
    :class="{ 'u-align-center': inline }"
  >
    <h3
      v-if="heading"
      class="u-flex-shrink-0 u-text-bold u-text-sm"
      :class="{ 'u-w-30': inline }"
    >
      {{ localize(heading) }}
    </h3>

    <slot />

    <small v-if="hint">{{ localize(hint) }}</small>
  </div>
</template>

<script>
export default {
  props: {
    heading: { type: String, required: false },
    hint: { type: String, required: false },
    inline: { type: Boolean, default: false },
  },
  setup() {
    return {
      localize: (key) => game.i18n.localize(key),
    };
  },
};
</script>
