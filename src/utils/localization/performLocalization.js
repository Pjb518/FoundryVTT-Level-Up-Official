import localizeObject from './localizeObject';

export default function performPreLocalization(config) {
  const prelocalizedKeys = config.PRELOCALIZED_KEYS;

  prelocalizedKeys.forEach((key) => {
    const target = foundry.utils.getProperty(config, key);
    localizeObject(target);
  });
}
