<script>
    import BaseHeader from "./BaseHeader.svelte";

    export let message;

    const { img, name } = $message.flags?.a5e;
</script>

<BaseHeader {img} altText={name} title={name} />
