export default function getPromptSubtitle(prompt) {
  switch (prompt.type) {
    case 'effect':
      return 'Apply effect';
    case 'savingThrow':
      return prompt.onSave;
    default:
      return null;
  }
}
