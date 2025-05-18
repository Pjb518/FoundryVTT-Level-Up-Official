export type ActionComponentType = {
  heading: string;
  singleLabel: string;
  buttonLabel?: string;
  component: any;
};

export type PromptProps = {
  deletePrompt: (actionId: string, promptId: string) => void;
  duplicatePrompt: (actionId: string, prompt: Record<string, any>) => void;
  prompt: Record<string, any>;
  promptId: string;
};

export type RollProps = {
  deleteRoll: (actionId: string, rollId: string) => void;
  duplicateRoll: (actionId: string, roll: Record<string, any>) => void;
  roll: Record<string, any>;
  rollId: string;
};
