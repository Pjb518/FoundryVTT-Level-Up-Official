// eslint-disable-next-line import/no-unresolved
import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

export default function getSkillCheckPromptTitle(prompt) {
  const { skills } = CONFIG.A5E;

  return localize('A5E.SkillCheckPrompt', {
    skill: skills[prompt.skill]
  });
}
