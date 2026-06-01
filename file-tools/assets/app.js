const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1200);
}

function setupDropzone(zone, input, callback) {
  if (!zone || !input) return;
  zone.addEventListener("click", () => input.click());
  input.addEventListener("change", () => callback([...input.files]));
  ["dragenter", "dragover"].forEach((eventName) => {
    zone.addEventListener(eventName, (event) => {
      event.preventDefault();
      zone.classList.add("dragover");
    });
  });
  ["dragleave", "drop"].forEach((eventName) => {
    zone.addEventListener(eventName, (event) => {
      event.preventDefault();
      zone.classList.remove("dragover");
    });
  });
  zone.addEventListener("drop", (event) => callback([...event.dataTransfer.files]));
}

function setStatus(text) {
  const target = $("#status");
  if (target) target.textContent = text;
}

async function imageToBlob(file, maxWidth, quality, mime = "image/jpeg") {
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * ratio);
  const height = Math.round(bitmap.height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, width, height);
  return await new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
}

function initImageOptimizer() {
  const input = $("#imageInput");
  const zone = $("#imageDropzone");
  const maxWidth = $("#maxWidth");
  const maxWidthValue = $("#maxWidthValue");
  const quality = $("#quality");
  const qualityValue = $("#qualityValue");
  let originalFile = null;
  let optimizedBlob = null;

  const sync = (fromRange = true) => {
    if (fromRange) {
      maxWidthValue.value = maxWidth.value;
      qualityValue.value = quality.value;
    } else {
      maxWidth.value = maxWidthValue.value;
      quality.value = qualityValue.value;
    }
  };

  async function process() {
    if (!originalFile) return;
    setStatus("이미지를 최적화하는 중입니다.");
    optimizedBlob = await imageToBlob(originalFile, Number(maxWidth.value), Number(quality.value) / 100);
    $("#optimizedPreview").src = URL.createObjectURL(optimizedBlob);
    $("#optimizedSize").textContent = formatBytes(optimizedBlob.size);
    $("#savingRate").textContent = `${Math.max(0, ((originalFile.size - optimizedBlob.size) / originalFile.size) * 100).toFixed(1)}%`;
    $("#downloadImage").disabled = false;
    setStatus("최적화가 완료되었습니다.");
  }

  setupDropzone(zone, input, (files) => {
    const file = files.find((item) => item.type.startsWith("image/"));
    if (!file) return setStatus("JPG, PNG, WebP 같은 이미지 파일을 선택해 주세요.");
    originalFile = file;
    $("#fileName").textContent = file.name;
    $("#originalSize").textContent = formatBytes(file.size);
    $("#originalPreview").src = URL.createObjectURL(file);
    $("#resultPanel").classList.remove("hidden");
    $("#imagePlaceholder")?.classList.add("hidden");
    process();
  });

  [maxWidth, quality].forEach((el) => el?.addEventListener("input", () => { sync(true); process(); }));
  [maxWidthValue, qualityValue].forEach((el) => el?.addEventListener("input", () => { sync(false); process(); }));
  $("#downloadImage")?.addEventListener("click", () => {
    if (optimizedBlob && originalFile) downloadBlob(optimizedBlob, `optimized_${originalFile.name.replace(/\.[^.]+$/, "")}.jpg`);
  });
}

function initExifRemover() {
  const input = $("#exifInput");
  const zone = $("#exifDropzone");
  const list = $("#exifList");

  setupDropzone(zone, input, async (files) => {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (!images.length) return setStatus("이미지 파일을 선택해 주세요.");
    $("#exifPlaceholder")?.classList.add("hidden");
    list.innerHTML = "";
    setStatus("메타데이터를 확인하고 제거하는 중입니다.");
    for (const file of images) {
      const item = document.createElement("div");
      item.className = "file-item";
      item.innerHTML = `<div class="file-head"><strong>${file.name}</strong><span class="small">${formatBytes(file.size)}</span></div><div class="small">분석 중...</div>`;
      list.appendChild(item);

      let metadataCount = 0;
      if (window.ExifReader) {
        try {
          const tags = await ExifReader.load(file);
          metadataCount = Object.keys(tags).length;
        } catch {
          metadataCount = 0;
        }
      }

      const cleaned = await imageToBlob(file, 10000, 0.92);
      const button = document.createElement("button");
      button.className = "btn";
      button.textContent = "EXIF 제거본 다운로드";
      button.addEventListener("click", () => downloadBlob(cleaned, `clean_${file.name.replace(/\.[^.]+$/, "")}.jpg`));
      item.innerHTML = `<div class="file-head"><strong>${file.name}</strong><span class="small">${formatBytes(file.size)} → ${formatBytes(cleaned.size)}</span></div><p class="small">감지된 메타데이터 ${metadataCount}개. 캔버스 재저장으로 EXIF/GPS/카메라 정보를 제거했습니다.</p>`;
      item.appendChild(button);
    }
    setStatus("EXIF 제거 준비가 완료되었습니다.");
  });
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

async function loadBitmapFromFile(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

function extractPaletteFromImage(img, limit = 8, stepSize = 32) {
  const canvas = document.createElement("canvas");
  const max = 480;
  const ratio = Math.min(1, max / img.width);
  canvas.width = Math.max(1, Math.round(img.width * ratio));
  canvas.height = Math.max(1, Math.round(img.height * ratio));
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const map = new Map();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 160) continue;
    const r = Math.floor(data[i] / stepSize) * stepSize;
    const g = Math.floor(data[i + 1] / stepSize) * stepSize;
    const b = Math.floor(data[i + 2] / stepSize) * stepSize;
    const key = `${r},${g},${b}`;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key]) => {
      const [r, g, b] = key.split(",").map(Number);
      return { r, g, b, hex: rgbToHex(r, g, b) };
    });
}

function renderSwatches(container, colors, onPick) {
  if (!container) return;
  container.innerHTML = "";
  colors.forEach((color) => {
    const button = document.createElement("button");
    button.className = "swatch";
    button.type = "button";
    button.title = `${color.hex} 복사`;
    button.style.background = color.hex;
    button.addEventListener("click", () => onPick?.(color));
    container.appendChild(button);
  });
}

function fitCanvasToImage(canvas, img, maxWidth = 720) {
  const ratio = Math.min(1, maxWidth / img.width);
  canvas.width = Math.max(1, Math.round(img.width * ratio));
  canvas.height = Math.max(1, Math.round(img.height * ratio));
  return ratio;
}

function initLogoConverter() {
  const input = $("#logoInput");
  const zone = $("#logoDropzone");
  const canvas = $("#logoCanvas");
  const ctx = canvas?.getContext("2d");
  const placeholder = $("#logoPlaceholder");
  let originalImage = null;
  let mode = "threshold";

  function convert() {
    if (!originalImage || !canvas || !ctx) return;
    fitCanvasToImage(canvas, originalImage);
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = r * 0.299 + g * 0.587 + b * 0.114;
      if (mode === "gray") {
        data[i] = data[i + 1] = data[i + 2] = gray;
      } else {
        const bw = gray > (mode === "mono" ? 205 : 128) ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = bw;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    $("#downloadLogo").disabled = false;
    placeholder?.classList.add("hidden");
    setStatus("로고 변환 결과가 준비되었습니다.");
  }

  setupDropzone(zone, input, async (files) => {
    const file = files.find((item) => item.type.startsWith("image/"));
    if (!file) return setStatus("이미지 파일을 선택해 주세요.");
    originalImage = await loadBitmapFromFile(file);
    renderSwatches($("#logoPalette"), extractPaletteFromImage(originalImage, 6, 24), (color) => navigator.clipboard?.writeText(color.hex));
    convert();
  });

  $$("[data-logo-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      mode = button.dataset.logoMode;
      $$("[data-logo-mode]").forEach((item) => item.classList.toggle("active", item === button));
      convert();
    });
  });

  $("#downloadLogo")?.addEventListener("click", () => {
    canvas.toBlob((blob) => blob && downloadBlob(blob, `converted_logo_${mode}.png`), "image/png");
  });
  $("#resetLogo")?.addEventListener("click", () => {
    originalImage = null;
    input.value = "";
    $("#downloadLogo").disabled = true;
    $("#logoPalette").innerHTML = "";
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    placeholder?.classList.remove("hidden");
    setStatus("로고 이미지를 선택해 주세요.");
  });
}

function initColorPicker() {
  const input = $("#colorInput");
  const zone = $("#colorDropzone");
  const canvas = $("#colorCanvas");
  const ctx = canvas?.getContext("2d");
  const preview = $("#colorPreviewDot");
  let scaleRatio = 1;
  let selected = { hex: "#FFFFFF", rgb: "255, 255, 255" };

  function setPicked(r, g, b) {
    selected = { hex: rgbToHex(r, g, b), rgb: `${r}, ${g}, ${b}` };
    $("#pickedHex").textContent = selected.hex;
    $("#pickedRgb").textContent = selected.rgb;
    $("#pickedLabel").style.color = selected.hex;
    $("#pickedLabel").textContent = selected.hex;
  }

  setupDropzone(zone, input, async (files) => {
    const file = files.find((item) => item.type.startsWith("image/"));
    if (!file) return setStatus("이미지 파일을 선택해 주세요.");
    const img = await loadBitmapFromFile(file);
    scaleRatio = fitCanvasToImage(canvas, img, 720);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    $("#colorPlaceholder")?.classList.add("hidden");
    const palette = extractPaletteFromImage(img, 10, 32);
    renderSwatches($("#extractedColors"), palette, (color) => {
      setPicked(color.r, color.g, color.b);
      navigator.clipboard?.writeText(color.hex);
    });
    if (palette[0]) setPicked(palette[0].r, palette[0].g, palette[0].b);
    setStatus("이미지를 클릭해 색상을 추출하세요.");
  });

  function pickFromEvent(event, showPreview = false) {
    if (!canvas.width || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(canvas.width - 1, Math.floor((event.clientX - rect.left) * (canvas.width / rect.width))));
    const y = Math.max(0, Math.min(canvas.height - 1, Math.floor((event.clientY - rect.top) * (canvas.height / rect.height))));
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    if (showPreview && preview) {
      preview.style.left = `${event.clientX - rect.left}px`;
      preview.style.top = `${event.clientY - rect.top}px`;
      preview.style.background = rgbToHex(r, g, b);
      preview.classList.remove("hidden");
    }
    return { r, g, b };
  }

  canvas?.addEventListener("mousemove", (event) => pickFromEvent(event, true));
  canvas?.addEventListener("mouseleave", () => preview?.classList.add("hidden"));
  canvas?.addEventListener("click", (event) => {
    const color = pickFromEvent(event);
    if (color) setPicked(color.r, color.g, color.b);
  });
  $("#copyHex")?.addEventListener("click", () => navigator.clipboard?.writeText(selected.hex));
  $("#copyRgb")?.addEventListener("click", () => navigator.clipboard?.writeText(selected.rgb));
}

function initKoreanCounter() {
  const input = $("#textInput");
  const examples = {
    blog: "오늘은 이미지 최적화와 색상 추출 도구를 테스트하고 있습니다. 글자수를 확인하면 블로그 원고 길이를 조절하기 쉽습니다.",
    email: "안녕하세요. 요청하신 자료를 확인했습니다. 추가로 필요한 내용이 있으면 편하게 말씀해 주세요.",
    intro: "저는 사용자가 이해하기 쉬운 도구를 만드는 일에 관심이 많습니다. 문제를 작게 나누고, 실제로 작동하는 결과를 빠르게 확인하는 방식을 좋아합니다."
  };

  function update() {
    const text = input.value;
    $("#withSpace").textContent = text.length.toLocaleString("ko-KR");
    $("#withoutSpace").textContent = text.replace(/\s/g, "").length.toLocaleString("ko-KR");
    $("#bytes").textContent = new Blob([text]).size.toLocaleString("ko-KR");
    $("#words").textContent = text.trim() ? text.trim().split(/\s+/).length.toLocaleString("ko-KR") : "0";
  }

  input?.addEventListener("input", update);
  $("#clearText")?.addEventListener("click", () => {
    input.value = "";
    update();
  });
  $$("[data-example]").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = examples[button.dataset.example] || examples.blog;
      update();
    });
  });
  update();
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "image") initImageOptimizer();
  if (page === "exif") initExifRemover();
  if (page === "logo") initLogoConverter();
  if (page === "color") initColorPicker();
  if (page === "counter") initKoreanCounter();
});
