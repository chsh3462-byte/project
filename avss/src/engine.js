(function (root) {
  'use strict';
  const option = (id, label, en, correct, text, feedbackEn) => ({ id, label, en, correct, text, feedbackEn });
  const step = (label, en, prompt, promptEn, hint, hintEn, options, behavior) => ({ label, en, prompt, promptEn, hint, hintEn, options, behavior });
  const scenarios = [
    {
      id: 'conveyor', title: '컨베이어 가드 개방', en: 'Conveyor guard opening', subtitle: '멈춤 · 보고 · 동료 경고', tag: 'CASE 01',
      description: '가드 경보를 인지하고 접근을 멈춘 뒤, 관리자에게 보고하고 주변 동료를 보호하세요.',
      descriptionEn: 'Recognize the guard alarm, stop approaching, report the hazard, and warn coworkers.',
      variants: [
        { id: 'C-01', title: 'A라인 가드 경보', en: 'Line A guard alarm', cue: 'A라인 컨베이어 가드가 열리고 경보등이 켜졌습니다. 동료가 설비 쪽으로 걸어옵니다.', cueEn: 'The Line A guard is open and an alarm is active. A coworker approaches the machine.', machine: 'A-01', location: 'A라인', npc: '민수', weather: 'normal' },
        { id: 'C-02', title: 'B라인 설비 정지', en: 'Line B machine stop', cue: 'B라인 컨베이어가 정지했습니다. 열린 가드 옆으로 동료가 작업을 재개하려 합니다.', cueEn: 'The Line B conveyor has stopped. A coworker is about to resume work beside the open guard.', machine: 'B-02', location: 'B라인', npc: '지우', weather: 'dim' },
        { id: 'C-03', title: 'C라인 경보 재발생', en: 'Line C repeat alarm', cue: 'C라인의 경보가 다시 울립니다. 동료는 물량이 밀린다며 가까이서 확인하자고 말합니다.', cueEn: 'The Line C alarm sounds again. A coworker suggests moving closer to prevent a backlog.', machine: 'C-03', location: 'C라인', npc: '현우', weather: 'busy' }
      ],
      steps: [
        step('접근 중지', 'Stop approaching', '가드 경보가 울립니다. 가장 먼저 무엇을 할까요?', 'The guard alarm is active. What should you do first?', '경보가 울리는 설비에는 접근하지 않습니다. 안전한 위치에서 멈추세요.', 'Stop at a safe position. Do not approach machinery with an active guard alarm.', [
          option('stop', '접근을 멈추고 안전거리 유지', 'Stop and keep a safe distance', true, '접근을 멈췄습니다. 동료: “경보를 확인했어요. 관리자에게 알려주세요.”', 'You stopped safely. Coworker: “I see the alarm. Please notify the supervisor.”'),
          option('inspect', '가드 안으로 들어가 직접 확인', 'Enter the guard to inspect', false, '위험 구역 진입은 추가 사고를 부를 수 있습니다. 안전거리에서 접근을 멈추세요.', 'Entering the guarded area may expose you to injury. Stop at a safe distance.'),
          option('restart', '생산을 위해 설비 재시작', 'Restart production', false, '경보 원인이 확인되지 않았습니다. 훈련생은 설비를 임의 재가동하지 않습니다.', 'The alarm cause is unknown. A trainee must not restart the machine without authorization.')
        ], 'spot'),
        step('관리자 보고', 'Report the hazard', '안전한 위치에 있습니다. 다음 대응을 선택하세요.', 'You are in a safe position. Choose the next response.', '안전한 위치에서 설비 위치와 가드 경보 상태를 관리자에게 전달하세요.', 'From a safe position, tell the supervisor the machine location and guard alarm status.', [
          option('report', '설비 위치·경보 상태를 관리자에게 보고', 'Report the machine location and alarm', true, '관리자: “보고를 받았습니다. 설비 접근을 제한하고 승인된 대응을 진행하겠습니다.”', 'Supervisor: “Report received. We will restrict access and follow the site procedure.”'),
          option('silence', '시끄러운 경보부터 끄기', 'Silence the alarm first', false, '경보를 임의 해제하면 주변 작업자가 위험을 놓칠 수 있습니다. 상태를 보고하세요.', 'Silencing an alarm can hide the hazard from others. Report the condition.'),
          option('leave', '다른 작업으로 이동', 'Move on to another task', false, '위험 정보가 관리자에게 전달되지 않았습니다. 안전한 위치에서 보고하세요.', 'The supervisor has not received the hazard information. Report from safety.')
        ], 'report'),
        step('동료 경고', 'Warn coworkers', '동료가 컨베이어 쪽으로 다가옵니다. 어떻게 말할까요?', 'A coworker approaches the conveyor. What should you say?', '가드 경보와 접근 제한을 구체적으로 알리고 안전거리로 안내하세요.', 'State the guard alarm clearly and ask the coworker to stay outside the restricted area.', [
          option('warn', '가드 경보를 알리고 안전거리로 안내', 'Warn about the guard alarm and guide them away', true, '동료: “가드 경보 확인했습니다. 안전거리에서 대기할게요.”', 'Coworker: “Guard alarm understood. I will wait at a safe distance.”'),
          option('hurry', '빨리 지나가라고 말하기', 'Tell them to pass quickly', false, '빨리 지나가는 것은 안전 조치가 아닙니다. 경보와 접근 제한을 알리세요.', 'Passing quickly does not remove the hazard. Explain the alarm and access restriction.'),
          option('ignore', '보고했으니 신경 쓰지 않기', 'Ignore them because you already reported', false, '동료가 위험을 인지하지 못했습니다. 현재 상태와 접근 제한을 전달하세요.', 'The coworker is unaware of the hazard. Communicate the current condition.')
        ], 'communicate'),
        step('승인 대기', 'Wait for clearance', '동료가 “이제 다시 가동해도 될까요?”라고 묻습니다.', 'A coworker asks, “Can we restart now?”', '위험 해소 확인과 권한 있는 담당자의 승인 전까지 접근 제한을 유지합니다.', 'Keep access restricted until authorized personnel confirm the hazard is resolved.', [
          option('wait', '접근 제한을 유지하고 담당자 승인 대기', 'Maintain restrictions and wait for authorized clearance', true, '관리자: “안전 확인은 담당자가 진행합니다. 승인 전까지 현재 위치에서 대기하세요.”', 'Supervisor: “Authorized personnel will verify safety. Wait for clearance.”'),
          option('test', '시험 삼아 잠깐 가동', 'Run a quick test', false, '훈련생이 임의로 시험 가동할 수 없습니다. 담당자의 확인과 승인을 기다리세요.', 'A trainee cannot authorize a test run. Wait for verification and clearance.'),
          option('assume', '경보가 줄었으니 작업 재개', 'Resume because the alarm seems quieter', false, '경보 소리의 변화는 안전 확인이 아닙니다. 공식적인 해제 승인을 기다리세요.', 'A change in alarm volume is not safety clearance. Wait for authorization.')
        ], 'report')
      ]
    },
    {
      id: 'forklift', title: '지게차 사각지대', en: 'Forklift blind corner', subtitle: '정지 · 신호 확인 · 보행로', tag: 'CASE 02',
      description: '노란 안전선에 멈추고 경적과 차량 움직임을 확인한 뒤 지정 보행로를 이용하세요.',
      descriptionEn: 'Stop at the yellow safety line, check vehicle cues, and use the designated pedestrian lane.',
      variants: [
        { id: 'F-01', title: '적재 구역 교차로', en: 'Loading-zone intersection', cue: '적재물 뒤에서 지게차 경적이 들립니다. 노란 안전선 앞으로 차량이 접근합니다.', cueEn: 'A forklift horn sounds behind a stack of goods. A vehicle is approaching the yellow safety line.', machine: 'FLT-01', location: '적재 구역', npc: '민수', weather: 'normal' },
        { id: 'F-02', title: '창고 후진 차량', en: 'Reversing warehouse vehicle', cue: '창고 코너에서 후진 경고음이 들립니다. 적재물 때문에 운전자 시야가 가려져 있습니다.', cueEn: 'A reversing warning sounds at the warehouse corner. Stacked goods obstruct the driver’s view.', machine: 'FLT-02', location: '창고 코너', npc: '지우', weather: 'dim' },
        { id: 'F-03', title: '출고 구역 연속 통행', en: 'Busy dispatch crossing', cue: '출고 코너에서 첫 지게차 뒤로 다른 차량이 접근합니다. 동료가 지름길을 가리킵니다.', cueEn: 'Another vehicle follows the first forklift at the dispatch corner. A coworker points to a shortcut.', machine: 'FLT-03', location: '출고 코너', npc: '현우', weather: 'busy' }
      ],
      steps: [
        step('안전선 정지', 'Stop at the line', '사각지대에서 지게차 신호가 들립니다. 첫 행동은?', 'You hear a forklift cue at the blind corner. What comes first?', '노란 안전선 뒤의 지정 대기 위치에서 멈추세요.', 'Stop at the designated waiting position behind the yellow safety line.', [
          option('stop', '노란 안전선 뒤에서 정지', 'Stop behind the yellow safety line', true, '안전선 뒤에 멈췄습니다. 동료: “저도 여기서 기다릴게요.”', 'You stopped behind the line. Coworker: “I will wait here too.”'),
          option('run', '차량보다 먼저 뛰어 건너기', 'Run across before the vehicle', false, '차량 속도와 시야를 추측해 건너지 않습니다. 안전선 뒤에서 멈추세요.', 'Do not cross by guessing the vehicle’s speed or visibility. Stop behind the line.'),
          option('peek', '차량 통로 안으로 나가 확인', 'Step into the vehicle lane to look', false, '확인을 위해 차량 동선으로 들어가지 않습니다. 지정 대기 위치를 유지하세요.', 'Do not enter the vehicle path to inspect. Remain in the waiting area.')
        ], 'spot'),
        step('신호 확인', 'Check the cues', '안전선 뒤에 멈췄습니다. 무엇을 확인할까요?', 'You have stopped behind the line. What should you check?', '안전한 위치에서 경적, 시각 신호와 차량 움직임을 함께 확인하세요.', 'From safety, check the horn, visual signals, and vehicle movements together.', [
          option('check', '경적·시각 신호·차량 이동을 함께 확인', 'Check the horn, visual cues, and vehicle movement', true, '지게차가 코너를 통과하는 것을 확인했습니다. 운전자: “아직 통행 중입니다.”', 'You observe a forklift moving through the corner. Driver: “Vehicle still moving.”'),
          option('phone', '휴대폰을 보면서 기다리기', 'Wait while looking at your phone', false, '주의가 분산되면 추가 차량이나 신호를 놓칠 수 있습니다. 주변을 확인하세요.', 'Distraction can hide a second vehicle or warning cue. Observe the surroundings.'),
          option('silent', '경적이 안 들리면 바로 통과', 'Cross as soon as the horn stops', false, '소리가 멈춰도 차량이 없다는 뜻은 아닙니다. 시야와 동선도 확인하세요.', 'Silence does not mean the path is clear. Check visibility and movement too.')
        ], 'spot'),
        step('통행 대기', 'Wait for a clear path', '첫 차량이 지나갔습니다. 이제 건너도 될까요?', 'The first vehicle has passed. Is it time to cross?', '추가 차량과 주변 동선을 확인하고 통로가 완전히 확보될 때까지 대기하세요.', 'Check for additional vehicles and wait until the pedestrian route is clear.', [
          option('wait', '추가 차량을 확인하고 통로 확보까지 대기', 'Check for other vehicles and wait for a clear route', true, '모든 차량이 지나갔고 지정 보행 경로가 확보되었습니다.', 'All vehicles have passed and the designated pedestrian route is now clear.'),
          option('follow', '차량 바로 뒤에 붙어서 이동', 'Walk close behind the vehicle', false, '차량 바로 뒤는 운전자가 보기 어려울 수 있습니다. 충분히 떨어져 대기하세요.', 'Walking directly behind a vehicle may put you out of sight. Keep clear and wait.'),
          option('gesture', '손을 흔들며 차량 앞으로 이동', 'Wave and move in front of the vehicle', false, '손짓만으로 안전한 통행이 보장되지 않습니다. 정지 상태를 유지하며 통로를 확인하세요.', 'A gesture alone does not establish a safe crossing. Remain stopped and verify the route.')
        ], 'spot'),
        step('지정 보행로', 'Use the designated lane', '통로가 확보되었습니다. 동료가 지름길을 제안합니다.', 'The route is clear. A coworker suggests a shortcut.', '동료에게 차량 통로 위험을 알리고 지정된 보행자 경로를 함께 이용하세요.', 'Warn your coworker about the vehicle lane and use the designated pedestrian route together.', [
          option('lane', '동료에게 알리고 지정 보행로로 이동', 'Inform your coworker and use the pedestrian lane', true, '동료: “차량 통로 대신 지정 보행로로 함께 갈게요.” 훈련을 완료했습니다.', 'Coworker: “I will use the pedestrian lane with you.” Training complete.'),
          option('shortcut', '차량이 없으니 지름길 이용', 'Take the shortcut while no vehicle is visible', false, '차량이 잠시 보이지 않아도 지정 동선을 벗어나지 않습니다. 보행로를 이용하세요.', 'An empty-looking vehicle lane is not a pedestrian route. Use the designated lane.'),
          option('alone', '동료를 두고 차량 통로로 이동', 'Walk through the vehicle lane alone', false, '안전한 보행 경로를 선택하고 동료에게도 위험 정보를 공유하세요.', 'Choose the pedestrian route and share the hazard information with your coworker.')
        ], 'communicate')
      ]
    },
    {
      id: 'chemical', title: '화학물질 누출 의심', en: 'Suspected chemical leak', subtitle: '위험 인지 · 대피 · 보고', tag: 'CASE 03',
      description: '접근하거나 물질을 만지지 않고 안전 구역으로 이동한 뒤 누출 의심 상황을 보고하세요.',
      descriptionEn: 'Avoid contact, move to safety, report the suspected leak, and warn nearby coworkers.',
      variants: [
        { id: 'L-01', title: '저장 구역 유출물', en: 'Storage-area spill', cue: '저장 구역 바닥에 정체를 알 수 없는 유출물이 보입니다. 위험 라벨이 붙은 용기가 주변에 있습니다.', cueEn: 'An unidentified spill is visible on the storage floor beside a hazard-labelled container.', machine: 'TANK-01', location: '저장 구역', npc: '민수', weather: 'normal' },
        { id: 'L-02', title: '이송 구역 누출 의심', en: 'Transfer-area suspected leak', cue: '이송 구역 용기 아래에서 액체가 번지고 있습니다. 동료가 직접 닦으려 다가옵니다.', cueEn: 'Liquid is spreading beneath a container in the transfer area. A coworker approaches to wipe it up.', machine: 'TANK-02', location: '이송 구역', npc: '지우', weather: 'dim' },
        { id: 'L-03', title: '혼합 구역 경보', en: 'Mixing-area alarm', cue: '혼합 구역 경보와 함께 바닥의 유출 흔적이 보입니다. 어떤 물질인지는 확인되지 않았습니다.', cueEn: 'An alarm sounds in the mixing area and a spill trace is visible. The substance is unidentified.', machine: 'TANK-03', location: '혼합 구역', npc: '현우', weather: 'busy' }
      ],
      steps: [
        step('위험 인지', 'Identify the hazard', '정체를 알 수 없는 유출물이 보입니다. 어떻게 확인할까요?', 'You see an unidentified spill. How should you assess it?', '물질을 만지거나 냄새 맡지 말고, 안전한 거리에서 표지와 유출을 확인하세요.', 'Do not touch or smell the material. Observe the spill and labels from a safe distance.', [
          option('identify', '안전거리에서 표지·유출을 확인', 'Observe labels and the spill from a safe distance', true, '누출 의심 구역을 인지했습니다. 물질을 확인하기 위해 접근하지 않았습니다.', 'You identified a suspected leak without approaching or contacting the substance.'),
          option('smell', '가까이 가서 냄새로 종류 확인', 'Move closer to identify it by smell', false, '냄새로 확인하려고 접근하면 노출될 수 있습니다. 거리를 두고 관찰하세요.', 'Approaching to smell an unknown substance may expose you. Observe from a distance.'),
          option('touch', '손으로 만져 물인지 확인', 'Touch it to see if it is water', false, '알 수 없는 유출물과 직접 접촉하지 않습니다. 안전거리를 확보하세요.', 'Do not make direct contact with an unknown spill. Keep a safe distance.')
        ], 'spot'),
        step('안전 구역 대피', 'Move to safety', '누출이 의심됩니다. 다음 행동은?', 'A leak is suspected. What comes next?', '유출 구역을 통과하지 말고 이 훈련에서 표시한 안전 구역으로 이동하세요.', 'Avoid the spill area and move to the safe zone marked in this training.', [
          option('evacuate', '유출 구역을 피해 표시된 안전 구역으로 대피', 'Avoid the spill and move to the marked safe zone', true, '안전 구역에 도착했습니다. 이제 안전한 위치에서 관리자에게 보고할 수 있습니다.', 'You reached the safe zone. You can now report from a safe position.'),
          option('clean', '확산 전에 직접 청소', 'Clean it before it spreads', false, '물질과 대응 방법이 확인되지 않았습니다. 훈련생이 직접 청소하지 않습니다.', 'The material and required response are unknown. A trainee must not attempt cleanup.'),
          option('cross', '유출물 위를 넘어 가까운 출구로 이동', 'Step over the spill to the nearest exit', false, '유출 구역을 통과하지 마세요. 오염 구역을 피하는 표시 경로를 이용합니다.', 'Do not pass through the spill area. Use the marked route avoiding contamination.')
        ], 'report'),
        step('누출 상황 보고', 'Report the suspected leak', '안전 구역에서 무엇을 보고할까요?', 'What should you report from the safe zone?', '안전한 위치에서 본 위치, 유출 상태, 인지한 표지를 전달하세요. 물질을 추측하지 않습니다.', 'Report the location, visible spill condition, and observed labels. Do not guess the substance.', [
          option('report', '위치·유출 상태를 관리자에게 보고', 'Report the location and visible spill condition', true, '관리자: “누출 의심 보고 접수했습니다. 권한 있는 대응팀에 전달하겠습니다.”', 'Supervisor: “Suspected leak report received. Authorized responders will handle it.”'),
          option('guess', '물이라고 추측해 이상 없음으로 보고', 'Guess it is water and report no hazard', false, '확인되지 않은 물질을 안전하다고 추측하지 않습니다. 관찰 사실만 전달하세요.', 'Do not assume an unknown material is safe. Report only what you observed.'),
          option('photo', '사진을 찍으러 유출 구역으로 복귀', 'Return to the spill area for a photo', false, '보고를 위해 위험 구역에 재진입하지 않습니다. 안전한 위치에서 관찰 사실을 보고하세요.', 'Do not re-enter a hazardous area to obtain evidence. Report from safety.')
        ], 'report'),
        step('주변 동료 경고', 'Warn nearby coworkers', '동료가 누출 구역 근처로 이동하려 합니다.', 'A coworker is about to approach the suspected leak area.', '안전 구역에서 누출 의심과 접근 금지를 알리세요. 직접 위험 구역에 들어가지 않습니다.', 'From safety, warn about the suspected leak and restricted area. Do not enter the hazard zone.', [
          option('warn', '안전 구역에서 접근 금지와 대피 경로 안내', 'From safety, warn them away and indicate the safe route', true, '동료: “접근하지 않고 안전 구역으로 이동하겠습니다.” 팀에 위험 정보가 전달되었습니다.', 'Coworker: “I will stay clear and move to the safe zone.” Hazard information shared.'),
          option('fetch', '직접 유출 구역에 들어가 동료 데려오기', 'Enter the spill area to fetch the coworker', false, '훈련생이 추가로 노출될 수 있습니다. 안전한 위치에서 경고하고 담당자에게 알리세요.', 'Entering may expose another person. Warn from safety and notify the supervisor.'),
          option('quiet', '소란을 피하려 조용히 기다리기', 'Remain quiet to avoid disruption', false, '주변 동료에게 현재 위험을 알려 추가 접근을 막아야 합니다.', 'Nearby coworkers need the hazard information to prevent further exposure.')
        ], 'communicate')
      ]
    }
  ];
  // Advanced exercises add a plausible shortcut; the required safe sequence never changes.
  const advancedChoices = {
    conveyor: [
      ['설비 바로 옆에서 경보 해제를 기다리기', 'Wait beside the machine for the alarm to stop'],
      ['작업이 끝난 뒤 관리자에게 보고', 'Report to the supervisor after finishing work'],
      ['동료도 경보를 들었을 거라고 생각하기', 'Assume the coworker already heard the alarm'],
      ['담당자 확인 없이 동료에게 재가동 맡기기', 'Ask a coworker to restart without authorized clearance']
    ],
    forklift: [
      ['운전자가 봤을 것이라 믿고 계속 걷기', 'Keep walking assuming the driver has seen you'],
      ['주변 사람의 걸음만 보고 안전 여부 판단', 'Judge safety only by watching other pedestrians'],
      ['앞사람이 건너자 곧바로 따라가기', 'Follow immediately behind another pedestrian'],
      ['가까운 차량 통로 가장자리로 이동', 'Use the edge of the nearby vehicle lane']
    ],
    chemical: [
      ['용기 라벨을 읽으러 유출물 가까이 접근', 'Approach the spill to read the container label'],
      ['현장에 남아 유출 범위를 직접 측정', 'Stay in the area to measure the spill'],
      ['물질 이름을 확인할 때까지 보고 미루기', 'Delay the report until the substance is identified'],
      ['위험 구역 안에서 동료의 이동 안내', 'Guide coworkers while standing inside the hazard zone']
    ]
  };
  const copy = value => JSON.parse(JSON.stringify(value));
  const clampLevel = value => Math.min(3, Math.max(1, Math.round(Number(value) || 1)));
  class AVSSEngine {
    constructor(config = {}) {
      const rawNow = typeof config.now === 'function' ? config.now : () => Date.now();
      let lastNow = -Infinity;
      this.now = () => {
        const value = Number(rawNow());
        if (Number.isFinite(value)) lastNow = Math.max(lastNow, value);
        return Number.isFinite(lastNow) ? lastNow : 0;
      };
      this.onChange = typeof config.onChange === 'function' ? config.onChange : () => {};
      this.round = -1;
      this.reset({ scenarioId: config.scenarioId || 'conveyor', level: config.level || 1 }, false);
    }
    reset(config = {}, notify = true) {
      const id = config.scenarioId || this.scenarioId || 'conveyor';
      this.scenario = scenarios.find(item => item.id === id) || scenarios[0];
      this.scenarioId = this.scenario.id;
      this.level = clampLevel(config.level || this.level || 1);
      this.round += 1;
      this.variant = copy(this.scenario.variants[this.round % this.scenario.variants.length]);
      this.phase = 'idle'; this.stage = 0; this.mistakes = 0; this.hints = 0;
      this.logs = []; this.completedSteps = []; this.startedAt = null; this.stepStartedAt = null;
      this.finishedAt = null; this.result = null; this.feedback = null; this.hintedStages = new Set();
      this.responses = []; this.hintText = ''; this.hintEn = '';
      if (notify) this.emit();
      return this.getState();
    }
    start() {
      if (this.phase !== 'idle') return this.getState();
      this.phase = 'active'; this.startedAt = this.now(); this.stepStartedAt = this.startedAt;
      this.feedback = { type: 'info', text: this.variant.cue, en: this.variant.cueEn };
      this.emit(); return this.getState();
    }
    hint() {
      if (this.phase !== 'active') return this.getState();
      const current = this.scenario.steps[this.stage];
      if (!this.hintedStages.has(this.stage)) {
        this.hintedStages.add(this.stage); this.hints += 1;
        this.logs.push({ elapsedMs: this.elapsed(), action: 'hint', actionLabel: '힌트 확인', actionEn: 'Hint viewed', correct: null, message: current.hint, messageEn: current.hintEn, stage: this.stage, responseMs: null });
      }
      this.hintText = current.hint; this.hintEn = current.hintEn;
      this.feedback = { type: 'hint', text: current.hint, en: current.hintEn };
      this.emit(); return this.getState();
    }
    choose(actionId) {
      if (this.phase !== 'active') return this.getState();
      const current = this.scenario.steps[this.stage];
      const selected = this.availableOptions(current).find(item => item.id === actionId);
      if (!selected) return this.getState();
      const now = this.now();
      const responseMs = Math.max(0, now - this.stepStartedAt);
      this.responses.push(responseMs);
      this.logs.push({ elapsedMs: this.elapsed(), action: selected.id, actionLabel: selected.label, actionEn: selected.en, correct: selected.correct, message: selected.text, messageEn: selected.feedbackEn, stage: this.stage, responseMs, behavior: current.behavior });
      this.feedback = { type: selected.correct ? 'success' : 'error', text: selected.text, en: selected.feedbackEn };
      if (selected.correct) {
        this.completedSteps.push(this.stage);
        this.stage += 1;
        this.hintText = ''; this.hintEn = '';
        if (this.stage >= this.scenario.steps.length) this.finish(now);
      } else {
        this.mistakes += 1;
      }
      this.stepStartedAt = now;
      this.emit(); return this.getState();
    }
    elapsed() {
      return this.startedAt === null ? 0 : Math.max(0, (this.finishedAt === null ? this.now() : this.finishedAt) - this.startedAt);
    }
    score() { return Math.max(0, 100 - this.mistakes * 12 - this.hints * 4); }
    finish(now) {
      this.phase = 'complete'; this.finishedAt = now;
      const durationMs = this.elapsed();
      const avgResponseMs = this.responses.length ? Math.round(this.responses.reduce((sum, ms) => sum + ms, 0) / this.responses.length) : 0;
      let recommendedLevel = this.level;
      let recommendation = '현재 난이도로 다시 연습해 판단을 안정시켜 보세요.';
      let recommendationEn = 'Repeat this level to make your decisions more consistent.';
      if (this.mistakes >= 2 || this.hints >= 3 || avgResponseMs > 45000) {
        recommendedLevel = Math.max(1, this.level - 1);
        recommendation = this.level > 1 ? '실수·힌트·반응시간을 바탕으로 한 단계 낮춰 반복 연습을 권장합니다.' : '기초 난이도를 유지하고 힌트로 각 대응 순서를 다시 확인하세요.';
        recommendationEn = this.level > 1 ? 'Based on errors, hints, and response time, repeat one level lower.' : 'Keep the foundation level and use hints to review each response.';
      } else if (this.mistakes === 0 && this.hints === 0 && avgResponseMs <= 20000) {
        recommendedLevel = Math.min(3, this.level + 1);
        recommendation = this.level < 3 ? '정확한 선택과 안정적인 반응을 기록했습니다. 다음 훈련은 한 단계 높여보세요.' : '심화 난이도를 유지하며 다른 현장 맥락으로 반복 연습하세요.';
        recommendationEn = this.level < 3 ? 'Accurate choices and steady responses: try the next level.' : 'Maintain the advanced level and practice a different context.';
      }
      const actionLogs = this.logs.filter(item => item.correct !== null);
      const behaviors = ['spot', 'report', 'communicate'].map(id => {
        const items = actionLogs.filter(item => item.behavior === id);
        return { id, attempts: items.length, correct: items.filter(item => item.correct).length, accuracy: items.length ? Math.round(100 * items.filter(item => item.correct).length / items.length) : null };
      });
      this.result = { scenarioId: this.scenarioId, title: this.scenario.title, titleEn: this.scenario.en, level: this.level, variant: this.variant.id, score: this.score(), mistakes: this.mistakes, hints: this.hints, durationMs, avgResponseMs, accuracy: Math.round(100 * this.completedSteps.length / actionLogs.length), correctActions: this.completedSteps.length, attempts: actionLogs.length, recommendedLevel, recommendation, recommendationEn, behaviors, completedAt: new Date(now).toISOString() };
    }
    availableOptions(current) {
      if (this.level === 1) {
        const wrong = current.options.filter(item => !item.correct);
        return [current.options.find(item => item.correct), wrong[(this.round + this.stage) % wrong.length]];
      }
      if (this.level === 2) return current.options;
      const [label, en] = advancedChoices[this.scenarioId][Math.min(this.stage, this.scenario.steps.length - 1)];
      return current.options.concat(option('shortcut_' + this.stage, label, en, false,
        '추측이나 편의를 위해 안전 확인을 생략하지 않습니다. 안전한 위치를 유지하며 정해진 대응을 선택하세요.',
        'Do not skip safety checks for convenience or assumptions. Keep a safe position and follow the response sequence.'));
    }
    getState() {
      const current = this.scenario.steps[Math.min(this.stage, this.scenario.steps.length - 1)];
      let options = this.phase === 'active' ? this.availableOptions(current).map(({ id, label, en }) => ({ id, label, en })) : [];
      // Stable order within each step; retries and challenge levels change the choice placement.
      const rotation = (this.round + this.stage + this.level - 1) % Math.max(1, options.length);
      options = options.slice(rotation).concat(options.slice(0, rotation));
      return copy({
        phase: this.phase, scenarioId: this.scenarioId, level: this.level, stage: this.stage,
        title: this.scenario.title, titleEn: this.scenario.en,
        scenario: { id: this.scenario.id, title: this.scenario.title, en: this.scenario.en, description: this.scenario.description, descriptionEn: this.scenario.descriptionEn },
        prompt: this.phase === 'idle' ? this.variant.cue : this.phase === 'complete' ? '훈련이 완료되었습니다. 기록을 검토하고 다시 연습하세요.' : current.prompt + (this.level === 3 ? ' 동료는 일정이 급하다며 서두르자고 합니다.' : ''),
        promptEn: this.phase === 'idle' ? this.variant.cueEn : this.phase === 'complete' ? 'Training complete. Review the log and practice again.' : current.promptEn + (this.level === 3 ? ' A coworker urges you to hurry because work is behind schedule.' : ''),
        objective: this.level === 1 ? current.hint : this.level === 2 ? current.label : '주변 압박에도 안전한 판단을 유지하세요. 필요하면 힌트를 요청할 수 있습니다.',
        objectiveEn: this.level === 1 ? current.hintEn : this.level === 2 ? current.en : 'Maintain safe judgment despite pressure. A hint is available if needed.',
        challenge: { optionCount: this.level + 1, automaticGuidance: this.level === 1, coworkerPressure: this.level === 3 },
        options, completedSteps: this.completedSteps, steps: this.scenario.steps.map(({ label, en }) => ({ label, en })),
        feedback: this.feedback, logs: this.logs, elapsedMs: this.elapsed(), mistakes: this.mistakes, hints: this.hints,
        hintText: this.hintText, hintEn: this.hintEn, hintUsed: this.hintedStages.has(this.stage), score: this.score(), result: this.result, variant: this.variant,
        adaptive: { mode: 'rule-based', description: '발표용 규칙 기반 적응 로직 · 현장 인증 SOP 아님', en: 'Rule-based presentation prototype · not a certified site SOP' }
      });
    }
    emit() { this.onChange(this.getState()); }
  }
  root.AVSSEngine = AVSSEngine;
  root.AVSS_SCENARIOS = scenarios.map(({ id, title, en, subtitle, tag, description, descriptionEn, steps }) => ({ id, title, en, subtitle, tag, description, descriptionEn, steps: steps.map(({ label, en }) => ({ label, en })) }));
})(typeof window !== 'undefined' ? window : globalThis);
