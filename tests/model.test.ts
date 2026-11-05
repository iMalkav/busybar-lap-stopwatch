import assert from "node:assert/strict";
import test from "node:test";
import schema from "../src/appmeta/settings.json" with { type: "json" };
import { AppModel } from "../src/model.ts";
import { schemaDefaults, type Settings } from "../src/lib.ts";
const NOW = 1700000000000;
const make = (values: Settings = {}, saved: Settings = {}, now = NOW) =>
  new AppModel({ ...schemaDefaults(schema.fields), ...values }, saved, now);

test("pause excludes idle time and lap recording is bounded", () => {
  const a = make({ max_laps: 1 });
  a.key("ok", 0, NOW);
  a.key("wheel", 1, NOW + 1000);
  a.key("wheel", 1, NOW + 2000);
  assert.equal(a.laps.length, 1);
  a.key("ok", 0, NOW + 2000);
  a.tick(NOW + 10000);
  assert.equal(a.elapsed, 2000);
});
test("Back resets before it exits", () => {
  const a = make();
  a.key("ok", 0, NOW);
  assert.equal(a.key("back", 0, NOW + 1000), true);
  assert.equal(a.elapsed, 0);
  assert.equal(a.key("back", 0, NOW + 2000), false);
});
