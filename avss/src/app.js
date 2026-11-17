(function () {
 'use strict';
 const $ = id => document.getElementById(id);
 const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const levels = ['기초', '표준', '심화'];
 const time = ms => { const s = Math.floor(Math.max(0, ms) / 1000); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
 const key = 'avss.sessions.v1';
 let storageAvailable = true;
 let history = [];
 try { const parsed = JSON.parse(localStorage.getItem(key) || '[]'); history = Array.isArray(parsed) ? parsed.filter(r => r && AVSS_SCENARIOS.some(s => s.id === r.scenarioId) && Number.isFinite(r.score) && r.score >= 0 && r.score <= 100 && [1,2,3].includes(r.level) && Number.isFinite(r.durationMs) && r.durationMs >= 0 && Number.isFinite(r.mistakes) && Number.isFinite(r.hints) && [1,2,3].includes(r.recommendedLevel) && !Number.isNaN(Date.parse(r.completedAt)) && Number.isFinite(r.avgResponseMs) && Number.isFinite(r.accuracy) && typeof r.id === 'string' && typeof r.title === 'string' && Array.isArray(r.logs) && r.logs.every(l => l && Number.isFinite(l.elapsedMs) && typeof l.action === 'string' && typeof l.message === 'string')).slice(-200) : []; } catch (_) { storageAvailable = false; }
 let currentView = 'training', engine, scene, sceneUnavailable = false, savedRound = false, toastTimeout;
 let slideIndex = 0, notesVisible = false, presentationElapsed = 0, presentationStarted = null;
 function toast(text) { $('toast').textContent = text; $('toast').classList.add('visible'); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => $('toast').classList.remove('visible'), 3400); }
 function persist() { try { localStorage.setItem(key, JSON.stringify(history)); storageAvailable = true; } catch (_) { storageAvailable = false; toast('브라우저 저장이 제한되어 현재 세션에만 기록합니다. CSV로 보관하세요.'); } }
 function showView(view) {
  if (!['training','reports','presentation'].includes(view)) return;
  currentView = view;
  for (const name of ['training','reports','presentation']) $(name + 'View').hidden = name !== view;
  document.querySelectorAll('.main-nav [data-view]').forEach(b => { b.classList.toggle('active', b.dataset.view === view); b.setAttribute('aria-current', b.dataset.view === view ? 'page' : 'false'); });
  $('viewName').textContent = {training:'Safety simulation',reports:'Performance review',presentation:'Presentation'}[view];
  if (view === 'reports') renderReports();
  if (view === 'presentation') renderSlide();
  if (view === 'training' && scene) scene.resize();
 }
 function showDialog(title, html) { $('dialogTitle').textContent = title; $('dialogContent').innerHTML = html; if (!$('infoDialog').open) $('infoDialog').showModal(); }
 function confirmAction(title, text, onConfirm) {
  showDialog(title, `<p>${escape(text)}</p><div class="dialog-actions"><button class="button secondary" id="cancelDialog">취소</button><button class="button primary" id="confirmDialog">계속</button></div>`);
  $('cancelDialog').onclick = () => $('infoDialog').close();
  $('confirmDialog').onclick = () => { $('infoDialog').close(); onConfirm(); };
 }
 function resetScenario(id, level, ask = true) {
  const state = engine.getState();
  const run = () => { savedRound = false; engine.reset({scenarioId:id,level}); };
  if (ask && state.phase === 'active') confirmAction('진행 중인 훈련을 종료할까요?', '완료하지 않은 훈련은 리포트에 저장되지 않습니다. 새 훈련을 준비합니다.', run); else run();
 }
 function renderTraining(s) {
  const oldFocus = document.activeElement;
  const focusScenario = oldFocus?.dataset?.scenario;
  const focusLevel = oldFocus?.dataset?.level;
  const focusTask = oldFocus?.dataset?.action || ['startTraining','requestHint','retryRecommended','taskTitle'].includes(oldFocus?.id);
  if (scene) scene.update(s);
  $('scenarioCards').innerHTML = AVSS_SCENARIOS.map((sc,i) => `<button class="scenario-card ${sc.id===s.scenarioId?'selected':''}" data-scenario="${sc.id}" aria-pressed="${sc.id===s.scenarioId}"><span class="scenario-number">0${i+1}</span><span class="scenario-title">${escape(sc.title)}<span class="scenario-en">${escape(sc.en)}</span></span><span class="scenario-arrow">↗</span></button>`).join('');
  $('sceneStatus').textContent = {idle:'STANDBY',active:'SESSION ACTIVE',complete:'COMPLETE'}[s.phase];
  $('sceneCaption').textContent = sceneUnavailable ? '공장 시각화 미지원 · 훈련 컨트롤로 진행할 수 있습니다.' : s.phase === 'active' ? `${s.variant.id} · ${s.steps[Math.min(s.stage,3)].label}` : s.phase === 'complete' ? '훈련 완료 · 기록을 검토하고 다시 연습하세요.' : '구역을 선택하고 훈련을 시작하세요.';
  $('trainingClock').textContent = time(s.elapsedMs);
  $('variantText').textContent = `${s.variant.id} · ${s.variant.title}`;
  $('npcText').textContent = s.feedback?.text ? s.feedback.text : '선택에 따라 동료와 설비 상태가 반응';
  $('adaptiveText').textContent = s.result ? s.result.recommendation : `실수 ${s.mistakes}회 · 힌트 ${s.hints}회 · 완료 후 다음 난이도 추천`;
  $('levelIndicator').textContent = `LEVEL ${s.level}`;
  const steps = `<ol class="checklist">${s.steps.map((st,i)=>`<li class="${s.completedSteps.includes(i)?'done':s.phase==='active'&&i===s.stage?'current':''}"><i>${s.completedSteps.includes(i)?'✓':i+1}</i>${escape(st.label)}</li>`).join('')}</ol>`;
  if (s.phase === 'idle') {
   $('actionContent').innerHTML = `<div class="task-eyebrow">${escape(s.variant.id)} / READY TO TRAIN</div><h2 id="taskTitle" class="task-title">${escape(s.title)}</h2><p class="task-description">${escape(s.variant.cue)}</p><div class="difficulty-label"><span>훈련 난이도</span><span>LEVEL ${s.level}</span></div><div class="difficulty-group" role="group" aria-label="난이도 선택">${levels.map((n,i)=>`<button data-level="${i+1}" class="${s.level===i+1?'selected':''}" aria-pressed="${s.level===i+1}">${n}</button>`).join('')}</div><p class="task-footnote">${['기초: 단계별 가이드와 명확한 위험 신호','표준: 가이드 축소 · 스스로 대응 순서 판단','심화: 추가 상황 압박 · 요청 시 힌트 제공'][s.level-1]}</p>${steps}<button id="startTraining" class="button primary full">훈련 시작하기 <span>→</span></button><p class="task-footnote">약 1분 · 마우스 또는 키보드 1–4으로 선택<br>실제 AI·VR 연결 전의 발표용 시뮬레이션입니다.</p>`;
  } else if (s.phase === 'active') {
   const progress = `<div class="step-progress" aria-label="${s.stage+1} / ${s.steps.length} 단계">${s.steps.map((_,i)=>`<i class="${i<s.stage?'done':i===s.stage?'current':''}"></i>`).join('')}</div>`;
   const feedback = s.feedback?.text ? `<div class="feedback ${s.feedback.type}" role="status">${escape(s.feedback.text)}</div>` : '';
   const hint = s.hintText ? `<div class="feedback">힌트 · ${escape(s.hintText)}</div>` : s.level===1 ? `<p class="task-footnote">가이드 · ${escape(s.objective)}</p>` : '';
   $('actionContent').innerHTML = `${progress}<div class="task-eyebrow">STEP ${String(s.stage+1).padStart(2,'0')} / 04 · LEVEL ${s.level}</div><h2 id="taskTitle" class="task-title">${escape(s.steps[s.stage].label)}</h2><p class="task-description">${escape(s.prompt)}</p>${feedback}<div class="action-options">${s.options.map((o,i)=>`<button class="choice-btn" data-action="${o.id}"><span class="choice-key">${i+1}</span><span>${escape(o.label)}<small>${escape(o.en)}</small></span></button>`).join('')}</div>${hint}<div class="action-bottom"><button id="requestHint" class="subtle-btn" ${s.hintUsed?'disabled':''}>${s.hintUsed?'힌트 확인 완료':'◇ 힌트 보기 (−4점)'}</button><span class="task-footnote">실수 ${s.mistakes} · ${s.score}점</span></div><div class="action-bottom"><button id="restartTraining" class="subtle-btn">↺ 처음부터</button><span class="task-footnote">선택 후 다음 단계로 진행</span></div>`;
  } else {
   const r=s.result;
   if (!savedRound) { savedRound=true; history.push({...r,id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,logs:s.logs}); history=history.slice(-200); persist(); }
   $('actionContent').innerHTML = `<div class="task-eyebrow">SESSION COMPLETE</div><h2 id="taskTitle" class="task-title">안전한 선택을 기록했어요.</h2><div class="result-circle"><strong>${r.score}</strong><span>DEMO SCORE</span></div><div class="result-metrics"><div><b>${time(r.durationMs)}</b><span>소요 시간</span></div><div><b>${r.mistakes}</b><span>실수 횟수</span></div><div><b>${(r.avgResponseMs/1000).toFixed(1)}s</b><span>평균 반응</span></div></div><div class="feedback"><strong>다음 훈련 · ${levels[r.recommendedLevel-1]} LEVEL ${r.recommendedLevel}</strong><br>${escape(r.recommendation)}</div><button id="retryRecommended" class="button primary full">추천 난이도로 다시 연습 →</button><div class="action-bottom"><button class="subtle-btn" data-view="reports">상세 리포트 보기 ↗</button><button id="nextScenario" class="subtle-btn">다른 시나리오 →</button></div><p class="task-footnote">점수 = 100 − 실수×12 − 힌트×4 (최소 0)<br>현장 안전 역량을 인증하는 점수가 아닙니다.</p>`;
  }
  $('sessionNumber').textContent=String(history.length+(s.phase==='complete'?0:1)).padStart(2,'0');
  if (focusScenario) document.querySelector(`[data-scenario="${focusScenario}"]`)?.focus({preventScroll:true});
  else if (focusLevel) document.querySelector(`[data-level="${focusLevel}"]`)?.focus({preventScroll:true});
  else if (focusTask) { $('taskTitle').setAttribute('tabindex','-1'); $('taskTitle').focus({preventScroll:true}); }
  $('logCount').textContent=`${s.logs.length} EVENTS`;
  $('activityLog').innerHTML=s.logs.length?s.logs.slice().reverse().map(l=>`<div class="log-item ${l.correct===false?'wrong':''}"><time>${time(l.elapsedMs)}</time><i></i><span>${escape(l.actionLabel || l.action)}<small>${escape(l.message)}</small></span></div>`).join(''):'<div class="empty-log"><span>↳</span> 훈련을 시작하면 선택과 반응시간이 기록됩니다.</div>';
 }
 function filteredHistory() { return history.filter(r=>$('reportFilter').value==='all'||r.scenarioId===$('reportFilter').value); }
 function renderReports() {
  const data=filteredHistory(); const avg=field=>data.length?data.reduce((s,r)=>s+r[field],0)/data.length:0;
  $('reportStats').innerHTML=[['완료한 훈련',data.length,'SESSIONS'],['평균 데모 점수',data.length?avg('score').toFixed(0):'—','/ 100'],['평균 소요 시간',data.length?time(avg('durationMs')):'—','MIN : SEC'],['누적 실수',data.reduce((s,r)=>s+r.mistakes,0),'REVIEW & IMPROVE']].map(([label,value,unit])=>`<div class="stat"><span>${label}</span><strong>${value}</strong><small>${unit}</small></div>`).join('');
  $('historyEmpty').hidden=data.length>0;
  $('historyBody').innerHTML=data.slice().reverse().map(r=>`<tr><td>${escape(new Date(r.completedAt).toLocaleString('ko-KR',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}))}</td><td>${escape(AVSS_SCENARIOS.find(s=>s.id===r.scenarioId).title)}</td><td>${levels[r.level-1]}</td><td><span class="score">${r.score}</span></td><td class="mono">${time(r.durationMs)}</td><td>${r.mistakes} / ${r.hints}</td><td>${levels[r.recommendedLevel-1]}</td><td><button class="subtle-btn" data-record="${escape(r.id)}">로그 ↗</button></td></tr>`).join('');
  $('exportCsv').disabled=!data.length; $('clearHistory').disabled=!history.length;
  $('storageNote').textContent=storageAvailable?'기록은 현재 브라우저에만 저장됩니다. 최대 200회 · 다른 기기와 동기화되지 않습니다.':'브라우저 저장이 제한되어 현재 세션에만 유지됩니다. CSV로 내려받아 보관하세요.';
 }
 function downloadCsv() {
  const data=filteredHistory(); if(!data.length) return;
  const cell=value=>`"${String(value??'').replace(/^[=+\-@]/,'\t$&').replace(/"/g,'""')}"`;
  const rows=[['완료시각(UTC)','시나리오','조건','난이도','점수','총시간(초)','평균반응(초)','실수','힌트','정확도(%)','다음난이도','행동로그(JSON)'],...data.map(r=>[r.completedAt,r.title,r.variant,r.level,r.score,(r.durationMs/1000).toFixed(2),(r.avgResponseMs/1000).toFixed(2),r.mistakes,r.hints,r.accuracy,r.recommendedLevel,JSON.stringify(r.logs)])];
  const blob=new Blob(['\uFEFF'+rows.map(row=>row.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='AVSS-training-records.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('훈련 기록 CSV를 내려받았습니다.');
 }
 function showRecord(id) { const r=history.find(x=>x.id===id);if(!r)return;showDialog(`${r.title} · ${r.score}점`,`<p>난이도 ${levels[r.level-1]} · 소요 ${time(r.durationMs)} · 실수 ${r.mistakes}회 · 힌트 ${r.hints}회</p><p>${escape(r.recommendation)}</p><h3>선택 및 반응 기록</h3>${r.logs.map(l=>`<div class="log-item ${l.correct===false?'wrong':''}"><time>${time(l.elapsedMs)}</time><i></i><span>${escape(l.actionLabel || l.action)}<small>${escape(l.message)}</small></span></div>`).join('')}`); }
 function renderSlide() {
  const s=AVSS_SLIDES[slideIndex], before=AVSS_SLIDES.slice(0,slideIndex).reduce((n,s)=>n+s.seconds,0);
  $('slideContent').innerHTML=`<div class="slide-top"><span>${escape(s.kicker)}</span><span class="slide-number">${String(s.number).padStart(2,'0')} / 14</span></div><h2>${escape(s.title)}</h2><p class="slide-en-title">${escape(s.enTitle)}</p><p class="slide-summary">${escape(s.summary)}<br>${escape(s.enSummary)}</p><div class="slide-cards">${s.points.map((p,i)=>`<div class="slide-card"><b>0${i+1}</b><h3>${escape(p.title)}</h3><small>${escape(p.enTitle)}</small><p>${escape(p.text)}</p><p class="english">${escape(p.en)}</p></div>`).join('')}</div><div class="slide-footer"><span>${escape(s.speaker)}</span><span>${s.seconds?`권장 ${time(before*1000)}–${time((before+s.seconds)*1000)} · ${s.seconds}초`:'REFERENCE · 발표 시간 제외'}</span></div>`;
  $('slideDots').innerHTML=AVSS_SLIDES.map((_,i)=>`<button class="slide-dot ${i===slideIndex?'active':''}" data-slide="${i}" aria-label="${i+1}번 슬라이드" aria-pressed="${i===slideIndex}">${i+1}</button>`).join('');
  $('prevSlide').disabled=slideIndex===0;$('nextSlide').disabled=slideIndex===13;
  $('speakerNotes').innerHTML=`<div><h3>ENGLISH · 원문 확장 대본</h3><p>${escape(s.notesEn)}</p></div><div><h3>한국어 · 발표 내용</h3><p>${escape(s.notesKo)}</p></div>`;
  $('speakerNotes').hidden=!notesVisible;$('notesToggle').textContent=notesVisible?'발표 원고 접기 ↑':'발표 원고 보기 ↓';
 }
 function moveSlide(delta) { slideIndex=Math.max(0,Math.min(13,slideIndex+delta));renderSlide(); }
 async function toggleFullscreen() { try { if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else toast('이 브라우저는 전체 화면 API를 지원하지 않습니다.'); }catch(_){toast('전체 화면을 사용할 수 없습니다. 브라우저 전체 화면 기능을 이용하세요.');} }
 document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.view) {showView(b.dataset.view);return;}
  if(b.dataset.scenario) {resetScenario(b.dataset.scenario,engine.getState().level);return;}
  if(b.dataset.level) {resetScenario(engine.getState().scenarioId,Number(b.dataset.level),false);return;}
  if(b.dataset.action) {engine.choose(b.dataset.action);return;}
  if(b.dataset.slide!==undefined) {slideIndex=Number(b.dataset.slide);renderSlide();return;}
  if(b.dataset.record) {showRecord(b.dataset.record);return;}
  const s=engine.getState();
  switch(b.id){
   case 'startTraining':savedRound=false;engine.start();break;
   case 'requestHint':engine.hint();break;
   case 'restartTraining':resetScenario(s.scenarioId,s.level);break;
   case 'retryRecommended':savedRound=false;engine.reset({scenarioId:s.scenarioId,level:s.result.recommendedLevel});engine.start();break;
   case 'nextScenario':resetScenario(AVSS_SCENARIOS[(AVSS_SCENARIOS.findIndex(sc=>sc.id===s.scenarioId)+1)%3].id,s.result?.recommendedLevel||1);break;
   case 'fullscreenBtn':toggleFullscreen();break;
   case 'exportCsv':downloadCsv();break;
   case 'clearHistory':confirmAction('이 브라우저의 훈련 기록 삭제','저장된 훈련 기록이 모두 삭제됩니다. 필요한 기록은 먼저 CSV로 내보내세요.',()=>{history=[];persist();renderReports();toast('이 브라우저의 훈련 기록을 삭제했습니다.');});break;
   case 'dialogClose':$('infoDialog').close();break;
   case 'prevSlide':moveSlide(-1);break;
   case 'nextSlide':moveSlide(1);break;
   case 'notesToggle':notesVisible=!notesVisible;renderSlide();break;
   case 'timerToggle':if(presentationStarted===null){presentationStarted=Date.now();b.textContent='일시 정지';}else{presentationElapsed+=Date.now()-presentationStarted;presentationStarted=null;b.textContent='타이머 계속';}break;
   case 'timerReset':presentationElapsed=0;presentationStarted=null;$('timerToggle').textContent='타이머 시작';updateClocks();break;
   case 'guideBtn':showGuide();break;
  }
 });
 $('reportFilter').addEventListener('change',renderReports);
 document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();showView('training');});
 document.addEventListener('keydown',e=>{
  if($('infoDialog').open||e.altKey||e.ctrlKey||e.metaKey||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
  if(e.key.toLowerCase()==='f'){e.preventDefault();toggleFullscreen();}
  if(currentView==='presentation') {if(e.key==='ArrowRight'){e.preventDefault();moveSlide(1);}if(e.key==='ArrowLeft'){e.preventDefault();moveSlide(-1);}if(e.key==='Escape')showView('training');}
  else if(currentView==='training'&&/^[1234]$/.test(e.key)&&!e.repeat) {const s=engine.getState();if(s.phase==='active'){e.preventDefault();const o=s.options[Number(e.key)-1];if(o)engine.choose(o.id);}}
 });
 function showGuide() {showDialog('AVSS 시연 가이드',`<h3>1분 시연 순서</h3><ol><li>시나리오를 선택하고 <b>훈련 시작하기</b>를 누르세요.</li><li>선택지 클릭 또는 숫자 <b>1·2·3·4</b>으로 행동을 고릅니다.</li><li>오답을 한 번 선택해 동료 반응과 실수 기록을 보여주세요.</li><li>4단계를 완료한 뒤 추천 난이도로 재훈련합니다.</li><li><b>수행 리포트</b>에서 기록을 확인하고 CSV를 내려받습니다.</li></ol><h3>8분 공동 발표</h3><p>발표 모드에 한영 14장, 원문 확장 대본, 타이머가 있습니다. ← →로 이동하고, F로 전체 화면을 켭니다. 1–7장은 김동영 4분, 8–13장은 조상우 4분, 14장은 참고 자료입니다. 타이머는 수동 진행을 돕고 자동으로 장을 넘기지 않습니다.</p><h3>작동하는 부분과 제안 단계</h3><p>선택에 따른 상황 진행, NPC 피드백, 난이도 추천, 점수와 기록은 실제로 작동합니다. 상황 변형은 준비된 맥락을 순환하고, 적응은 실수·힌트·반응시간 규칙으로 계산합니다. AI 모델, VR/AR 헤드셋, 실제 공장 센서는 연결하지 않은 브라우저 프로토타입입니다.</p><p>예시 대응 절차는 현장 인증 SOP가 아닙니다. 실제 사업장에서는 승인된 절차와 안전관리자 지침을 따르세요. 외부 전송 없이 현재 브라우저에 최대 200회 기록을 저장합니다.</p>`);}
 function updateClocks() {if(engine&&currentView==='training')$('trainingClock').textContent=time(engine.getState().elapsedMs);const elapsed=presentationElapsed+(presentationStarted===null?0:Date.now()-presentationStarted);$('presentationTimer').textContent=`${time(elapsed)} / 08:00`;$('presentationProgress').style.width=`${Math.min(100,elapsed/480000*100)}%`;$('presentationTimer').style.color=elapsed>480000?'var(--amber)':'var(--mint)';}
 engine=new AVSSEngine({scenarioId:'conveyor',level:1,onChange:renderTraining});
 try{scene=new FactoryScene($('factoryCanvas'),{onSelect:id=>resetScenario(id,engine.getState().level)});}catch(error){sceneUnavailable=true;$('sceneCaption').textContent='공장 시각화를 사용할 수 없습니다. 오른쪽 컨트롤에서 훈련할 수 있습니다.';}
 renderTraining(engine.getState());showView('training');setInterval(updateClocks,250);
 window.AVSS_APP={getState:()=>engine.getState(),getHistory:()=>JSON.parse(JSON.stringify(history)),showView};
})();
