export default function registerSettingsConfig() {
  const { A5E } = CONFIG;
  
  return {
    refreshableSettings: new Set([
      'automatedConditions'
    ])
  };
}
