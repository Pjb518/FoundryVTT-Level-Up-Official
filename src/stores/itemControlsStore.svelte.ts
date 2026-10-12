export const itemControls = $state({ open: false });

export function toggleItemControls() {
    itemControls.open = !itemControls.open;
}
