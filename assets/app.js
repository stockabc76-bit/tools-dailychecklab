(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const numberFormat = new Intl.NumberFormat("ko-KR");

  function localISODate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function parseDate(value) {
    if (!value) return null;
    const parts = value.split("-").map(Number);
    return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  }

  function setMessage(id, text) {
    $(id).textContent = text || "";
    $(id).hidden = !text;
  }

  function calculateDiscount() {
    const price = Number($("originalPrice").value);
    const rate = Number($("discountRate").value);

    if (!Number.isFinite(price) || !Number.isFinite(rate) || price < 0 || rate < 0 || rate > 100) {
      setMessage("discountError", "가격은 0원 이상, 할인율은 0~100% 사이로 입력해 주세요.");
      return;
    }

    setMessage("discountError", "");
    const discount = Math.round(price * rate / 100);
    $("discountAmount").textContent = numberFormat.format(discount);
    $("finalPrice").textContent = numberFormat.format(price - discount);
  }

  function calculateAge() {
    const birth = parseDate($("birthDate").value);
    const base = parseDate($("baseDate").value || localISODate(new Date()));

    if (!birth || !base || birth > base) {
      setMessage("ageError", "생년월일은 기준 날짜보다 이전이어야 합니다.");
      return;
    }

    setMessage("ageError", "");
    let age = base.getUTCFullYear() - birth.getUTCFullYear();
    const birthdayPassed = base.getUTCMonth() > birth.getUTCMonth() ||
      (base.getUTCMonth() === birth.getUTCMonth() && base.getUTCDate() >= birth.getUTCDate());
    if (!birthdayPassed) age -= 1;

    $("internationalAge").textContent = numberFormat.format(age);
    $("countingAge").textContent = numberFormat.format(base.getUTCFullYear() - birth.getUTCFullYear() + 1);
  }

  function calculateDate() {
    const start = parseDate($("startDate").value);
    const target = parseDate($("endDate").value);

    if (!start || !target) {
      setMessage("dateError", "시작일과 목표일을 모두 선택해 주세요.");
      return;
    }

    setMessage("dateError", "");
    const difference = Math.round((target.getTime() - start.getTime()) / 86400000);
    $("dayDifference").textContent = difference === 0 ? "D-Day" : difference > 0 ? `D-${numberFormat.format(difference)}` : `D+${numberFormat.format(Math.abs(difference))}`;
    $("totalDays").textContent = numberFormat.format(Math.abs(difference));
    $("dayStatus").textContent = difference > 0 ? "목표일까지 남은 기간입니다." : difference < 0 ? "목표일로부터 경과한 기간입니다." : "오늘이 목표일입니다.";
  }

  function selectTab(button) {
    document.querySelectorAll("[role='tab']").forEach((tab) => {
      const selected = tab === button;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      $(tab.getAttribute("aria-controls")).hidden = !selected;
    });
  }

  function initCalculator() {
    if (!$("calculator")) return;

    const today = localISODate(new Date());
    $("baseDate").value = today;
    $("startDate").value = today;

    document.querySelectorAll("[role='tab']").forEach((tab) => {
      tab.addEventListener("click", () => selectTab(tab));
    });

    document.querySelectorAll("[data-calculator-tab]").forEach((link) => {
      link.addEventListener("click", () => {
        const tab = $(link.dataset.calculatorTab);
        if (tab) selectTab(tab);
      });
    });

    document.querySelectorAll("[data-rate]").forEach((button) => {
      button.addEventListener("click", () => {
        $("discountRate").value = button.dataset.rate;
        calculateDiscount();
      });
    });

    ["originalPrice", "discountRate"].forEach((id) => $(id).addEventListener("input", calculateDiscount));
    ["birthDate", "baseDate"].forEach((id) => $(id).addEventListener("input", calculateAge));
    ["startDate", "endDate"].forEach((id) => $(id).addEventListener("input", calculateDate));

    calculateDiscount();
    calculateAge();
    calculateDate();
  }

  function initShowcase() {
    const showcase = document.querySelector("[data-showcase]");
    if (!showcase) return;

    const slides = Array.from(showcase.querySelectorAll("[data-showcase-slide]"));
    const dots = Array.from(showcase.querySelectorAll("[data-showcase-dot]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let current = 0;
    let timerId = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, position) => {
        slide.classList.toggle("is-active", position === current);
      });
      dots.forEach((dot, position) => {
        const active = position === current;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", String(active));
      });
    }

    function stopRotation() {
      if (timerId) {
        window.clearInterval(timerId);
        timerId = null;
      }
    }

    function startRotation() {
      stopRotation();
      if (!reducedMotion.matches) {
        timerId = window.setInterval(() => showSlide(current + 1), 4200);
      }
    }

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showSlide(index);
        startRotation();
      });
    });

    showcase.addEventListener("mouseenter", stopRotation);
    showcase.addEventListener("mouseleave", startRotation);
    showcase.addEventListener("focusin", stopRotation);
    showcase.addEventListener("focusout", (event) => {
      if (!showcase.contains(event.relatedTarget)) startRotation();
    });
    reducedMotion.addEventListener("change", startRotation);
    startRotation();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initCalculator();
    initShowcase();
  });
}());
