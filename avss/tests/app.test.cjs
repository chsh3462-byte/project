const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');
const html = fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const safe = {conveyor:['stop','report','warn','wait'],forklift:['stop','check','wait','lane'],chemical:['identify','evacuate','report','warn']};
function setup(saved) {
 const errors=[];let downloaded;
 const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://example.test/avss/',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){
  if(saved)w.localStorage.setItem('avss.sessions.v1',saved);
  w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
  w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
  w.requestAnimationFrame=()=>1;w.cancelAnimationFrame=()=>{};w.matchMedia=()=>({matches:false});
  const gradient={addColorStop(){}};
  const context=new Proxy({measureText:t=>({width:String(t).length*6}),createLinearGradient:()=>gradient,createRadialGradient:()=>gradient},{get:(o,k)=>k in o?o[k]:()=>{}});
  w.HTMLCanvasElement.prototype.getContext=()=>context;
  w.HTMLCanvasElement.prototype.getBoundingClientRect=()=>({width:900,height:550,left:0,top:0});
  w.URL.createObjectURL=blob=>{downloaded=blob;return'blob:test';};w.URL.revokeObjectURL=()=>{};
  w.HTMLAnchorElement.prototype.click=function(){};
 }});
 const d=dom.window.document;
 const click=selector=>{const el=d.querySelector(selector);assert.ok(el,'missing '+selector);assert.equal(el.disabled,false,'disabled '+selector);el.click();};
 return{dom,w:dom.window,d,click,errors,getDownloaded:()=>downloaded};
}
test('standalone HTML completes all 3 scenarios at every level, persists, exports and reloads',()=>{
 const a=setup();try{
  assert.deepEqual(a.errors,[]);
  assert.equal(a.d.querySelectorAll('[data-scenario]').length,3);
  for(const id of Object.keys(safe))for(const level of [1,2,3]){
   a.click(`[data-scenario="${id}"]`);a.click(`[data-level="${level}"]`);a.click('#startTraining');
   assert.equal(a.d.querySelectorAll('[data-action]').length,level+1);
   for(const action of safe[id]){
    const options=a.w.AVSS_APP.getState().options,position=options.findIndex(o=>o.id===action)+1;
    assert.ok(position>=1&&position<=4);
    a.d.dispatchEvent(new a.w.KeyboardEvent('keydown',{key:String(position),bubbles:true}));
   }
   assert.equal(a.w.AVSS_APP.getState().phase,'complete');
   assert.equal(a.w.AVSS_APP.getState().score,100);
  }
  assert.equal(a.w.AVSS_APP.getHistory().length,9);
  a.click('[data-view="reports"]');
  assert.equal(a.d.querySelectorAll('#historyBody tr').length,9);
  a.d.getElementById('reportFilter').value='chemical';a.d.getElementById('reportFilter').dispatchEvent(new a.w.Event('change'));
  assert.equal(a.d.querySelectorAll('#historyBody tr').length,3);
  a.click('#exportCsv');assert.ok(a.getDownloaded().size>100);
  a.click('[data-record]');assert.equal(a.d.getElementById('infoDialog').open,true);a.click('#dialogClose');
  const saved=a.w.localStorage.getItem('avss.sessions.v1'),b=setup(saved);try{assert.equal(b.w.AVSS_APP.getHistory().length,9);}finally{b.w.close();}
  assert.deepEqual(a.errors,[]);
 }finally{a.w.close();}
});
test('wrong answers, hints, restart confirmation, recommended retry, reports deletion',()=>{
 const a=setup();try{
  a.click('[data-level="3"]');a.click('#startTraining');
  const wrong=a.w.AVSS_APP.getState().options.find(o=>o.id!=='stop');a.click(`[data-action="${wrong.id}"]`);
  assert.equal(a.w.AVSS_APP.getState().mistakes,1);assert.equal(a.w.AVSS_APP.getState().stage,0);
  a.click('#requestHint');assert.equal(a.w.AVSS_APP.getState().hints,1);assert.ok(a.d.getElementById('requestHint').disabled);
  a.click('[data-scenario="chemical"]');assert.ok(a.d.getElementById('infoDialog').open);a.click('#cancelDialog');assert.equal(a.w.AVSS_APP.getState().scenarioId,'conveyor');
  for(const id of safe.conveyor)a.click(`[data-action="${id}"]`);
  assert.equal(a.w.AVSS_APP.getState().score,84);assert.equal(a.w.AVSS_APP.getHistory().length,1);
  const previous=a.w.AVSS_APP.getState().variant.id;a.click('#retryRecommended');assert.equal(a.w.AVSS_APP.getState().phase,'active');assert.notEqual(a.w.AVSS_APP.getState().variant.id,previous);
  a.click('#restartTraining');a.click('#confirmDialog');assert.equal(a.w.AVSS_APP.getState().phase,'idle');
  a.click('[data-view="reports"]');a.click('#clearHistory');a.click('#confirmDialog');assert.equal(a.w.AVSS_APP.getHistory().length,0);assert.ok(a.d.getElementById('exportCsv').disabled);
  assert.deepEqual(a.errors,[]);
 }finally{a.w.close();}
});
test('all bilingual slides, 8-minute split, keyboard navigation, notes and timer controls',()=>{
 const a=setup();try{
  a.click('[data-view="presentation"]');
  assert.equal(a.w.AVSS_SLIDES.length,14);assert.equal(a.w.AVSS_SLIDES.reduce((n,s)=>n+s.seconds,0),480);assert.equal(a.w.AVSS_SLIDES.slice(0,7).reduce((n,s)=>n+s.seconds,0),240);
  for(let i=0;i<14;i++){a.click(`[data-slide="${i}"]`);assert.ok(a.d.getElementById('slideContent').textContent.includes(a.w.AVSS_SLIDES[i].title));}
  assert.ok(a.d.getElementById('nextSlide').disabled);
  a.d.dispatchEvent(new a.w.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));assert.ok(a.d.getElementById('slideContent').textContent.includes(a.w.AVSS_SLIDES[12].title));
  a.click('#notesToggle');assert.equal(a.d.getElementById('speakerNotes').hidden,false);assert.ok(a.d.getElementById('speakerNotes').textContent.includes('Thank you'));
  a.click('#timerToggle');assert.equal(a.d.getElementById('timerToggle').textContent,'일시 정지');a.click('#timerToggle');a.click('#timerReset');assert.equal(a.d.getElementById('presentationTimer').textContent,'00:00 / 08:00');
  a.d.dispatchEvent(new a.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(a.d.getElementById('trainingView').hidden,false);
  assert.deepEqual(a.errors,[]);
 }finally{a.w.close();}
});
test('corrupt storage recovers, no remote runtime resources, unique IDs',()=>{
 const a=setup('{broken json');try{
  assert.equal(a.w.AVSS_APP.getHistory().length,0);assert.deepEqual(a.errors,[]);
  assert.equal(a.d.querySelectorAll('script[src],link[rel="stylesheet"],img[src],iframe').length,0);
  const ids=[...a.d.querySelectorAll('[id]')].map(e=>e.id);assert.equal(new Set(ids).size,ids.length);
 }finally{a.w.close();}
});
