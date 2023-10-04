// @ts-ignore
import { localize } from '#runtime/svelte/helper';

export default function getFormattedTimeFromSeconds(
  seconds: number,
  round: number,
  turn: number
): string {
  if (seconds >= 63_072_000) {
    // two years
    return `${Math.floor(seconds / 31_536_000)} ${localize('A5E.DurationYearPlural')}`;
  } if (seconds >= 31_536_000) {
    // one year
    return `1 ${localize('A5E.DurationYear')}`;
  } if (seconds >= 1_209_600) {
    // two weeks
    return `${Math.floor(seconds / 604_800)} ${localize('A5E.DurationWeekPlural')}`;
  } if (seconds > 604_800) {
    // one week
    return `1 ${localize('A5E.DurationWeek')}`;
  } if (seconds >= 172_800) {
    // two days
    return `${Math.floor(seconds / 86_400)} ${localize('A5E.DurationDayPlural')}`;
  } if (seconds > 7_200) {
    // two hours
    return `${Math.floor(seconds / 3_600)} ${localize('A5E.DurationHourPlural')}`;
  } if (seconds > 120) {
    // two minutes
    return `${Math.floor(seconds / 60)} ${localize('A5E.DurationMinutePlural')}`;
  } if (seconds >= 12) {
    // two rounds
    return `${Math.floor(seconds / 6)} ${localize('A5E.DurationRoundPlural')}`;
  } if (seconds >= 6) {
    // one round
    return `1 ${localize('A5E.DurationRound')}`;
  } if (seconds >= 2) {
    // two seconds
    return `${seconds} ${localize('A5E.DurationSecondPlural')}`;
  } if (seconds === 1) {
    // one second
    return `1 ${localize('A5E.DurationSecond')}`;
  }

  // zero rounds
  const key = round === 0 && turn === 1
    ? 'Start of Turn'
    : 'End of Turn';

  return localize(key);
}
