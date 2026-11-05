import { num, flag, cycle, duration, App, type View } from "./lib.ts";

export class AppModel extends App {
  running = false;
  elapsed = 0;
  last = 0;
  laps: number[] = [];
  selected = 0;
  tick(now: number): void {
    if (this.running) this.elapsed += Math.max(0, now - this.last);
    this.last = now;
  }
  key(key: string, delta: number, now: number): boolean {
    this.tick(now);
    if (key === "ok") {
      this.running = !this.running;
      this.last = now;
    }
    if (key === "wheel" && this.running && delta > 0) {
      if (this.laps.length < num(this.settings, "max_laps", 20)) {
        this.laps.push(this.elapsed);
        this.selected = this.laps.length - 1;
      }
    } else if (key === "wheel")
      this.selected = cycle(this.selected, delta, this.laps.length);
    if (key === "back" && (this.elapsed > 0 || this.running)) {
      this.running = false;
      this.elapsed = 0;
      this.laps = [];
      this.selected = 0;
      return true;
    }
    return false;
  }
  view(_now: number): View {
    return {
      title: "Stopwatch",
      value: duration(this.elapsed, flag(this.settings, "tenths")),
      rows: [
        this.running ? "RUNNING" : "PAUSED",
        "Laps " + this.laps.length,
        this.laps.length
          ? "Lap " +
            (this.selected + 1) +
            ": " +
            duration(this.laps[this.selected], true)
          : "No laps",
      ],
      hint: this.running ? "OK pause / wheel+ lap" : "OK start / Back reset",
    };
  }
}
