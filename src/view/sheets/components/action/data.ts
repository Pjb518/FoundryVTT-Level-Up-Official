export type RollProps = {
  deleteRoll: (actionId: string, rollId: string) => void;
  duplicateRoll: (actionId: string, roll: Record<string, any>) => void;
  roll: Record<string, any>;
  rollId: string;
};

export type ActionComponentType = {
  heading: string;
  singleLabel: string;
  buttonLabel?: string;
  component: any;
};
