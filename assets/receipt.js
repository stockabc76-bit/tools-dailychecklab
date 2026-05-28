(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const format = new Intl.NumberFormat("ko-KR");
  const defaultNotice = "OCR 결과는 영수증 인쇄 상태와 촬영 품질에 따라 달라질 수 있습니다.";
  const nonProductKeywords = [
    "합계", "총액", "총금액", "결제금액", "받을금액", "청구금액",
    "공급가액", "공급대가", "가액", "부가세", "부가계", "부가가치세", "과세", "면세",
    "거스름", "현금", "카드", "승인", "사업자", "대표자",
    "전화", "영수증", "receipt", "주소", "매장", "포인트",
    "적립", "할인금액", "모바일"
  ];
  let items = [];

  function setState(state) {
    $("receiptUpload").hidden = state !== "upload";
    $("receiptProcessing").hidden = state !== "processing";
    $("receiptResult").hidden = state !== "result";
  }

  function updateSummary() {
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    $("receiptCount").textContent = format.format(items.length);
    $("receiptTotal").textContent = `${format.format(total)}원`;
  }

  function cellWithInput(value, type, className, change) {
    const td = document.createElement("td");
    const input = document.createElement("input");
    input.type = type;
    input.value = value;
    if (className) input.className = className;
    input.addEventListener("change", change);
    td.appendChild(input);
    return td;
  }

  function renderTable() {
    const body = $("receiptRows");
    body.textContent = "";
    items.forEach((item, index) => {
      const row = document.createElement("tr");
      row.appendChild(cellWithInput(item.name, "text", "", (event) => {
        items[index].name = event.target.value.trim() || "항목";
      }));
      row.appendChild(cellWithInput(item.quantity, "number", "numeric", (event) => {
        items[index].quantity = Math.max(1, Number(event.target.value) || 1);
        items[index].amount = items[index].quantity * items[index].unitPrice;
        renderTable();
      }));
      row.appendChild(cellWithInput(item.unitPrice, "number", "numeric", (event) => {
        items[index].unitPrice = Math.max(0, Number(event.target.value) || 0);
        items[index].amount = items[index].quantity * items[index].unitPrice;
        renderTable();
      }));

      const amount = document.createElement("td");
      amount.textContent = format.format(item.amount);
      amount.style.textAlign = "right";
      row.appendChild(amount);

      const remove = document.createElement("td");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "plain-action";
      button.textContent = "삭제";
      button.addEventListener("click", () => {
        items.splice(index, 1);
        renderTable();
      });
      remove.appendChild(button);
      row.appendChild(remove);
      body.appendChild(row);
    });
    updateSummary();
  }

  function addRow(name, quantity, unitPrice) {
    const count = Math.max(1, Number(quantity) || 1);
    const price = Math.max(0, Number(unitPrice) || 0);
    items.push({ name: name || "새 항목", quantity: count, unitPrice: price, amount: count * price });
    renderTable();
  }

  function isNonProductRow(row, name) {
    const compact = row.replace(/\s+/g, "").toLowerCase();
    const readableName = name.replace(/[^0-9a-zA-Z가-힣]/g, "");
    const datePattern = /\b(?:19|20)\d{2}[./-]\d{1,2}[./-]\d{1,2}\b/;
    const timePattern = /\b\d{1,2}:\d{2}(?::\d{2})?\b/;
    const phonePattern = /(?:0\d{1,2}[-.\s]?\d{3,4}[-.\s]?\d{4})/;
    const referencePattern = /\b(?:no|번호|주문|거래|승인)\s*[:#-]?\s*\d+/i;
    const metadataPrefixPattern = /^[|:#※]/;

    if (!readableName) return true;
    if (nonProductKeywords.some((keyword) => compact.includes(keyword))) return true;
    if (datePattern.test(row) || timePattern.test(row)) return true;
    if (phonePattern.test(row) || referencePattern.test(row)) return true;
    if (metadataPrefixPattern.test(row)) return true;
    return false;
  }

  function parseText(text) {
    const rows = text.split(/\r?\n/).map((row) => row.trim()).filter(Boolean);
    const pricePattern = /(\d{1,3}(?:,\d{3})+|\d{3,})\s*(?:원)?$/;
    const parsed = [];
    let filteredCount = 0;

    rows.forEach((row) => {
      const matched = row.match(pricePattern);
      if (!matched) return;
      const amount = Number(matched[1].replaceAll(",", ""));
      let name = row.slice(0, matched.index).trim().replace(/[-:]+$/, "").trim();
      if (!name || !amount) return;
      if (isNonProductRow(row, name)) {
        filteredCount += 1;
        return;
      }
      const quantityMatch = name.match(/(?:x|X|\*)\s*(\d+)|(\d+)\s*개/);
      const quantity = quantityMatch ? Number(quantityMatch[1] || quantityMatch[2]) : 1;
      name = name.replace(/(?:x|X|\*)\s*\d+|\d+\s*개/, "").trim() || "인식 항목";
      parsed.push({ name, quantity, unitPrice: Math.round(amount / quantity), amount });
    });

    items = parsed;
    if (items.length === 0) addRow("직접 입력 항목", 1, 0);
    else renderTable();
    $("receiptNotice").textContent = filteredCount
      ? `상품이 아닌 것으로 보이는 ${format.format(filteredCount)}개 줄은 제외했습니다. 남은 항목과 금액을 원본 영수증과 대조해 주세요.`
      : defaultNotice;
  }

  async function processFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      $("receiptError").textContent = "이미지 파일만 선택할 수 있습니다.";
      $("receiptError").hidden = false;
      return;
    }
    if (!window.Tesseract) {
      $("receiptError").textContent = "OCR 라이브러리를 불러오지 못했습니다. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.";
      $("receiptError").hidden = false;
      return;
    }

    $("receiptError").hidden = true;
    $("progressBar").style.width = "4%";
    $("progressLabel").textContent = "이미지 분석을 준비하고 있습니다.";
    setState("processing");
    try {
      const result = await window.Tesseract.recognize(file, "kor+eng", {
        logger(message) {
          if (message.status === "recognizing text") {
            const progress = Math.max(4, Math.round((message.progress || 0) * 100));
            $("progressBar").style.width = `${progress}%`;
            $("progressLabel").textContent = `문자를 읽는 중입니다. ${progress}%`;
          }
        }
      });
      parseText(result.data.text || "");
      setState("result");
    } catch (error) {
      console.error(error);
      setState("upload");
      $("receiptError").textContent = "이미지를 분석하지 못했습니다. 더 선명한 사진으로 다시 시도해 주세요.";
      $("receiptError").hidden = false;
    }
  }

  function reset() {
    items = [];
    $("receiptFile").value = "";
    $("receiptError").hidden = true;
    $("receiptNotice").textContent = defaultNotice;
    setState("upload");
  }

  function downloadExcel() {
    if (!items.length || !window.XLSX) {
      $("receiptNotice").textContent = "엑셀 저장 기능을 불러오지 못했습니다. 인터넷 연결 후 다시 시도해 주세요.";
      return;
    }
    const data = items.map((item) => ({
      "상품명": item.name,
      "수량": item.quantity,
      "단가": item.unitPrice,
      "금액": item.amount
    }));
    data.push({ "상품명": "합계", "수량": "", "단가": "", "금액": items.reduce((sum, item) => sum + item.amount, 0) });
    const sheet = window.XLSX.utils.json_to_sheet(data);
    const book = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(book, sheet, "영수증 내역");
    window.XLSX.writeFile(book, `영수증_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  function init() {
    if (!$("receiptTool")) return;
    const dropzone = $("dropzone");
    $("chooseReceipt").addEventListener("click", () => $("receiptFile").click());
    $("receiptFile").addEventListener("change", (event) => processFile(event.target.files[0]));
    $("addReceiptRow").addEventListener("click", () => addRow("새 항목", 1, 0));
    $("resetReceipt").addEventListener("click", reset);
    $("downloadReceipt").addEventListener("click", downloadExcel);

    ["dragenter", "dragover"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropzone.classList.add("dragover");
      });
    });
    ["dragleave", "drop"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropzone.classList.remove("dragover");
      });
    });
    dropzone.addEventListener("drop", (event) => processFile(event.dataTransfer.files[0]));
  }

  document.addEventListener("DOMContentLoaded", init);
}());
