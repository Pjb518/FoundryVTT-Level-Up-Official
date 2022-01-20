/**
 * A helper function to calculate the appropriate position for item context menus, avoiding
 * obstacles such as the edge of a character sheet.
 *
 * @param {Event} event  The originating click event.
 * @returns
 */
export default function calculateContextMenuPlacement(event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const item = event.currentTarget;
  const itemTop = $(item).offset().top;
  const itemLeft = $(item).offset().left;

  let contextTop = mouseY - itemTop + 1;
  let contextLeft = mouseX - itemLeft + 1;
  const contextWidth = $(item).find('.a5e-context-menu').width();
  const contextHeight = $(item).find('.a5e-context-menu').height();
  const contextRightBound = mouseX + contextWidth;
  const contextTopBound = mouseY - (2 * contextHeight);

  const itemsList = $(item).closest('.a5e-item-list');
  const itemsListRightBound = itemsList.offset().left + itemsList.width() - 17;
  const itemsListTopBound = itemsList.offset().top;

  if (contextRightBound > itemsListRightBound) {
    const rightDiff = itemsListRightBound - contextRightBound;
    contextLeft += rightDiff;
  }

  if (contextTopBound > itemsListTopBound) {
    contextTop -= (2 * contextHeight);
  }

  return { left: contextLeft, top: contextTop };
}
