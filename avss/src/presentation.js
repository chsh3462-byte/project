/* Bilingual slide content adapted from the user-supplied AVSS presentation script. */
window.AVSS_SLIDES = [
  {
    "number": 1,
    "title": "위험을 경험하고, 안전을 학습하다",
    "enTitle": "Practice risk. Learn safety.",
    "kicker": "AVSS / INTRODUCTION",
    "seconds": 30,
    "speaker": "김동영 · Dongyoung Kim",
    "summary": "AI 증강 가상 안전 시뮬레이션",
    "enSummary": "AI-Augmented Virtual Safety Simulation",
    "points": [
      {
        "title": "안전한 반복 연습",
        "enTitle": "Safe, repeated practice",
        "text": "실제 공장에 들어가기 전, 가상 환경에서 위험 인지와 대응 판단을 연습합니다.",
        "en": "Practice hazard recognition and safe decisions before entering a real factory."
      },
      {
        "title": "김동영 × 조상우",
        "enTitle": "Dongyoung Kim × Sangwoo Cho",
        "text": "제조업 안전 교육을 위한 적응형 VR·AR 서비스 제안",
        "en": "An adaptive VR and AR safety training concept for manufacturing."
      }
    ],
    "notesKo": "안녕하세요, 여러분. 제 이름은 김동영이고, 오늘 제 팀원인 조상우와 함께 발표합니다. 오늘 저희는 AVSS, 즉 AI 증강 가상 안전 시뮬레이션이라는 AI 프로젝트를 소개하고자 합니다. 저희의 목표는 공장 위험 요소를 인지하고 안전하게 대응하기 위한 적응형 VR/AR 안전 훈련 시스템을 구축하는 것입니다.",
    "notesEn": "Hello, everyone. / My name is Dongyoung Kim, / and I'm presenting today with my teammate, Sangwoo Cho. / Today, we'd like to introduce our AI project called AVSS, / which stands for AI-Augmented Virtual Safety Simulation. / Our goal is to build an adaptive VR and AR safety trainer / for factory hazard recognition and safe response."
  },
  {
    "number": 2,
    "title": "8분의 여정",
    "enTitle": "Our eight-minute roadmap",
    "kicker": "ROADMAP",
    "seconds": 35,
    "speaker": "김동영 · Dongyoung Kim",
    "summary": "문제에서 시스템으로, 훈련에서 현장으로.",
    "enSummary": "From training problems to a system. From virtual practice to real work.",
    "points": [
      {
        "title": "전반부 · 00:00–04:00",
        "enTitle": "Part 1 · 00:00–04:00",
        "text": "김동영: 기존 안전 교육의 한계 → 서비스 컨셉 → 핵심 AI → 훈련 루프",
        "en": "Dongyoung: training gaps → service concept → core AI → adaptive loop."
      },
      {
        "title": "후반부 · 04:00–08:00",
        "enTitle": "Part 2 · 04:00–08:00",
        "text": "조상우: 현장 전이 → 파일럿 3종 → 기대 효과와 검증 계획",
        "en": "Sangwoo: field transfer → three pilot cases → expected value and validation."
      }
    ],
    "notesKo": "먼저 8분 발표 로드맵을 간략히 말씀드리겠습니다. AVSS는 사용자들이 공장 위험 요소를 인지하고 안전하게 대응하는 것을 연습하도록 돕는 AI 서비스입니다. 왼쪽의 전반부 4분 동안은 제가 기존 정적 안전 교육의 한계와 서비스 컨셉, 핵심 AI 기술을 설명하고, 오른쪽의 후반부 4분 동안은 상우가 실제 공장 작업으로의 전이 설계, 3대 파일럿 시나리오, 그리고 기대 효과와 한계 보완책을 설명하겠습니다.",
    "notesEn": "First, let me briefly share our eight-minute presentation roadmap. / AVSS is an AI service / that helps users practice recognizing factory hazards and responding safely. / On the left side, during the first four minutes, / I will cover the limitations of static safety training, our service concept, and our core AI technology. / On the right side, during the second four minutes, / Sangwoo will explain how our training transfers to real factory work, / walk through three pilot scenarios, and discuss expected impact and limitations."
  },
  {
    "number": 3,
    "title": "문제와 AVSS 솔루션",
    "enTitle": "Problem & AVSS Solution",
    "kicker": "SECTION 01",
    "seconds": 10,
    "speaker": "김동영 · Dongyoung Kim",
    "summary": "정해진 영상을 보는 교육에서, 직접 판단하는 훈련으로.",
    "enSummary": "Move from watching a fixed video to practicing decisions.",
    "points": [
      {
        "title": "질문",
        "enTitle": "Our question",
        "text": "갑작스러운 공장 위험에 신입 작업자는 어떻게 대비할 수 있을까요?",
        "en": "How can new workers prepare for sudden factory hazards?"
      }
    ],
    "notesKo": "첫 번째 섹션인 기존 안전 교육의 문제점과 저희 AVSS 솔루션부터 시작하겠습니다.",
    "notesEn": "Let's start with the first section: / the problem in conventional safety training, and our AVSS solution."
  },
  {
    "number": 4,
    "title": "기존 안전 교육의 세 가지 한계",
    "enTitle": "Three gaps in conventional training",
    "kicker": "THE PROBLEM",
    "seconds": 50,
    "speaker": "김동영 · Dongyoung Kim",
    "summary": "위험 상황은 바뀌지만, 기존 훈련은 같은 장면을 반복합니다.",
    "enSummary": "Real hazards change. Conventional training often repeats the same scene.",
    "points": [
      {
        "title": "정적 시나리오",
        "enTitle": "Static scenarios",
        "text": "고정된 영상은 훈련생의 선택에 반응하지 않습니다.",
        "en": "Fixed videos do not respond to a trainee’s actions."
      },
      {
        "title": "위험한 재현",
        "enTitle": "Unsafe replication",
        "text": "설비 급정지와 누출은 실제 공장에서 안전하게 재현하기 어렵습니다.",
        "en": "Machine incidents and chemical leaks are too dangerous to stage on a live floor."
      },
      {
        "title": "높은 운영 비용",
        "enTitle": "High logistics cost",
        "text": "물리적 훈련에는 전용 공간과 생산 중단이 필요합니다.",
        "en": "Physical drills require dedicated space and production downtime."
      }
    ],
    "notesKo": "많은 제조업 훈련생들은 현장의 갑작스러운 비상 상황에 어려움을 겪습니다. 슬라이드의 세 가지 카드에서 보시듯 기존 교육에는 세 가지 큰 빈틈이 있습니다. 첫째, 정적 시나리오입니다. 고정된 안전 영상이 작업자의 행동에 따라 바뀌지 않기 때문에 훈련생은 직접 판단을 내리는 대신 수동적으로 시청만 하게 됩니다. 둘째, 위험한 재현성입니다. 설비 급정지나 화학 물질 누출 같은 실제 위험은 가동 중인 공장에서 재현하기에 너무 위험합니다. 셋째, 높은 물류·운영 비용입니다. 오프라인 대면 안전 훈련을 열려면 별도의 전용 공간과 값비싼 생산 라인 가동 중단이 필요합니다.",
    "notesEn": "Many manufacturing trainees have trouble with sudden emergency situations on the factory floor. / As you can see in the three cards on this slide, conventional training has three major gaps. / First, static scenarios: / this is a problem because fixed safety videos do not change based on the worker's actions. / Trainees only watch passively instead of making real decisions. / Second, unsafe replication: / real hazards like sudden machine stops or chemical leaks are too dangerous to stage on a live factory floor. / Third, high logistics cost: / setting up physical safety drills requires dedicated floor space and expensive production downtime."
  },
  {
    "number": 5,
    "title": "선택에 반응하는 가상 공장",
    "enTitle": "A virtual factory that responds",
    "kicker": "SERVICE & USERS",
    "seconds": 40,
    "speaker": "김동영 · Dongyoung Kim",
    "summary": "작업자의 행동에 맞춰 위험과 가상 동료가 반응하는 훈련을 설계합니다.",
    "enSummary": "Design training where hazards and virtual coworkers respond to trainee choices.",
    "points": [
      {
        "title": "훈련생 · 신입 작업자",
        "enTitle": "Trainees & new workers",
        "text": "현장 투입 전에 안전한 반복 연습으로 위험 인지와 대응을 익힙니다.",
        "en": "Practice recognizing hazards and responding safely before entering the floor."
      },
      {
        "title": "안전 교육 담당자",
        "enTitle": "Safety instructors",
        "text": "수행 로그를 통해 작업자의 준비 상태와 반복 실수를 검토합니다.",
        "en": "Review readiness and recurring mistakes through objective performance logs."
      }
    ],
    "notesKo": "이러한 문제를 해결하기 위해 AVSS는 왼쪽 시각 자료처럼 공장 위험 요소와 가상 동료가 훈련생의 행동에 맞춰 직접 반응하는 대화형 VR/AR 환경을 제공합니다. 이 서비스는 제조업 훈련생 및 신입 작업자, 그리고 안전 교육 담당자라는 두 핵심 타깃을 위해 설계되었습니다. 신입 작업자는 실제 현장에 투입되기 전 안전한 반복 연습이 필요하고, 안전 교육 담당자는 각 작업자의 준비 상태를 점검할 객관적인 수행 로그가 필요하기 때문입니다.",
    "notesEn": "To solve these problems, AVSS offers an interactive VR and AR environment / where factory hazards and virtual coworkers adapt directly to trainee actions, / as shown in the visual on the left. / This service is designed for two main groups: / manufacturing trainees or new workers, and safety instructors. / They need this system because new workers need safe, repeated practice before entering the real floor, / and safety instructors need objective performance logs to check each worker's readiness."
  },
  {
    "number": 6,
    "title": "AVSS의 세 가지 핵심 엔진",
    "enTitle": "Three core AI capabilities",
    "kicker": "SYSTEM DESIGN",
    "seconds": 45,
    "speaker": "김동영 · Dongyoung Kim",
    "summary": "안전 규칙 안에서 변화하고, 반응하고, 조절합니다.",
    "enSummary": "Vary, respond, and adapt within approved safety rules.",
    "points": [
      {
        "title": "동적 환경 생성",
        "enTitle": "Dynamic environment generation",
        "text": "승인된 안전 규칙 내에서 위험 요소와 이벤트 순서를 변화시키는 AI를 계획합니다.",
        "en": "Planned AI varies hazards and event order within approved safety rules."
      },
      {
        "title": "NPC · 오브젝트 상호작용",
        "enTitle": "Intelligent NPC & object interaction",
        "text": "가상 동료와 설비가 훈련생의 선택에 반응하도록 설계합니다.",
        "en": "Virtual coworkers and machines respond to trainee choices."
      },
      {
        "title": "적응형 난이도",
        "enTitle": "Adaptive difficulty tuning",
        "text": "실수 기록과 반응 시간을 바탕으로 힌트와 도전 수준을 조절합니다.",
        "en": "Tune hints and challenge levels using mistakes and response times."
      }
    ],
    "notesKo": "저희 시스템은 세 가지 핵심 AI 엔진으로 구동됩니다. 첫째, 승인된 안전 규칙 내에서 위험 요소와 이벤트 순서를 바꾸는 '동적 환경 생성'을 구축해 훈련생이 고정된 패턴을 단순 암기하지 못하게 합니다. 둘째, 가상 동료와 공장 기계가 훈련생의 선택에 실시간으로 반응하는 '지능형 NPC 및 오브젝트 상호작용'을 구현합니다. 셋째, 사용자의 실수 기록과 반응 시간을 바탕으로 힌트 빈도와 난이도를 자동 조절하는 '적응형 난이도 및 시나리오 튜닝'을 포함할 계획입니다.",
    "notesEn": "Our system is powered by three core AI engines. / First, we plan to build Dynamic Environment Generation, / which changes factory hazards and event sequences within approved safety rules, / so trainees cannot simply memorize a fixed pattern. / Second, we plan to create Intelligent NPC and Object Interaction, / where virtual coworkers and factory machines react dynamically to the trainee's choices. / Third, we plan to include Adaptive Difficulty and Scenario Tuning, / which automatically adjusts hints and challenge levels / based on the user's mistake logs and response time."
  },
  {
    "number": 7,
    "title": "반복할수록 달라지는 훈련",
    "enTitle": "The adaptive training loop",
    "kicker": "HOW IT WORKS",
    "seconds": 30,
    "speaker": "김동영 · Dongyoung Kim",
    "summary": "선택 → 대응 → 기록 → 피드백. 네 단계가 다시 연결됩니다.",
    "enSummary": "Select → respond → track → review. Then practice again.",
    "points": [
      {
        "title": "01 · 과제 선택",
        "enTitle": "01 · Task selection",
        "text": "가상 공장에 입장해 안전 과제를 선택합니다.",
        "en": "Enter the virtual factory and select a safety task."
      },
      {
        "title": "02 · 위험 대응",
        "enTitle": "02 · Hazard response",
        "text": "통제된 위험 상황에 대응하고 동료·설비와 상호작용합니다.",
        "en": "Respond to a controlled hazard and interact with coworkers and machines."
      },
      {
        "title": "03 · 지표 추적",
        "enTitle": "03 · Metric tracking",
        "text": "선택과 반응 시간을 기록해 다음 훈련 난이도를 조절합니다.",
        "en": "Record choices and response times to adjust the next session."
      },
      {
        "title": "04 · 검토 · 재시도",
        "enTitle": "04 · Review & retry",
        "text": "피드백을 확인하고 새로운 조건으로 다시 연습합니다.",
        "en": "Review feedback and practice again under changed conditions."
      }
    ],
    "notesKo": "7번 슬라이드는 이 세 가지 AI 엔진이 4단계 적응형 훈련 루프에서 어떻게 작동하는지 보여줍니다. 1단계(과제 선택)에서 사용자는 가상 공장에 들어가 안전 과제를 선택합니다. 2단계(위험 대응)에서 AI가 통제된 위험 시나리오를 시작하고 가상 동료와 기계가 사용자 행동에 반응합니다. 3단계(지표 추적)에서 시스템이 선택과 반응 시간을 기록해 난이도를 조절합니다. 마지막 4단계(검토 및 재시도)에서 사용자는 강사 피드백을 받고 다시 1단계로 순환해 반복 연습합니다. 이제 상우가 현장 전이 설계, 파일럿 시나리오, 그리고 검증 계획에 대해 이어서 발표하겠습니다.",
    "notesEn": "Slide 7 shows how these three AI engines connect in a four-step adaptive training loop. / In Step 1, Task Selection, users enter a virtual factory floor and select a safety task. / In Step 2, Hazard Response, the AI starts a controlled hazard scenario, / and virtual coworkers and machines respond to user actions. / In Step 3, Metric Tracking, the system records choices and response time to adjust difficulty. / Finally, in Step 4, Review and Retry, users get instructor feedback and loop back to Step 1 to practice again. / Now, Sangwoo will talk about our reality-to-VR transfer, pilot scenarios, and validation plan."
  },
  {
    "number": 8,
    "title": "현장 시나리오와 검증 계획",
    "enTitle": "Field Scenarios & Validation Plan",
    "kicker": "SECTION 02",
    "seconds": 10,
    "speaker": "조상우 · Sangwoo Cho",
    "summary": "가상 공간의 판단이 실제 작업장의 안전으로 이어지려면.",
    "enSummary": "How can virtual decisions transfer to safer real work?",
    "points": [
      {
        "title": "발표자 교대",
        "enTitle": "Speaker handoff",
        "text": "조상우가 현장 전이 원칙, 파일럿 시나리오와 검증 계획을 소개합니다.",
        "en": "Sangwoo introduces transfer principles, pilot scenarios, and the validation plan."
      }
    ],
    "notesKo": "고마워, 동영아. 두 번째 섹션인 현장 시나리오 및 검증 계획으로 넘어가겠습니다.",
    "notesEn": "Thank you, Dongyoung. / Moving into our second section, Field Scenarios and Validation Plan,"
  },
  {
    "number": 9,
    "title": "가상 훈련을 실제 현장으로",
    "enTitle": "Training-to-work transfer",
    "kicker": "FOUR PRINCIPLES",
    "seconds": 45,
    "speaker": "조상우 · Sangwoo Cho",
    "summary": "현장 조건과 절차를 반영하고, 전문가와 로그로 검증합니다.",
    "enSummary": "Ground scenarios in real conditions and verify them with experts and action logs.",
    "points": [
      {
        "title": "현장 기반 설계",
        "enTitle": "Field-grounded design",
        "text": "실제 공장 치수와 작업자 시야각을 반영합니다.",
        "en": "Match real floor dimensions and worker sightlines."
      },
      {
        "title": "SOP 정렬",
        "enTitle": "SOP alignment",
        "text": "승인된 현장 경보와 표준 보고 절차를 반영합니다.",
        "en": "Mirror approved factory alarms and reporting protocols."
      },
      {
        "title": "반응 감사",
        "enTitle": "Reaction audit",
        "text": "전문가와 NPC·설비 반응 타이밍을 검증합니다.",
        "en": "Check NPC and machine response timing with safety experts."
      },
      {
        "title": "파일럿 반복 개선",
        "enTitle": "Pilot iteration",
        "text": "훈련생 행동 로그로 시나리오를 계속 보완합니다.",
        "en": "Refine scenarios using recorded trainee action logs."
      }
    ],
    "notesKo": "9번 슬라이드는 가상 시뮬레이션과 실제 공장 작업을 어떻게 연결하는지 설명합니다. VR 훈련이 실제 생산 라인에서 효과를 발휘하도록 저희는 네 가지 전이 원칙을 따릅니다. 첫째, 현장 기반 설계로 실제 공장 바닥 치수와 작업자 시야각을 맞춥니다. 둘째, SOP 정렬로 승인된 공장 경보와 표준 보고 절차를 그대로 반영합니다. 셋째, 반응 감사로 현장 안전 전문가와 함께 NPC 및 설비 반응 타이밍을 검증합니다. 넷째, 파일럿 반복 개선으로 훈련생의 행동 로그를 사용해 시나리오를 지속 보완합니다.",
    "notesEn": "Slide 9 explains how we bridge virtual simulation and real factory work. / For VR training to be effective on a real production line, we follow four transfer principles. / First, Field-Grounded design: we match real factory floor dimensions and worker sightlines. / Second, SOP Alignment: we mirror approved factory alarms and standard reporting protocols. / Third, Reaction Audit: we verify NPC and machine response timing with field safety experts. / Fourth, Pilot Iteration: we continuously refine scenarios using recorded trainee action logs."
  },
  {
    "number": 10,
    "title": "두 가지 위험, 두 가지 판단",
    "enTitle": "Two hazards. Two decisions.",
    "kicker": "PILOT CASES 01 / 02",
    "seconds": 65,
    "speaker": "조상우 · Sangwoo Cho",
    "summary": "설비 접근을 멈추고, 사각지대에서는 안전선을 지킵니다.",
    "enSummary": "Halt approach to machinery. Respect the safety line at blind corners.",
    "points": [
      {
        "title": "CASE 01 · 컨베이어 가드",
        "enTitle": "CASE 01 · Conveyor guard",
        "text": "가드 또는 안전 펜스 경보를 인지하면 접근을 멈추고 승인된 보고 절차를 따릅니다.",
        "en": "On a guard or safety barrier alarm, halt approach and follow the approved reporting procedure."
      },
      {
        "title": "CASE 02 · 지게차 사각지대",
        "enTitle": "CASE 02 · Forklift blind corner",
        "text": "안전선 앞에서 멈추고, 경적 신호를 확인하며 지정 보행 통로를 이용합니다.",
        "en": "Stop at the safety line, check horn cues, and use designated pedestrian lanes."
      }
    ],
    "notesKo": "시스템을 검증하기 위해 훈련생들은 컨베이어 가드 개방, 지게차 사각지대 코너, 화학 물질 누출 의심이라는 3대 핵심 파일럿 사례를 연습할 수 있습니다. 10번 슬라이드는 처음 두 가지 사례를 보여줍니다. 왼쪽은 사례 1인 컨베이어 가드 및 설비 정지입니다. 안전 레이저 펜스나 가드 경보가 울리면 훈련생은 즉시 접근을 멈추고 승인된 보고 SOP를 실행해야 합니다. 오른쪽은 사례 2인 지게차 사각지대 코너입니다. 복잡한 창고 통로에서 훈련생은 노란 안전선에 멈춰 사각지대 코너의 경적 신호를 확인하고 지정된 보행자 전용 통로로만 이동해야 합니다.",
    "notesEn": "To test our system, trainees can practice three key pilot cases: / conveyor guard opening, forklift blind corner, and suspected chemical leak. / Slide 10 shows the first two cases. / On the left is Case 1, Conveyor Guard and Machine Stop. / When a safety laser barrier or guard alarm goes off, / the trainee must immediately halt their approach and execute the approved reporting SOP. / On the right is Case 2, Forklift Blind Corner. / In a busy warehouse aisle, the trainee must stop at the yellow safety line, / check for horn cues around the blind corner, and walk only inside designated pedestrian lanes."
  },
  {
    "number": 11,
    "title": "누출 의심 상황의 핵심 행동",
    "enTitle": "Suspected leak: core behaviors",
    "kicker": "PILOT CASE 03",
    "seconds": 50,
    "speaker": "조상우 · Sangwoo Cho",
    "summary": "위험을 발견하고, 안전 구역에서 보고하고, 동료에게 알립니다.",
    "enSummary": "Spot the hazard, report from safety, and warn coworkers.",
    "points": [
      {
        "title": "위험 감지",
        "enTitle": "Spot hazards",
        "text": "누출 흔적, 위험 라벨과 제한 구역을 인지합니다.",
        "en": "Recognize virtual spills, hazard labels, and restricted zones."
      },
      {
        "title": "SOP에 따른 보고",
        "enTitle": "Report by SOP",
        "text": "안전 구역으로 대피한 뒤 현장에서 검증된 경보·보고 순서를 따릅니다.",
        "en": "Move to a safe zone and follow supervisor-verified alert and reporting procedures."
      },
      {
        "title": "동료 경고",
        "enTitle": "Warn coworkers",
        "text": "위험 상태를 가상 동료와 공유하고 접근을 막습니다.",
        "en": "Share hazard information with virtual coworkers and warn them away."
      }
    ],
    "notesKo": "11번 슬라이드는 사례 3인 화학 물질 누출 의심 상황과 함께, 저희가 VR 시나리오 전반에서 평가하는 3대 핵심 행동을 표로 보여줍니다. 첫째, 위험 감지(Spot Hazards)입니다. 사용자는 실제 위험 표지판 및 제한 구역과 일치하는 설비 경보, 위험 라벨, 가상 유출물을 인지합니다. 둘째, SOP에 따른 보고(Report by SOP)입니다. 안전 체크리스트를 따라 안전 구역으로 대피한 뒤 관리자가 검증한 보고 순서대로 경보를 발령합니다. 셋째, 동료 경고(Warn Coworkers)입니다. 주변 가상 동료들에게 위험 상태를 공유하여 스트레스 상황에서의 팀 소통 능력을 평가받습니다.",
    "notesEn": "Slide 11 presents Case 3, a suspected chemical leak or spill, / along with the three core behaviors we evaluate across our VR scenarios. / First, Spot Hazards: / users learn to recognize machine alerts, hazard labels, and virtual spills / that match real hazard signs and restricted zones. / Second, Report by SOP: / users follow safety checklists to evacuate to a safe zone and trigger alerts in the supervisor-verified order. / Third, Warn Coworkers: / users share hazard status with nearby virtual teammates / so instructors can evaluate team communication under stress."
  },
  {
    "number": 12,
    "title": "기대 효과와 검증해야 할 한계",
    "enTitle": "Expected value & limitations",
    "kicker": "VALUE / VALIDATION",
    "seconds": 50,
    "speaker": "조상우 · Sangwoo Cho",
    "summary": "효과는 파일럿에서 검증하고, 감각적 한계는 실제 실습으로 보완합니다.",
    "enSummary": "Validate impact through pilots. Pair virtual practice with hands-on drills.",
    "points": [
      {
        "title": "기대 효과",
        "enTitle": "Expected value",
        "text": "신체적 위험 없는 반복 연습과 행동 로그 기반 피드백을 제공합니다. 제작 시간·비용 절감은 파일럿 검증 대상입니다.",
        "en": "Enable repeated practice and action-log feedback. Time and cost savings remain pilot hypotheses."
      },
      {
        "title": "감각적 한계",
        "enTitle": "Sensory gap",
        "text": "VR은 실제 무게, 열기와 촉각을 완전히 재현할 수 없습니다.",
        "en": "VR cannot fully reproduce physical weight, heat, and touch."
      },
      {
        "title": "보완 계획",
        "enTitle": "Mitigation plan",
        "text": "전문가 의사결정 감사와 실제 현장 실습을 결합합니다.",
        "en": "Combine expert decision audits with hands-on physical drills."
      }
    ],
    "notesKo": "12번 슬라이드에서는 기대 효과와 VR 한계 보완책을 요약했습니다. 왼쪽의 기대 효과로서 AVSS는 실제 신체적 위험 없이 다양한 위험 상황을 반복 연습하게 돕고, 행동 로그 데이터로 숙련도 격차를 줄이며, 파일럿 테스트를 통해 시나리오 제작 시간과 비용 절감 여부를 검증할 것입니다. 오른쪽에서는 VR의 감각적 한계(Sensory Gap) 또한 솔직하게 짚었습니다. VR 헤드셋만으로는 실제 무게감이나 열기, 촉각을 완벽히 재현할 수 없습니다. 이를 보완하기 위해 저희는 실제 현장 판단과 일치하는지 점검하는 의사결정 감사(Decision Audit)를 수행하고, VR 판단 훈련을 실제 현장 대면 실습과 결합하는 하이브리드 훈련을 적용합니다.",
    "notesEn": "On Slide 12, we summarize our expected value and how we address VR limitations. / On the left, AVSS helps users practice various dangerous situations repeatedly without real physical risk, / closes skill gaps using action-log data, / and we will verify through pilot testing whether this reduces scenario creation time and cost. / On the right, we also recognize the sensory gap of VR — / VR headsets cannot fully reproduce physical weight, heat, or tactile haptics. / To mitigate this, we conduct decision audits to verify judgment parity with real work, / and we use hybrid training that pairs VR decision practice with hands-on physical drills."
  },
  {
    "number": 13,
    "title": "안전하게 연습하고, 적응하며 배우다",
    "enTitle": "Practice safely. Learn adaptively.",
    "kicker": "THANK YOU / Q&A",
    "seconds": 20,
    "speaker": "조상우 · Sangwoo Cho",
    "summary": "작업자에게는 반복 연습을, 교육 담당자에게는 검토 가능한 기록을.",
    "enSummary": "Repeated practice for workers. Reviewable evidence for instructors.",
    "points": [
      {
        "title": "감사합니다",
        "enTitle": "Thank you",
        "text": "김동영 · 조상우 | 질문을 받겠습니다.",
        "en": "Dongyoung Kim · Sangwoo Cho | We welcome your questions."
      },
      {
        "title": "현재 시연 범위",
        "enTitle": "Current demonstration",
        "text": "이 HTML은 규칙 기반 브라우저 프로토타입입니다. 실제 AI·VR·AR 연동과 현장 효과는 향후 검증 대상입니다.",
        "en": "This HTML is a rule-based browser prototype. AI, VR/AR integration, and field impact require future validation."
      }
    ],
    "notesKo": "요약하자면, 저희 아이디어는 제조업 훈련생과 교육 담당자가 작업장 안전을 안전하고 적응형으로 연습하고 검토하도록 돕습니다. 경청해 주셔서 감사드리며, 기꺼이 질문을 받겠습니다.",
    "notesEn": "To sum up, / our idea helps manufacturing trainees and instructors / practice and review workplace safety safely and adaptively. / Thank you for listening, / and we would be happy to take your questions."
  },
  {
    "number": 14,
    "title": "원고의 시각 자료 출처",
    "enTitle": "Visual sources in the supplied script",
    "kicker": "REFERENCES / UNTIMED",
    "seconds": 0,
    "speaker": "참고 자료 · References",
    "summary": "원본 발표 원고에 기재된 출처입니다. 이 데모에는 해당 이미지를 사용하지 않았습니다.",
    "enSummary": "Sources named in the supplied presentation script. Those images are not included in this demo.",
    "points": [
      {
        "title": "Slide 5 · Nirtec",
        "enTitle": "Slide 5 · Nirtec",
        "text": "Machines Simulator VR · nirtec.com",
        "en": "Machines Simulator VR · nirtec.com"
      },
      {
        "title": "Slide 9 · Magnific",
        "enTitle": "Slide 9 · Magnific",
        "text": "Industrial Safety Inspection · magnific.com",
        "en": "Industrial Safety Inspection · magnific.com"
      },
      {
        "title": "Slide 10 · RobotFactory",
        "enTitle": "Slide 10 · RobotFactory",
        "text": "Safety Laser with STOP · robotfactory.dk",
        "en": "Safety Laser with STOP · robotfactory.dk"
      },
      {
        "title": "Slide 10 · RAC-Force",
        "enTitle": "Slide 10 · RAC-Force",
        "text": "Industrial Warehouse Forklifts · rac-force.com",
        "en": "Industrial Warehouse Forklifts · rac-force.com"
      }
    ],
    "notesKo": "발표 원고에 기재된 시각 자료 출처입니다. 이 HTML 데모는 해당 이미지를 포함하지 않고 직접 구현한 그래픽을 사용합니다.",
    "notesEn": "These are the visual sources named in the supplied presentation script."
  }
];
