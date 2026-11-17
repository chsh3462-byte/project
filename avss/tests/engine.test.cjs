const assert = require('node:assert/strict');
const { test } = require('node:test');
require('../src/engine.js');
const paths = { conveyor: ['stop', 'report', 'warn', 'wait'], forklift: ['stop', 'check', 'wait', 'lane'], chemical: ['identify', 'evacuate', 'report', 'warn'] };
function setup(scenarioId = 'conveyor', level = 1) {
  let clock = 1000000;
  const notifications = [];
  const engine = new AVSSEngine({ scenarioId, level, now: () => clock, onChange: state => notifications.push(state) });
  return { engine, tick: ms => { clock += ms; }, notifications };
}
for (const [id, path] of Object.entries(paths)) {
  test(`${id}: correct response completes with real timing and higher recommended difficulty`, () => {
    const { engine, tick } = setup(id);
    assert.equal(engine.getState().phase, 'idle');
    assert.equal(engine.getState().elapsedMs, 0);
    engine.choose(path[0]);
    assert.equal(engine.getState().logs.length, 0);
    engine.start();
    for (const action of path) { tick(3500); engine.choose(action); }
    const state = engine.getState();
    assert.equal(state.phase, 'complete');
    assert.equal(state.result.durationMs, 14000);
    assert.equal(state.result.avgResponseMs, 3500);
    assert.equal(state.result.score, 100);
    assert.equal(state.result.accuracy, 100);
    assert.equal(state.result.recommendedLevel, 2);
    assert.equal(state.logs.length, path.length);
    tick(60000);
    assert.equal(engine.getState().elapsedMs, 14000);
    engine.choose(path.at(-1));
    assert.equal(engine.getState().logs.length, path.length);
  });
}
test('wrong choices do not advance and lead to remedial difficulty', () => {
  const { engine, tick } = setup('chemical', 3);
  engine.start(); tick(2000); engine.choose('touch');
  assert.equal(engine.getState().stage, 0);
  assert.equal(engine.getState().feedback.type, 'error');
  tick(3000); engine.choose('smell');
  for (const action of paths.chemical) { tick(5000); engine.choose(action); }
  const state = engine.getState();
  assert.equal(state.result.mistakes, 2);
  assert.equal(state.result.score, 76);
  assert.equal(state.result.accuracy, 67);
  assert.equal(state.result.recommendedLevel, 2);
  assert.equal(state.result.behaviors.find(item => item.id === 'spot').accuracy, 33);
});
test('hint penalty applies once per stage and reset clears the session while rotating context', () => {
  const { engine } = setup();
  const firstVariant = engine.getState().variant.id;
  engine.hint(); assert.equal(engine.getState().hints, 0);
  engine.start(); engine.hint(); engine.hint();
  assert.equal(engine.getState().hints, 1);
  assert.equal(engine.getState().score, 96);
  assert.equal(engine.getState().logs.length, 1);
  engine.choose('stop');
  assert.equal(engine.getState().hintText, '');
  engine.hint(); assert.equal(engine.getState().hints, 2);
  engine.reset();
  const state = engine.getState();
  assert.notEqual(state.variant.id, firstVariant);
  assert.equal(state.phase, 'idle'); assert.equal(state.logs.length, 0);
  assert.equal(state.hints, 0); assert.equal(state.score, 100);
});
test('invalid and out-of-order actions cannot advance state; snapshots are isolated', () => {
  const { engine } = setup(); engine.start();
  engine.choose('report'); engine.choose('<script>');
  assert.equal(engine.getState().stage, 0); assert.equal(engine.getState().logs.length, 0);
  const state = engine.getState(); state.variant.id = 'changed'; state.options.length = 0;
  assert.notEqual(engine.getState().variant.id, 'changed'); assert.equal(engine.getState().options.length, 2);
});
test('slow decisions recommend lower difficulty; repeated start does not reset the timer', () => {
  const { engine, tick } = setup('forklift', 2);
  engine.start(); tick(1000); engine.start();
  assert.equal(engine.getState().elapsedMs, 1000);
  for (const action of paths.forklift) { tick(60000); engine.choose(action); }
  assert.equal(engine.getState().result.recommendedLevel, 1);
  assert.equal(engine.getState().result.durationMs, 241000);
});
test('difficulty bounds, fallback scenario and complete snapshots have no actionable options', () => {
  const { engine, tick } = setup('bogus', 99);
  assert.equal(engine.getState().scenarioId, 'conveyor'); assert.equal(engine.getState().level, 3);
  engine.start(); for (const action of paths.conveyor) { tick(1000); engine.choose(action); }
  assert.equal(engine.getState().result.recommendedLevel, 3); assert.deepEqual(engine.getState().options, []);
  engine.reset({ scenarioId: 'chemical', level: -4 }); assert.equal(engine.getState().level, 1);
});

test('difficulty changes the actual choice set, automatic guidance, and contextual pressure', () => {
  for (const id of Object.keys(paths)) {
    for (const level of [1, 2, 3]) {
      const { engine, tick } = setup(id, level);
      engine.start();
      for (const safeAction of paths[id]) {
        const state = engine.getState();
        assert.equal(state.options.length, level + 1);
        assert.equal(state.challenge.automaticGuidance, level === 1);
        assert.equal(state.challenge.coworkerPressure, level === 3);
        assert.equal(state.options.some(item => item.id === safeAction), true);
        assert.equal(state.prompt.includes('서두르자'), level === 3);
        if (level === 3) {
          tick(1000); engine.choose('shortcut_' + state.stage);
          assert.equal(engine.getState().stage, state.stage);
          assert.equal(engine.getState().feedback.type, 'error');
        }
        tick(1000); engine.choose(safeAction);
      }
      assert.equal(engine.getState().phase, 'complete');
    }
  }
});
test('wall-clock rewind cannot make elapsed time or action logs decrease', () => {
  const { engine, tick } = setup();
  engine.start(); tick(5000);
  assert.equal(engine.getState().elapsedMs, 5000);
  tick(-4000);
  assert.equal(engine.getState().elapsedMs, 5000);
  engine.choose('stop');
  assert.equal(engine.getState().logs[0].elapsedMs, 5000);
  tick(6000); engine.choose('report');
  assert.equal(engine.getState().logs[1].elapsedMs, 7000);
  assert.equal(engine.getState().logs[1].responseMs, 2000);
  tick(-20000); engine.choose('warn'); engine.choose('wait');
  const finished = engine.getState();
  assert.equal(finished.result.durationMs, 7000);
  assert.equal(finished.logs.every((log, index, all) => index === 0 || log.elapsedMs >= all[index - 1].elapsedMs), true);
  const result = JSON.stringify(finished.result);
  engine.start(); engine.hint(); engine.choose('wait');
  assert.equal(JSON.stringify(engine.getState().result), result);
  assert.equal(engine.getState().logs.length, 4);
});
test('an action omitted from the foundation choices cannot be submitted', () => {
  const { engine } = setup('conveyor', 1);
  engine.start();
  const displayedIds = engine.getState().options.map(item => item.id);
  const omitted = ['inspect', 'restart'].find(id => !displayedIds.includes(id));
  engine.choose(omitted);
  assert.equal(engine.getState().logs.length, 0);
  assert.equal(engine.getState().mistakes, 0);
});
