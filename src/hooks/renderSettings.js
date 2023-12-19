import AnnouncementDialog from '../apps/dialogs/initializers/AnnouncementDialog';
import HelpAndSupportDialog from '../apps/dialogs/initializers/HelpAndSupportDialog';
import PremiumContentListDialog from '../apps/dialogs/initializers/PremiumContentListDialog';

export default function renderSettings(_app, _html) {
  const html = _html[0];

  const systemTitle = html.querySelector('.settings-sidebar .system-title');
  systemTitle.innerText = 'Level Up: Advanced 5th Edition';

  const systemRow = html.querySelector('.settings-sidebar li.system');
  const systemInfo = systemRow?.cloneNode(false);

  systemInfo.classList.remove('system');
  systemInfo.classList.add('a5e-community-links');

  const links = [
    {
      classes: ['a5e-community-link', 'a5e-community-link--discord'],
      icon: '<i class="fa-brands fa-discord"></i>',
      label: 'Discord',
      tooltip: 'Join the community Discord server',
      url: 'https://discord.gg/XtkZ6RkN9E'
    },
    {
      classes: ['a5e-community-link', 'a5e-community-link--patreon'],
      icon: '<i class="fa-brands fa-patreon"></i>',
      label: 'Patreon',
      tooltip: 'Support the system',
      url: 'https://www.patreon.com/ForgemasterModules'
    }
  ].map(({
    classes, icon, label, tooltip, url
  }) => {
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

  // Add new A5e section with helpful info and links to our licenses
  const header = document.createElement('h2');
  header.innerText = 'Level Up: Advanced 5th Edition';

  const a5eSettings = document.createElement('div');
  html.querySelector('#settings-game')?.after(header, a5eSettings);

  const buttons = [
    {
      DialogApplication: HelpAndSupportDialog,
      dialogName: 'helpAndSupport',
      iconClasses: ['fa-solid', 'fa-life-ring'],
      label: 'Help and Support'
    },
    {
      DialogApplication: AnnouncementDialog,
      dialogName: 'latestAnnouncements',
      iconClasses: ['fa-solid', 'fa-bullhorn'],
      label: 'Latest Announcements'
    },
    {
      DialogApplication: PremiumContentListDialog,
      dialogName: 'premiumContentList',
      iconClasses: ['fa-solid', 'fa-wallet'],
      label: 'Premium Content'
    }
  ].map(({
    DialogApplication, dialogName, iconClasses, label
  }) => {
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
