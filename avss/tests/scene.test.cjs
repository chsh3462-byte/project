const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const sceneSource = fs.readFileSync(path.join(__dirname, '../src/scene.js'), 'utf8');
const engineSource = fs.readFileSync(path.join(__dirname, '../src/engine.js'), 'utf8');

function fixture({ width = 900, height = 550, reduced = false } = {}) {
  let bounds = { width, height, left: 0, top: 0 };
  let nextFrame, cancelled = false, disconnected = false, hiddenParent = false;
  const events = new Map(), attributes = {}, calls = [];
  const context = new Proxy({}, {
    get(object, key) {
      if (key in object) return object[key];
      return (...args) => {
        args.forEach(value => {
          if (typeof value === 'number') assert.ok(Number.isFinite(value), `${String(key)} received a non-finite coordinate`);
        });
        if (key === 'arc') assert.ok(args[2] >= 0, 'arc radius must be nonnegative');
        if (key === 'ellipse') assert.ok(args[2] >= 0 && args[3] >= 0, 'ellipse radii must be nonnegative');
        calls.push({ method: key, args });
        if (key === 'createRadialGradient') return { addColorStop() {} };
      };
    },
    set(object, key, value) {
      if ((key === 'fillStyle' || key === 'strokeStyle') && typeof value === 'string' && value.startsWith('#')) {
        assert.match(value, /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
      }
      object[key] = value;
      return true;
    }
  });
  const canvas = {
    style: {}, width, height,
    getBoundingClientRect: () => bounds,
    getContext: () => context,
    setAttribute: (key, value) => { attributes[key] = value; },
    addEventListener: (key, callback) => events.set(key, callback),
    removeEventListener: (key, callback) => { if (events.get(key) === callback) events.delete(key); },
    closest: () => hiddenParent ? {} : null
  };
  const sandbox = {
    window: { devicePixelRatio: 3, addEventListener() {}, removeEventListener() {} },
    document: { hidden: false },
    matchMedia: () => ({ matches: reduced }),
    ResizeObserver: class { observe() {} disconnect() { disconnected = true; } },
    requestAnimationFrame: callback => { nextFrame = callback; return 77; },
    cancelAnimationFrame: id => { assert.equal(id, 77); cancelled = true; }
  };
  vm.createContext(sandbox);
  vm.runInContext(sceneSource, sandbox);
  const selected = [];
  const scene = new sandbox.window.FactoryScene(canvas, { onSelect: id => selected.push(id) });
  return {
    scene, sandbox, canvas, calls, events, selected, attributes,
    frame: time => nextFrame(time),
    resize: (w, h) => { bounds = { ...bounds, width: w, height: h }; scene.resize(); },
    hide: value => { hiddenParent = value; },
    cleanup: () => ({ cancelled, disconnected })
  };
}

test('factory renders all scenario phases at desktop and mobile sizes with valid geometry and colors', () => {
  const f = fixture();
  for (const [w, h] of [[900, 550], [640, 440], [360, 350], [280, 300]]) {
    f.resize(w, h);
    assert.equal(f.canvas.width, w * 2, 'DPR should be capped at two');
    for (const scenarioId of ['conveyor', 'forklift', 'chemical']) {
      for (const phase of ['idle', 'active', 'complete']) {
        f.scene.update({ scenarioId, phase, stage: phase === 'complete' ? 4 : 1 });
        f.scene.draw(7.5);
        assert.equal(f.scene.hitAreas.length, 3);
        for (const area of f.scene.hitAreas) {
          assert.ok(area.x >= 0 && area.x + area.w <= w, `${area.id} label exceeds canvas width`);
          assert.ok(area.y >= 0 && area.y + area.h <= h, `${area.id} label exceeds canvas height`);
        }
      }
    }
  }
  assert.equal(f.attributes.role, 'img');
  assert.match(f.attributes['aria-label'], /시나리오 선택 버튼/);
  f.scene.destroy();
});

test('each zone click selects its scenario; background and unknown ids do not change selection', () => {
  const f = fixture();
  f.scene.draw(0);
  for (const area of f.scene.hitAreas) {
    const event = { clientX: area.x + 8, clientY: area.y + 8 };
    f.scene.move(event);
    assert.equal(f.canvas.style.cursor, 'pointer');
    f.scene.click(event);
    assert.equal(f.selected.at(-1), area.id);
  }
  f.scene.click({ clientX: 0, clientY: 0 });
  assert.equal(f.selected.length, 3);
  f.scene.setScenario('chemical');
  f.scene.setScenario('not-a-zone');
  assert.equal(f.scene.state.scenarioId, 'chemical');
  f.scene.destroy();
});

test('hidden views skip drawing; reduced motion draws only after state or layout changes', () => {
  const f = fixture({ reduced: true });
  const clearCount = () => f.calls.filter(call => call.method === 'clearRect').length;
  f.frame(10);
  assert.equal(clearCount(), 1);
  f.frame(20);
  assert.equal(clearCount(), 1);
  f.scene.update({ phase: 'active' });
  f.frame(30);
  assert.equal(clearCount(), 2);
  f.hide(true);
  f.scene.update({ stage: 1 });
  f.frame(40);
  assert.equal(clearCount(), 2);
  f.hide(false);
  f.frame(50);
  assert.equal(clearCount(), 3);
  f.resize(0, 0);
  f.frame(60);
  assert.equal(clearCount(), 3);
  f.resize(480, 350);
  f.frame(70);
  assert.equal(clearCount(), 4);
  f.scene.destroy();
});

test('real engine transitions integrate with the scene for all three complete sessions', () => {
  const f = fixture();
  vm.runInContext(engineSource, f.sandbox);
  const routes = {
    conveyor: ['stop', 'report', 'warn', 'wait'],
    forklift: ['stop', 'check', 'wait', 'lane'],
    chemical: ['identify', 'evacuate', 'report', 'warn']
  };
  for (const [scenarioId, route] of Object.entries(routes)) {
    const engine = new f.sandbox.window.AVSSEngine({ scenarioId, level: 3, onChange: state => f.scene.update(state) });
    engine.start();
    f.scene.draw(1);
    for (const action of route) { engine.choose(action); f.scene.draw(2); }
    assert.equal(f.scene.state.scenarioId, scenarioId);
    assert.equal(f.scene.state.phase, 'complete');
    assert.equal(f.scene.state.stage, 4);
    assert.equal(f.scene.state.score, 100);
  }
  f.scene.destroy();
});

test('destroy cancels frame scheduling and removes canvas listeners and observer', () => {
  const f = fixture();
  assert.equal(f.events.size, 3);
  f.scene.destroy();
  assert.equal(f.events.size, 0);
  assert.deepEqual(f.cleanup(), { cancelled: true, disconnected: true });
});
