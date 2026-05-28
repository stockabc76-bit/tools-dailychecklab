(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const included = new Set();
  const excluded = new Set();
  let latestNumbers = [];

  function numberColor(number) {
    if (number <= 10) return "yellow";
    if (number <= 20) return "blue";
    if (number <= 30) return "red";
    if (number <= 40) return "gray";
    return "green";
  }

  function setMessage(text) {
    $("lottoError").textContent = text || "";
    $("lottoError").hidden = !text;
  }

  function createButtons(containerId, selected, opposite, type) {
    const container = $(containerId);
    for (let number = 1; number <= 45; number += 1) {
      const button = document.createElement("button");
      button.className = "lotto-number";
      button.type = "button";
      button.textContent = String(number);
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        if (selected.has(number)) {
          selected.delete(number);
        } else {
          if (type === "include" && selected.size >= 6) {
            setMessage("포함할 번호는 최대 6개까지 선택할 수 있습니다.");
            return;
          }
          selected.add(number);
          opposite.delete(number);
        }
        setMessage("");
        updateButtons();
      });
      container.appendChild(button);
    }
  }

  function updateButtons() {
    document.querySelectorAll("#includeNumbers .lotto-number").forEach((button, index) => {
      const active = included.has(index + 1);
      button.classList.toggle("selected", active);
      button.setAttribute("aria-pressed", String(active));
    });
    document.querySelectorAll("#excludeNumbers .lotto-number").forEach((button, index) => {
      const active = excluded.has(index + 1);
      button.classList.toggle("selected", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function randomIndex(max) {
    if (window.crypto && window.crypto.getRandomValues) {
      const maxRandom = Math.floor(4294967296 / max) * max;
      const random = new Uint32Array(1);
      do {
        window.crypto.getRandomValues(random);
      } while (random[0] >= maxRandom);
      return random[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  function generateNumbers() {
    const candidates = [];
    for (let number = 1; number <= 45; number += 1) {
      if (!included.has(number) && !excluded.has(number)) candidates.push(number);
    }
    const needed = 6 - included.size;
    if (candidates.length < needed) {
      setMessage("제외한 번호가 너무 많아 번호 6개를 만들 수 없습니다.");
      return;
    }
    const picked = Array.from(included);
    while (picked.length < 6) {
      const index = randomIndex(candidates.length);
      picked.push(candidates.splice(index, 1)[0]);
    }
    latestNumbers = picked.sort((a, b) => a - b);
    setMessage("");
    renderResult();
  }

  function renderResult() {
    const balls = $("lottoBalls");
    balls.textContent = "";
    latestNumbers.forEach((number) => {
      const ball = document.createElement("span");
      ball.className = `lotto-ball ${numberColor(number)}`;
      ball.textContent = String(number);
      balls.appendChild(ball);
    });
    $("lottoNotice").textContent = "생성 번호는 무작위 결과이며 당첨을 예측하거나 보장하지 않습니다.";
  }

  async function copyNumbers() {
    if (!latestNumbers.length) {
      setMessage("먼저 번호를 생성해 주세요.");
      return;
    }
    try {
      await navigator.clipboard.writeText(latestNumbers.join(", "));
      $("lottoNotice").textContent = "번호를 복사했습니다. 생성 결과는 참고용으로 이용해 주세요.";
    } catch (error) {
      $("lottoNotice").textContent = `생성 번호: ${latestNumbers.join(", ")} (브라우저에서 복사를 허용하지 않았습니다.)`;
    }
  }

  function init() {
    if (!$("lottoTool")) return;
    createButtons("includeNumbers", included, excluded, "include");
    createButtons("excludeNumbers", excluded, included, "exclude");
    $("clearIncluded").addEventListener("click", () => {
      included.clear();
      updateButtons();
      setMessage("");
    });
    $("clearExcluded").addEventListener("click", () => {
      excluded.clear();
      updateButtons();
      setMessage("");
    });
    $("generateLotto").addEventListener("click", generateNumbers);
    $("regenerateLotto").addEventListener("click", generateNumbers);
    $("copyLotto").addEventListener("click", copyNumbers);
  }

  document.addEventListener("DOMContentLoaded", init);
}());
