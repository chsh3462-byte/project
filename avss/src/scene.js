(function () {
  'use strict';

  const COLORS = {
    bg: '#09131d', floor: '#152631', grid: '#263c47', mint: '#7ce5c0',
    amber: '#f6c76a', text: '#c7d8df', muted: '#78939f', line: '#2b4653'
  };
  const ZONES = [
    { id: 'conveyor', no: '01', title: '컨베이어 가드', en: 'CONVEYOR GUARD', x: 5, y: 5.2, labelX: 4, labelY: 2, color: '#f6c76a' },
    { id: 'forklift', no: '02', title: '지게차 사각지대', en: 'BLIND CORNER', x: 15.6, y: 5.8, labelX: 16.2, labelY: 3, color: '#f6c76a' },
    { id: 'chemical', no: '03', title: '화학물질 누출', en: 'CHEMICAL LEAK', x: 5, y: 11.3, labelX: 4, labelY: 12.4, color: '#7ce5c0' }
  ];

  class FactoryScene {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.onSelect = typeof options.onSelect === 'function' ? options.onSelect : () => {};
      this.state = { scenarioId: 'conveyor', phase: 'idle', stage: 0, level: 1 };
      this.hitAreas = [];
      this.disposed = false;
      this.dirty = true;
      this.hovered = '';
      this.reducedMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.boundResize = this.resize.bind(this);
      this.boundClick = this.click.bind(this);
      this.boundMove = this.move.bind(this);
      this.boundLeave = () => { this.hovered = ''; this.dirty = true; canvas.style.cursor = 'default'; };
      canvas.addEventListener('click', this.boundClick);
      canvas.addEventListener('pointermove', this.boundMove);
      canvas.addEventListener('pointerleave', this.boundLeave);
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', '공장 시뮬레이션 지도: 컨베이어, 지게차 통로, 화학물질 보관 구역. 시나리오 선택 버튼으로도 구역을 선택할 수 있습니다.');
      if (typeof ResizeObserver !== 'undefined') {
        this.observer = new ResizeObserver(this.boundResize);
        this.observer.observe(canvas);
      } else {
        window.addEventListener('resize', this.boundResize);
      }
      this.resize();
      const frame = (time) => {
        if (this.disposed) return;
        const hidden = (typeof document !== 'undefined' && document.hidden) || this.canvas.closest?.('[hidden]');
        if (this.visible && !hidden && (!this.reducedMotion || this.dirty)) {
          this.draw(this.reducedMotion ? 0 : time / 1000);
          this.dirty = false;
        }
        this.animation = requestAnimationFrame(frame);
      };
      this.animation = requestAnimationFrame(frame);
    }

    update(state) {
      this.state = { ...this.state, ...state };
      this.dirty = true;
    }

    setScenario(id) {
      if (ZONES.some(zone => zone.id === id)) { this.state.scenarioId = id; this.dirty = true; }
    }

    destroy() {
      this.disposed = true;
      cancelAnimationFrame(this.animation);
      this.observer?.disconnect();
      window.removeEventListener('resize', this.boundResize);
      this.canvas.removeEventListener('click', this.boundClick);
      this.canvas.removeEventListener('pointermove', this.boundMove);
      this.canvas.removeEventListener('pointerleave', this.boundLeave);
    }

    resize() {
      const bounds = this.canvas.getBoundingClientRect();
      this.visible = bounds.width > 0 && bounds.height > 0;
      this.dirty = true;
      if (!this.visible && this.width) return;
      this.width = Math.max(1, bounds.width || this.canvas.clientWidth || 900);
      this.height = Math.max(1, bounds.height || this.canvas.clientHeight || 550);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.dpr = dpr;
      this.canvas.width = Math.round(this.width * dpr);
      this.canvas.height = Math.round(this.height * dpr);
      this.scale = Math.min((this.width - 34) / 30.2, (this.height - 65) / 19.7);
      this.scale = Math.max(this.scale, 2);
      this.cx = this.width / 2 - this.scale * 2.58;
      this.cy = this.height / 2 - this.scale * 6.2;
    }

    p(x, y, z = 0) {
      return { x: this.cx + (x - y) * this.scale * 0.86, y: this.cy + (x + y) * this.scale * 0.43 - z * this.scale };
    }

    poly(points, fill, stroke, width = 1) {
      const c = this.ctx;
      c.beginPath();
      points.forEach((point, i) => i ? c.lineTo(point.x, point.y) : c.moveTo(point.x, point.y));
      c.closePath();
      if (fill) { c.fillStyle = fill; c.fill(); }
      if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
    }

    plane(x, y, w, d, z, fill, stroke, width) {
      this.poly([this.p(x, y, z), this.p(x + w, y, z), this.p(x + w, y + d, z), this.p(x, y + d, z)], fill, stroke, width);
    }

    line(points, color, width = 1, dash = []) {
      const c = this.ctx;
      c.beginPath();
      points.forEach((point, i) => i ? c.lineTo(point.x, point.y) : c.moveTo(point.x, point.y));
      c.strokeStyle = color;
      c.lineWidth = width;
      c.setLineDash(dash);
      c.stroke();
      c.setLineDash([]);
    }

    box(x, y, w, d, h, colors, z = 0) {
      const palette = Array.isArray(colors) ? colors : [colors, colors, colors];
      const a = this.p(x, y, z + h), b = this.p(x + w, y, z + h);
      const cc = this.p(x + w, y + d, z + h), dd = this.p(x, y + d, z + h);
      this.poly([dd, cc, this.p(x + w, y + d, z), this.p(x, y + d, z)], palette[1], '#07121a55', 0.5);
      this.poly([b, this.p(x + w, y, z), this.p(x + w, y + d, z), cc], palette[2], '#07121a55', 0.5);
      this.poly([a, b, cc, dd], palette[0], '#b0d2d313', 0.5);
    }

    ellipse(x, y, z, rx, ry, color, stroke) {
      const c = this.ctx, p = this.p(x, y, z);
      c.beginPath();
      c.ellipse(p.x, p.y, rx * this.scale, ry * this.scale, 0, 0, Math.PI * 2);
      c.fillStyle = color;
      c.fill();
      if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); }
    }

    cylinder(x, y, radius, height, colors) {
      const c = this.ctx, top = this.p(x, y, height), bottom = this.p(x, y);
      c.fillStyle = colors[1];
      c.beginPath();
      c.moveTo(top.x - radius * this.scale, top.y);
      c.lineTo(bottom.x - radius * this.scale, bottom.y);
      c.ellipse(bottom.x, bottom.y, radius * this.scale, radius * this.scale * 0.45, 0, Math.PI, 0, true);
      c.lineTo(top.x + radius * this.scale, top.y);
      c.closePath();
      c.fill();
      this.ellipse(x, y, height, radius, radius * 0.45, colors[0], '#8babac3a');
      this.ellipse(x, y, 0.13, radius, radius * 0.45, '#00000000', '#223a47');
      this.ellipse(x, y, height * 0.4, radius, radius * 0.45, '#00000000', '#76919c3d');
      this.ellipse(x, y, height * 0.8, radius, radius * 0.45, '#00000000', '#76919c3d');
    }

    shadow(x, y, w, d) {
      this.plane(x + 0.35, y + 0.4, w + 0.2, d + 0.35, 0.015, '#020b1499');
    }

    person(x, y, color, facing = 1) {
      const c = this.ctx, s = this.scale;
      this.ellipse(x, y, 0.01, 0.33, 0.16, '#00000065');
      const feet = this.p(x, y, 0.13), body = this.p(x, y, 0.68), head = this.p(x, y, 1.18);
      this.line([{ x: feet.x - s * 0.13, y: feet.y }, { x: body.x - s * 0.07, y: body.y + s * 0.14 }], '#445b69', s * 0.14);
      this.line([{ x: feet.x + s * 0.13, y: feet.y }, { x: body.x + s * 0.07, y: body.y + s * 0.14 }], '#59707e', s * 0.14);
      this.poly([{ x: body.x - s * 0.22, y: body.y - s * 0.18 }, { x: body.x + s * 0.17, y: body.y - s * 0.18 }, { x: body.x + s * 0.21, y: body.y + s * 0.2 }, { x: body.x - s * 0.16, y: body.y + s * 0.2 }], color);
      this.line([{ x: body.x - s * 0.1, y: body.y - s * 0.12 }, { x: body.x - s * 0.1, y: body.y + s * 0.15 }], '#e2ffff9c', Math.max(1, s * 0.04));
      this.line([{ x: body.x + s * 0.18 * facing, y: body.y - s * 0.1 }, { x: body.x + s * 0.34 * facing, y: body.y + s * 0.2 }], '#9eabae', s * 0.1);
      c.fillStyle = '#d7bc9d';
      c.beginPath(); c.arc(head.x, head.y + s * 0.05, s * 0.14, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#f3d888';
      c.beginPath(); c.ellipse(head.x, head.y - s * 0.03, s * 0.2, s * 0.12, 0, 0, Math.PI * 2); c.fill();
    }

    drawFloor(time) {
      const c = this.ctx, s = this.scale;
      this.box(0, 0, 20, 14, 0.38, [COLORS.floor, '#0a1722', '#0d1d29'], -0.38);
      for (let x = 0; x <= 20; x++) this.line([this.p(x, 0), this.p(x, 14)], x % 5 === 0 ? '#2d46524d' : '#243c4442', 0.65);
      for (let y = 0; y <= 14; y++) this.line([this.p(0, y), this.p(20, y)], y % 5 === 0 ? '#2d46524d' : '#243c4442', 0.65);

      // A continuous pedestrian route, marked separately from the vehicle lane.
      this.plane(9.2, 0.2, 1.45, 13.6, 0.02, '#4eb49514');
      this.line([this.p(9.2, 0.2), this.p(9.2, 13.8)], '#75d8b975', 1.3);
      this.line([this.p(10.65, 0.2), this.p(10.65, 13.8)], '#75d8b975', 1.3);
      this.plane(0.3, 7.4, 19.4, 1.25, 0.025, '#4eb49512');
      this.line([this.p(0.3, 7.4), this.p(19.7, 7.4)], '#75d8b960', 1);
      this.line([this.p(0.3, 8.65), this.p(19.7, 8.65)], '#75d8b960', 1);
      for (let y = 1; y < 14; y += 2.8) {
        const a = this.p(9.92, y), b = this.p(9.66, y + 0.4), d = this.p(10.17, y + 0.4);
        this.poly([a, b, d], '#7ce5c04d');
      }
      this.plane(11.2, 3.3, 8.2, 3.7, 0.03, '#a98c4908');
      this.line([this.p(11.2, 3.3), this.p(19.4, 3.3), this.p(19.4, 7.0), this.p(11.2, 7.0)], '#b7a36559', 1, [4, 5]);
      for (let i = 0; i < 6; i++) this.plane(11.1, 3.45 + i * 0.57, 0.22, 0.3, 0.04, '#e5c96e9c');
      this.plane(11.3, 7.18, 6.5, 0.1, 0.04, '#f1ce6fc7');

      const zone = ZONES.find(item => item.id === this.state.scenarioId) || ZONES[0];
      const selected = this.state.phase === 'complete' ? COLORS.mint : zone.color;
      const pulse = this.state.phase === 'active' ? 0.18 + Math.sin(time * 2) * 0.035 : 0.09;
      c.save(); c.globalAlpha = pulse;
      if (zone.id === 'conveyor') this.plane(1.4, 2, 7.0, 4.8, 0.05, selected);
      if (zone.id === 'forklift') this.plane(11.2, 3.3, 8.2, 3.7, 0.05, selected);
      if (zone.id === 'chemical') this.plane(1.4, 9.25, 6.8, 3.9, 0.05, selected);
      c.restore();

      this.line([this.p(0, 14, -0.36), this.p(20, 14, -0.36), this.p(20, 0, -0.36)], '#527b8961', 1);
      this.line([this.p(0, 14, 0.01), this.p(20, 14, 0.01)], '#7ce5c029', 1);
      // Blueprint ticks outside the model's perimeter.
      for (let i = 0; i <= 20; i += 2) this.line([this.p(i, 14.25), this.p(i, 14.45)], '#4c6d7a', 0.65);
      for (let i = 0; i <= 14; i += 2) this.line([this.p(20.25, i), this.p(20.45, i)], '#4c6d7a', 0.65);
      if (s > 16) {
        c.fillStyle = '#47646f'; c.font = '9px ui-monospace, monospace';
        const text = this.p(19, 14.7);
        c.fillText('VIRTUAL FLOOR / 01', text.x - 114, text.y + 4);
      }
    }

    drawWalls() {
      this.box(0, 0, 20, 0.16, 1.8, ['#30434f', '#22333f', '#172833']);
      this.box(0, 0.16, 0.16, 13.84, 1.8, ['#30434f', '#22333f', '#172833']);
      for (let x = 1; x < 20; x += 3.6) {
        this.box(x, 0.2, 0.12, 0.13, 2.0, ['#465e6b', '#324650', '#243b47']);
        this.line([this.p(x + 0.35, 0.19, 1.22), this.p(x + 2.4, 0.19, 1.22)], '#7ce5c027', 2);
      }
      for (let y = 2; y < 14; y += 3.4) this.box(0.2, y, 0.12, 0.12, 2.0, ['#465e6b', '#324650', '#243b47']);
      this.box(17.7, 0.2, 1.35, 0.1, 1.2, ['#45746c', '#34605a', '#28514c']);
      const sign = this.p(18.4, 0.32, 1.1);
      this.ctx.fillStyle = '#b6f1d5'; this.ctx.font = `bold ${Math.max(6, this.scale * 0.25)}px sans-serif`;
      this.ctx.fillText('EXIT →', sign.x - this.scale * 0.45, sign.y);
    }

    drawConveyor(time) {
      const s = this.scale, c = this.ctx;
      this.shadow(2.1, 3.3, 5.8, 2.4);
      for (const x of [2.3, 4.9, 7.4]) {
        this.box(x, 3.5, 0.18, 0.22, 1.2, ['#6a7e83', '#3a5360', '#263d47']);
        this.box(x, 5.2, 0.18, 0.22, 1.2, ['#6a7e83', '#3a5360', '#263d47']);
      }
      this.box(2.0, 3.35, 5.9, 2.15, 0.35, ['#71848b', '#465d68', '#314a56'], 1.0);
      this.plane(2.1, 3.5, 5.7, 1.8, 1.36, '#192a34');
      for (let x = 2.2; x < 7.8; x += 0.27) {
        this.plane(x, 3.55, 0.14, 1.7, 1.38, '#687d83');
        this.line([this.p(x, 3.55, 1.4), this.p(x, 5.25, 1.4)], '#a2b4b44a', 0.7);
      }
      const stopped = this.state.scenarioId === 'conveyor' && this.state.phase !== 'idle';
      for (let i = 0; i < 3; i++) {
        const x = 2.65 + ((i * 1.62 + (stopped ? 0 : time * 0.23)) % 4.6);
        this.box(x, 3.96, 0.8, 0.85, 0.65, ['#b5a07b', '#857859', '#6c634c'], 1.4);
        this.plane(x + 0.34, 3.96, 0.12, 0.85, 2.06, '#d6c39b');
      }
      // Two end towers and the amber guard field.
      for (const x of [1.75, 8.15]) {
        this.box(x, 2.65, 0.25, 3.25, 0.16, ['#48585f', '#253d48', '#1a2e3a']);
        for (const y of [2.65, 5.65]) this.box(x, y, 0.23, 0.23, 2.1, ['#e6c16b', '#ad914c', '#806c3d']);
        this.line([this.p(x + 0.12, 2.75, 2.0), this.p(x + 0.12, 5.75, 2.0)], '#e7c56b99', Math.max(1, s * 0.035));
      }
      for (const height of [0.6, 1.05, 1.5]) {
        c.save(); c.globalAlpha = stopped ? 0.68 : 0.25;
        this.line([this.p(1.88, 5.77, height), this.p(8.28, 5.77, height)], '#f1c565', 1, [2, 4]);
        c.restore();
      }
      // Machine control terminal and signal stack.
      this.box(7.6, 2.45, 0.75, 0.55, 1.55, ['#667d88', '#405865', '#2c4653']);
      this.plane(7.7, 2.54, 0.5, 0.35, 1.56, '#6bdbb6');
      this.line([this.p(7.98, 2.7, 1.55), this.p(7.98, 2.7, 2.6)], '#687e87', 2);
      const lamp = this.p(7.98, 2.7, 2.65);
      const lampColor = this.state.phase === 'complete' ? '#7ce5c0' : (stopped ? '#ffb75e' : '#80e7ba');
      c.save(); c.shadowColor = lampColor; c.shadowBlur = stopped ? 12 + Math.sin(time * 3) * 4 : 6;
      c.fillStyle = lampColor; c.beginPath(); c.arc(lamp.x, lamp.y, Math.max(2, s * 0.12), 0, Math.PI * 2); c.fill(); c.restore();
    }

    drawRack(x, y) {
      this.shadow(x, y, 6, 1.35);
      for (const height of [0.2, 1.4, 2.6]) {
        this.box(x, y, 6.2, 1.3, 0.13, ['#8a6c48', '#765b3f', '#4d4b3e'], height);
        for (let i = 0; i < 4; i++) {
          const dark = (i + Math.floor(height)) % 2;
          this.box(x + 0.25 + i * 1.45, y + 0.15, 1.05, 0.95, 0.76, dark ? ['#607780', '#3e5663', '#344b58'] : ['#998c6b', '#71684f', '#625e49'], height + 0.13);
          this.plane(x + 0.6 + i * 1.45, y + 0.15, 0.13, 0.95, height + 0.9, '#c3b99777');
        }
      }
      for (const postX of [x, x + 3.05, x + 6.1]) {
        this.box(postX, y + 1.25, 0.12, 0.12, 3.7, ['#d5a959', '#a97b40', '#78592e']);
        this.box(postX, y, 0.12, 0.12, 3.7, ['#d5a959', '#a97b40', '#78592e']);
      }
    }

    drawForklift(time) {
      const s = this.scale, c = this.ctx;
      const selected = this.state.scenarioId === 'forklift';
      const cleared = selected && (this.state.phase === 'complete' || this.state.stage >= 3);
      const moving = selected && this.state.phase === 'active' && this.state.stage < 3;
      const x = 14.7 + (moving ? Math.sin(time * 0.7) * 0.7 : 0), y = cleared ? 3.0 : 4.3;
      this.shadow(x - 0.2, y - 0.2, 2.2, 2.25);
      for (const dx of [0.1, 1.7]) for (const dy of [0.1, 1.6]) {
        const p = this.p(x + dx, y + dy, 0.32);
        c.fillStyle = '#081117'; c.beginPath(); c.ellipse(p.x, p.y, s * 0.16, s * 0.3, -0.45, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#4f626b'; c.beginPath(); c.ellipse(p.x, p.y, s * 0.07, s * 0.13, -0.45, 0, Math.PI * 2); c.fill();
      }
      this.box(x, y, 1.8, 1.8, 0.6, ['#edc96f', '#c69c48', '#99792f'], 0.38);
      this.box(x + 0.1, y + 0.1, 1.6, 0.55, 0.4, ['#f4d681', '#c9a552', '#b48f40'], 0.98);
      this.box(x + 0.6, y + 0.72, 0.55, 0.55, 0.5, ['#3a4d57', '#263944', '#162c38'], 0.95);
      for (const dx of [0.1, 1.65]) for (const dy of [0.2, 1.55]) this.box(x + dx, y + dy, 0.1, 0.1, 1.25, ['#849097', '#53656e', '#344d59'], 1.0);
      this.box(x - 0.03, y + 0.12, 1.86, 1.55, 0.13, ['#dfb955', '#b28c3c', '#8b6e2d'], 2.25);
      for (const dx of [0.25, 1.4]) {
        this.box(x + dx, y + 1.8, 0.13, 0.15, 2.3, ['#71828a', '#445964', '#273f4d'], 0.25);
        this.box(x + dx, y + 1.9, 0.17, 1.1, 0.1, ['#7b8990', '#54636d', '#364d5b'], 0.3);
      }
      const warning = this.p(x + 0.9, y + 0.65, 2.48);
      c.fillStyle = '#ffd281'; c.beginPath(); c.arc(warning.x, warning.y, s * 0.09, 0, Math.PI * 2); c.fill();
      this.box(18.35, 4.4, 0.95, 0.95, 1.55, ['#6c7c85', '#455b68', '#334b58']);
      this.box(18.1, 5.6, 1.1, 0.8, 0.85, ['#a5936d', '#7a7056', '#69644e']);
    }

    drawChemicals(time) {
      const c = this.ctx;
      this.shadow(1.75, 9.7, 4.3, 2.5);
      this.box(1.65, 9.55, 4.7, 2.8, 0.18, ['#3c5b62', '#213e4a', '#1b3442']);
      this.cylinder(2.65, 10.4, 0.64, 1.8, ['#72969a', '#41656f']);
      this.cylinder(4.25, 10.4, 0.64, 1.8, ['#72969a', '#41656f']);
      this.cylinder(3.5, 11.6, 0.64, 1.8, ['#72969a', '#41656f']);
      for (const [x, y] of [[2.65, 10.4], [4.25, 10.4], [3.5, 11.6]]) {
        const a = this.p(x, y + 0.55, 1.13);
        const size = Math.max(3, this.scale * 0.19);
        this.poly([{ x: a.x, y: a.y - size }, { x: a.x + size, y: a.y }, { x: a.x, y: a.y + size }, { x: a.x - size, y: a.y }], '#d6c992');
        c.fillStyle = '#334a50'; c.font = `bold ${Math.max(6, this.scale * 0.23)}px sans-serif`; c.fillText('!', a.x - size * 0.2, a.y + size * 0.4);
      }
      const active = this.state.scenarioId === 'chemical';
      const stopped = this.state.phase === 'complete';
      c.save(); c.globalAlpha = active ? 0.7 : 0.38;
      const points = [];
      for (let i = 0; i < 32; i++) {
        const a = i / 32 * Math.PI * 2;
        const radius = 1 + 0.16 * Math.sin(a * 5) + 0.1 * Math.cos(a * 3 + (active && !stopped ? time * 0.35 : 0));
        points.push(this.p(6.75 + Math.cos(a) * radius * 1.15, 11.0 + Math.sin(a) * radius * 0.74, 0.08));
      }
      this.poly(points, '#57ccaa41', '#81e5c695', 1);
      this.ellipse(6.4, 10.7, 0.09, 0.36, 0.1, '#a4f4d44d');
      c.restore();
      for (const [x, y] of [[7.9, 10.2], [7.9, 12]]) {
        this.box(x, y, 0.24, 0.24, 0.8, ['#ecba68', '#b88946', '#866830']);
        this.box(x - 0.06, y - 0.06, 0.36, 0.36, 0.08, ['#c6a15d', '#846a3f', '#6c5936']);
      }
      this.line([this.p(8.02, 10.3, 0.68), this.p(8.02, 12.1, 0.68)], '#e8c785c9', Math.max(1.5, this.scale * 0.07));
      for (let y = 10.4; y < 12; y += 0.22) this.line([this.p(8.02, y, 0.68), this.p(8.02, y + 0.1, 0.68)], '#384a50', Math.max(1.5, this.scale * 0.07));
    }

    drawLabels(time) {
      const c = this.ctx;
      this.hitAreas = [];
      const compact = this.width < 550;
      const font = compact ? 10 : 11;
      const labelWidth = compact ? 123 : 154;
      const labelHeight = compact ? 31 : 38;
      ZONES.forEach(zone => {
        const anchor = this.p(zone.labelX, zone.labelY, 3.35);
        const target = this.p(zone.x, zone.y, 0.25);
        const selected = zone.id === this.state.scenarioId;
        const color = selected && this.state.phase === 'complete' ? COLORS.mint : zone.color;
        const x = Math.max(8, Math.min(this.width - labelWidth - 8, anchor.x - labelWidth / 2));
        const y = Math.max(20, Math.min(this.height - labelHeight - 12, anchor.y - labelHeight));
        this.line([{ x: x + labelWidth / 2, y: y + labelHeight }, { x: x + labelWidth / 2, y: y + labelHeight + 10 }, target], selected ? `${color}88` : '#536e7a66', 1);
        c.save();
        if (selected) { c.shadowColor = `${color}35`; c.shadowBlur = 14; }
        c.beginPath(); c.roundRect(x, y, labelWidth, labelHeight, 6);
        c.fillStyle = selected ? '#182d36f5' : '#10212cf5'; c.fill();
        c.shadowBlur = 0; c.strokeStyle = selected || this.hovered === zone.id ? `${color}a8` : '#334d5a'; c.lineWidth = 1; c.stroke();
        c.fillStyle = color; c.font = `600 ${font}px ui-monospace, monospace`; c.fillText(zone.no, x + 10, y + (compact ? 20 : 18));
        c.fillStyle = selected ? '#ecf7f8' : '#afc2cc';
        c.font = `600 ${font}px "Pretendard", "Noto Sans KR", system-ui, sans-serif`;
        c.fillText(zone.title, x + 34, y + (compact ? 20 : 17));
        if (!compact) {
          c.fillStyle = '#7295a3'; c.font = '8px ui-monospace, monospace'; c.fillText(zone.en, x + 34, y + 29);
        }
        c.restore();
        c.beginPath(); c.arc(target.x, target.y, selected ? 3 : 2, 0, Math.PI * 2); c.fillStyle = selected ? color : '#688795'; c.fill();
        if (selected && this.state.phase === 'active') {
          c.save(); c.globalAlpha = 0.6 - ((time * 0.4) % 0.6);
          c.beginPath(); c.arc(target.x, target.y, 5 + (time * 7 % 12), 0, Math.PI * 2); c.strokeStyle = color; c.lineWidth = 1; c.stroke(); c.restore();
        }
        this.hitAreas.push({ id: zone.id, x, y, w: labelWidth, h: labelHeight, target });
      });
    }

    draw(time) {
      if (!this.ctx || !this.width || !this.height) return;
      const c = this.ctx, w = this.width, h = this.height;
      c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      c.clearRect(0, 0, w, h);
      const background = c.createRadialGradient(w * 0.51, h * 0.45, 0, w * 0.51, h * 0.45, w * 0.7);
      background.addColorStop(0, '#172b37'); background.addColorStop(0.6, '#101f2b'); background.addColorStop(1, COLORS.bg);
      c.fillStyle = background; c.fillRect(0, 0, w, h);
      // Architectural dot field remains quietly visible beyond the model.
      c.fillStyle = '#3b5b6929';
      for (let x = 14; x < w; x += 24) for (let y = 14; y < h; y += 24) c.fillRect(x, y, 1, 1);
      c.save();
      const floorShadow = this.p(10, 7);
      c.filter = 'blur(18px)';
      c.fillStyle = '#020b1475'; c.beginPath(); c.ellipse(floorShadow.x + 5, floorShadow.y + this.scale * 1.9, this.scale * 14, this.scale * 5.6, 0, 0, Math.PI * 2); c.fill();
      c.restore();
      this.drawFloor(time);
      this.drawWalls();
      this.drawConveyor(time);
      this.drawRack(11.8, 1.0);
      this.person(9.9, 4.3, '#71cbb1', -1);
      this.drawForklift(time);
      this.drawChemicals(time);
      const finished = this.state.phase === 'complete';
      this.person(finished ? 10.0 : 10.15, finished ? 12.2 : 10.6, '#77d7c0');
      this.person(15.7, 8.1, '#d6a65d');
      const trainee = this.p(10.0, finished ? 12.2 : 10.6, 0.03);
      c.beginPath(); c.ellipse(trainee.x, trainee.y, this.scale * 0.5, this.scale * 0.24, 0, 0, Math.PI * 2); c.strokeStyle = '#7ce5c080'; c.lineWidth = 1; c.stroke();
      this.drawLabels(time);
      c.fillStyle = '#5f7c8b'; c.font = '9px ui-monospace, monospace';
      if (w > 600) c.fillText('ISOMETRIC VIEW   /   SIMULATION', 20, h - 19);
      // Corner markers frame the digital twin without taking canvas focus.
      const corners = [[12, 12, 1, 1], [w - 12, 12, -1, 1], [12, h - 12, 1, -1], [w - 12, h - 12, -1, -1]];
      corners.forEach(([x, y, dx, dy]) => this.line([{ x, y: y + dy * 10 }, { x, y }, { x: x + dx * 10, y }], '#46647264', 1));
    }

    hit(event) {
      const bounds = this.canvas.getBoundingClientRect();
      const x = (event.clientX - bounds.left) * this.width / bounds.width;
      const y = (event.clientY - bounds.top) * this.height / bounds.height;
      return this.hitAreas.find(area => (x >= area.x && x <= area.x + area.w && y >= area.y && y <= area.y + area.h) || Math.hypot(x - area.target.x, y - area.target.y) < Math.max(20, this.scale * 1.5));
    }

    move(event) {
      const area = this.hit(event);
      this.hovered = area ? area.id : '';
      this.dirty = true;
      this.canvas.style.cursor = area ? 'pointer' : 'default';
    }

    click(event) {
      const area = this.hit(event);
      if (area) this.onSelect(area.id);
    }
  }

  window.FactoryScene = FactoryScene;
})();
