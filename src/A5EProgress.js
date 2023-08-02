export default class Progress {
  #value = 0;

  constructor({ max, label }) {
    this.label = label ?? '';
    this.max = max;
    this.#value = 0;
  }

  advance({ by = 1, label = this.label }) {
    if (this.#value === this.max) return;
    this.#value += Math.abs(by);
    const pct = Math.floor((this.#value / this.max) * 100);
    SceneNavigation.displayProgressBar({ label, pct });
  }

  close({ label = '' } = {}) {
    SceneNavigation.displayProgressBar({ label, pct: 100 });
  }
}
