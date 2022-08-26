/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                    Conditions Interface
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export default async function alterConditionInterface($html) {
  for (const img of $('.status-effects > img')) {
    const src = $(img).attr('src');
    if (src === '') {
      $(img).css({ visibility: 'hidden' });
    } else {
      const title = $(img).attr('title') || $(img).attr('data-condition');
      $('<div>')
        .addClass('condition-container')
        .attr('title', title)
        .insertAfter(img)
        .append(img)
        .append($('<div>')
          .addClass('condition-name')
          .html(title));
    }
  }

  $('.status-effects', $html).append(
    $('<div>')
      .addClass('clear-all-conditions')
      .html(`<i class="fa-solid fa-octagon-xmark"></i> ${game.i18n.localize('A5E.UIClearAll')}`)
      .click($.proxy(clearAllConditions, this))
  );
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//                     Clear All Conditions
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
async function clearAllConditions(event) {
  event.stopPropagation();
  const conditions = this._getStatusEffectChoices();
  for (const condition of Object.values(conditions)) {
    if (condition.isActive) {
      await this.object.toggleEffect({ id: condition.id, icon: condition.src });
    }
  }
}
