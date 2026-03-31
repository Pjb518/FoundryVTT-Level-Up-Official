import { unmount } from "svelte";

export default function preDeleteChatMessage(message) {
  if (message?._svelteComponent) {
    console.log(message?._svelteComponent);
    unmount(message._svelteComponent);
  }
}
