(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const format = new Intl.NumberFormat("ko-KR");

  function money(value) {
    return format.format(Math.round(value));
  }

  function calculate() {
    const goods = Number($("goodsUSD").value);
    const shipping = Number($("shippingUSD").value);
    const exchange = Number($("customsExchange").value);
    const rate = Number($("dutyRate").value);
    const fromUnitedStates = $("origin").value === "us";
    const listEligible = fromUnitedStates && $("listEligible").checked;
    const threshold = listEligible ? 200 : 150;

    $("listEligible").disabled = !fromUnitedStates;
    $("usEligibilityWrap").style.opacity = fromUnitedStates ? "1" : "0.58";

    if (![goods, shipping, exchange, rate].every(Number.isFinite) ||
        goods < 0 || shipping < 0 || exchange <= 0 || rate < 0 || rate > 100) {
      $("customsError").hidden = false;
      $("customsError").textContent = "금액과 환율은 0 이상, 관세율은 0~100% 범위로 입력해 주세요.";
      return;
    }

    $("customsError").hidden = true;
    const exempt = goods <= threshold;
    const goodsKRW = goods * exchange;
    const taxableBase = (goods + shipping) * exchange;
    const duty = exempt ? 0 : taxableBase * (rate / 100);
    const vat = exempt ? 0 : (taxableBase + duty) * 0.1;
    const total = taxableBase + duty + vat;

    $("threshold").textContent = `$${threshold}`;
    $("goodsKRW").textContent = money(goodsKRW);
    $("taxableBase").textContent = money(taxableBase);
    $("dutyAmount").textContent = money(duty);
    $("vatAmount").textContent = money(vat);
    $("customsTotal").textContent = `${money(total)}원`;
    $("taxStatus").textContent = exempt
      ? `면세 기준 이내 예상 · 물품가격 $${threshold} 이하`
      : `과세 예상 · 물품가격 $${threshold} 초과`;
    $("taxDescription").textContent = exempt
      ? "자가사용 및 통관 조건을 충족하는 경우 관세와 부가세가 면제될 수 있습니다."
      : "과세가격에는 입력한 국제배송비가 포함되며, 품목별 추가 세금은 반영되지 않습니다.";
  }

  function init() {
    if (!$("customsCalculator")) return;
    ["origin", "goodsUSD", "shippingUSD", "customsExchange", "dutyRate", "listEligible"]
      .forEach((id) => $(id).addEventListener("input", calculate));

    document.querySelectorAll("[data-customs-rate]").forEach((button) => {
      button.addEventListener("click", function () {
        $("dutyRate").value = this.dataset.customsRate;
        document.querySelectorAll("[data-customs-rate]").forEach((item) => {
          item.setAttribute("aria-pressed", item === this ? "true" : "false");
        });
        calculate();
      });
    });

    calculate();
  }

  document.addEventListener("DOMContentLoaded", init);
}());
