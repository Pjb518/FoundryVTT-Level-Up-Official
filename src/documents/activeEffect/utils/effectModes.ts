import { A5E } from "../../../config.ts";

const MODES: Record<string, string> = A5E.ACTIVE_EFFECT_CHANGE_TYPES;
const DEFAULT_MODES = Object.keys(MODES)
  .filter((k) => k !== "custom")
  .sort((a, b) => a.localeCompare(b));

const DEFAULT_STRING_MODES = Object.keys(MODES)
  .filter((k) => !["custom", "upgrade", "downgrade", "conditional"].includes(k))
  .sort((a, b) => a.localeCompare(b));

const ADD_AND_OVERRIDE = ["add", "override"];
const OVERRIDE_ONLY = ["override"];
const CUSTOM_ONLY = ["custom"];
const CONDITIONAL_ONLY = ["conditional"];
const CONDITIONAL_AND_OVERRIDE = ["override", "conditional"];

export default {
  MODES,
  DEFAULT_MODES,
  DEFAULT_STRING_MODES,
  ADD_AND_OVERRIDE,
  OVERRIDE_ONLY,
  CUSTOM_ONLY,
  CONDITIONAL_ONLY,
  CONDITIONAL_AND_OVERRIDE,
};
