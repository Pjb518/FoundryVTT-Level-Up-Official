function renderHeadsUpDisplayContainer() {
	const measurementEl = document.getElementById('measurement');

	const labelEl = document.createElement('div');
	labelEl.id = 'token-hover-distance';
	labelEl.classList.add('waypoint-label');

	const icon = document.createElement('i');
	icon.classList.add('fa-solid');
	icon.classList.add('fa-ruler');

	const total = document.createElement('span');
	total.classList.add('total-measurement');

	labelEl.append(icon);
	labelEl.append(total);

	labelEl.hidden = true;
	measurementEl?.append(labelEl);
}

export { renderHeadsUpDisplayContainer };
