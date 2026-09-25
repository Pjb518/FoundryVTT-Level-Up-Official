import { HelpAndSupportDialog } from '#view/dialogs/initializers/HelpAndSupportDialog.svelte.ts';
import { PremiumContentListDialog } from '#view/dialogs/initializers/PremiumContentListDialog.svelte.ts';

export default function renderSettings(_app, html: HTMLElement) {
	const systemTitle = html.querySelector('.info .system .label') as HTMLElement | null;

	systemTitle!.innerText = 'Level Up: Advanced 5th Edition';

	const systemRow = html.querySelector('.info div.system');
	const systemInfo = systemRow?.cloneNode(false)! as HTMLElement;

	systemInfo.classList.remove('system');
	systemInfo.classList.add('a5e-community-links');

	const links = [
		{
			classes: ['a5e-community-link', 'a5e-community-link--discord'],
			icon: '<i class="fa-brands fa-discord"></i>',
			label: 'Discord',
			tooltip: 'Join the community Discord server',
			url: 'https://discord.gg/XtkZ6RkN9E',
		},
		{
			classes: ['a5e-community-link', 'a5e-community-link--patreon'],
			icon: '<i class="fa-brands fa-patreon"></i>',
			label: 'Patreon',
			tooltip: 'Support the system',
			url: 'https://www.patreon.com/ForgemasterModules',
		},
	].map(({ classes, icon, label, tooltip, url }) => {
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.innerHTML = `${icon} ${label}`;
		anchor.target = '_blank';
		anchor.setAttribute('data-tooltip', tooltip);
		anchor.classList.add(...classes);

		return anchor;
	});

	systemInfo.append(...links);
	systemRow?.after(systemInfo);

	const a5eSettings = document.createElement('section');
	a5eSettings.classList.add('a5e-settings', 'flexcol');

	const header = document.createElement('h4');
	header.classList.add('divider');
	header.innerText = 'Level Up: Advanced 5th Edition';
	a5eSettings.append(header);

	html.querySelector('section.settings')?.after(a5eSettings);

	const buttons = [
		{
			DialogApplication: HelpAndSupportDialog,
			dialogName: 'helpAndSupport',
			iconClasses: ['fa-solid', 'fa-life-ring'],
			label: 'Help and Support',
		},
		{
			DialogApplication: PremiumContentListDialog,
			dialogName: 'premiumContentList',
			iconClasses: ['fa-solid', 'fa-wallet'],
			label: 'Premium Content',
		},
	].map(({ DialogApplication, dialogName, iconClasses, label }) => {
		const button = document.createElement('button');
		button.type = 'button';

		const icon = document.createElement('i');
		icon.classList.add(...iconClasses);

		button.append(icon, label);

		button.addEventListener('click', () => {
			game.a5e.dialogs[dialogName] ??= new DialogApplication();
			game.a5e.dialogs[dialogName].render(true);
		});

		return button;
	});

	a5eSettings.append(...buttons);
}
