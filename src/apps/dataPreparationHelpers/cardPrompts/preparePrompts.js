export default function preparePrompts(message) {
  return message.flags?.a5e?.prompts?.reduce((acc, prompt) => {
    acc[prompt.type] ??= [];
    acc[prompt.type].push(prompt);

    return acc;
  }, {}) ?? {};
}
