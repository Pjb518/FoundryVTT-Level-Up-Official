/*
 * This wrapper component is used to provide automatic update functionality to custom tag,
 * checkbox, and radio groups.
 */

<template>
  <slot :selectionHandler="updateDocument" />
</template>

<script>
export default {
  props: {
    document: Object,
    updatePath: String,
  },
  setup(props) {
    function updateDocument(value) {
      props.document.update({ [props.updatePath]: value });
    }

    return {
      updateDocument,
    };
  },
};
</script>
