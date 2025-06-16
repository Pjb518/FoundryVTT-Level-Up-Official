export function preparePrompts(message) {
  return (
    message.system.prompts?.reduce((acc, prompt) => {
      acc[prompt.type] ??= [];
      acc[prompt.type].push(prompt);

      return acc;
    }, {}) ?? {}
  );
}
