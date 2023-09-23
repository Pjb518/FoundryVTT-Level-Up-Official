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
    anchor.append(icon);
    anchor.href = url;
    anchor.innerHTML = `${icon} ${label}`;
    anchor.target = '_blank';
    anchor.setAttribute('data-tooltip', tooltip);

    classes.forEach((_class) => anchor.classList.add(_class));

    return anchor;
  });

  systemInfo.append(...links);
  systemRow?.after(systemInfo);
}
