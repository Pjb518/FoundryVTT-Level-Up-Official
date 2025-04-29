import type { Component } from "svelte";

export type Tab = {
  name: string;
  label?: string;
  icon?: string;
  component: Component;
  display?: boolean;
  hasSubNavigation?: boolean;
};
