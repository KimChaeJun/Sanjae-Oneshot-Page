const root = document.querySelector("[data-simulation]");

if (root) {
  const steps = [...root.querySelectorAll("[data-step]")];
  const agencies = [...root.querySelectorAll("[data-agency]")];
  const toggle = root.querySelector("[data-toggle]");
  const restart = root.querySelector("[data-restart]");
  const progress = root.querySelector("[data-progress]");
  const userStatus = root.querySelector("[data-user-status]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const copy = [
    {
      kicker: "STEP 1 · 정보 확인",
      title: "개인정보와 사건 개요를 확인합니다",
      time: "사용자 5분",
      icon: "✓",
      message: "입력 내용이 준비되었습니다",
      body: "이 정보는 필요한 기관과 서류를 판단하는 데만 사용합니다.",
      agency: "대기",
      status: "입력 확인",
    },
    {
      kicker: "STEP 2 · 기관 요청",
      title: "필요한 자료를 기관별로 요청합니다",
      time: "자동 처리",
      icon: "↗",
      message: "4개 기관에 요청을 보냈습니다",
      body: "사용자가 동의한 범위 안에서 필요한 항목만 요청합니다.",
      agency: "요청 중",
      status: "요청 완료",
    },
    {
      kicker: "STEP 3 · 서류 준비",
      title: "도착한 자료부터 자동으로 정리합니다",
      time: "기관별 대기",
      icon: "…",
      message: "3/4개 자료가 준비되었습니다",
      body: "남은 자료가 도착하면 알림을 보내고 다음 단계로 이어갑니다.",
      agency: "준비 완료",
      status: "수집 중",
    },
    {
      kicker: "STEP 4 · AI 작성",
      title: "확인된 사실로 신청서 초안을 만듭니다",
      time: "AI 약 2분",
      icon: "✦",
      message: "신청서 초안과 사실 대조가 끝났습니다",
      body: "입력값과 기관 자료에 없는 내용은 생성하지 않습니다.",
      agency: "자료 연결",
      status: "AI 작성",
    },
    {
      kicker: "STEP 5 · 최종 확인",
      title: "사람이 사실을 확인하고 제출합니다",
      time: "사용자 5분",
      icon: "✓",
      message: "제출 준비가 완료되었습니다",
      body: "사고 일시·장소·업무·상병을 직접 확인한 뒤 제출합니다.",
      agency: "확인 완료",
      status: "준비 완료",
    },
  ];

  let current = 0;
  let timer = null;
  let paused = prefersReducedMotion;

  if (prefersReducedMotion && toggle) {
    toggle.textContent = "계속 재생";
    toggle.setAttribute("aria-pressed", "true");
  }

  const setText = (selector, value) => {
    const node = root.querySelector(selector);
    if (node) node.textContent = value;
  };

  const render = () => {
    const item = copy[current];
    root.dataset.stage = String(current);
    setText("[data-stage-kicker]", item.kicker);
    setText("[data-stage-title]", item.title);
    setText("[data-stage-time]", item.time);
    setText("[data-message-icon]", item.icon);
    setText("[data-message-title]", item.message);
    setText("[data-message-body]", item.body);
    if (userStatus) userStatus.textContent = item.status;
    if (progress) progress.style.width = `${((current + 1) / copy.length) * 100}%`;

    steps.forEach((step, index) => {
      step.classList.toggle("active", index === current);
      step.classList.toggle("complete", index < current);
    });
    agencies.forEach((agency, index) => {
      const badge = agency.querySelector("i");
      agency.classList.toggle("active", current >= 1);
      agency.classList.toggle("ready", current >= 3 || (current === 2 && index < 3));
      if (badge) {
        badge.textContent = current === 2 && index === 3 ? "확인 중" : item.agency;
      }
    });
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  const start = () => {
    stop();
    if (paused || prefersReducedMotion) return;
    timer = window.setInterval(() => {
      current = (current + 1) % copy.length;
      render();
    }, 2600);
  };

  toggle?.addEventListener("click", () => {
    paused = !paused;
    toggle.textContent = paused ? "계속 재생" : "일시정지";
    toggle.setAttribute("aria-pressed", String(paused));
    start();
  });

  restart?.addEventListener("click", () => {
    current = 0;
    paused = false;
    if (toggle) {
      toggle.textContent = "일시정지";
      toggle.setAttribute("aria-pressed", "false");
    }
    render();
    start();
  });

  steps.forEach((step, index) => {
    step.addEventListener("click", () => {
      current = index;
      render();
      start();
    });
  });

  render();
  start();
}
