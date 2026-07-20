(() => {
  "use strict";

  const STORAGE_KEY = "sutra-recitation-records-v1";
  const config = window.APP_CONFIG || {};
  const hasCloudConfig = Boolean(config.SUPABASE_URL && config.SUPABASE_ANON_KEY && window.supabase);
  const client = hasCloudConfig
    ? window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY)
    : null;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const elements = {
    modeBadge: $("#mode-badge"),
    todayTotal: $("#today-total"),
    allTotal: $("#all-total"),
    recordForm: $("#record-form"),
    lookupForm: $("#lookup-form"),
    count: $("#count"),
    recitedAt: $("#recited-at"),
    recordMessage: $("#record-message"),
    lookupMessage: $("#lookup-message"),
    lookupResult: $("#lookup-result"),
    personalTotal: $("#personal-total"),
    recordList: $("#record-list"),
    submitButton: $("#submit-button"),
    lookupButton: $("#lookup-button"),
    dialog: $("#success-dialog"),
    successCopy: $("#success-copy")
  };

  function setModeBadge() {
    if (hasCloudConfig) {
      elements.modeBadge.textContent = "雲端資料庫模式";
      elements.modeBadge.classList.add("cloud");
    } else {
      elements.modeBadge.textContent = "公開示範模式 · 資料僅存本機";
    }
  }

  function toLocalDateTimeInput(date = new Date()) {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }

  function normalizeEmail(value) {
    return value.trim().toLowerCase();
  }

  function normalizePhone(value) {
    let digits = value.replace(/\D/g, "");
    if (digits.startsWith("00886")) digits = `0${digits.slice(5)}`;
    else if (digits.startsWith("886")) digits = `0${digits.slice(3)}`;
    return digits;
  }

  async function sha256(value) {
    const bytes = new TextEncoder().encode(value);
    const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  async function contactHash(email, phone) {
    return sha256(`${normalizeEmail(email)}|${normalizePhone(phone)}`);
  }

  function getLocalRecords() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveLocalRecords(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  function isSameLocalDay(dateA, dateB = new Date()) {
    const a = new Date(dateA);
    return a.getFullYear() === dateB.getFullYear()
      && a.getMonth() === dateB.getMonth()
      && a.getDate() === dateB.getDate();
  }

  function renderStats(records = getLocalRecords()) {
    const all = records.reduce((sum, item) => sum + Number(item.count || 0), 0);
    const today = records
      .filter((item) => isSameLocalDay(item.recited_at))
      .reduce((sum, item) => sum + Number(item.count || 0), 0);
    elements.allTotal.textContent = all.toLocaleString("zh-TW");
    elements.todayTotal.textContent = today.toLocaleString("zh-TW");
  }

  function setMessage(element, text, success = false) {
    element.textContent = text;
    element.classList.toggle("success", success);
  }

  function setBusy(button, busy, originalText) {
    button.disabled = busy;
    if (originalText) button.dataset.originalText = originalText;
    if (busy && button === elements.lookupButton) button.textContent = "查詢中…";
    if (!busy && button === elements.lookupButton) button.textContent = button.dataset.originalText || "查詢我的紀錄";
  }

  function validateContact(email, phone) {
    if (!/^\S+@\S+\.\S+$/.test(normalizeEmail(email))) return "請輸入有效的 Email。";
    if (normalizePhone(phone).length < 8) return "請輸入有效的電話號碼。";
    return "";
  }

  async function submitRecord(payload) {
    if (hasCloudConfig) {
      const { error } = await client.from("baoqie_recitations").insert(payload);
      if (error) throw new Error(error.message);
      return;
    }

    const records = getLocalRecords();
    records.push({
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...payload
    });
    saveLocalRecords(records);
    renderStats(records);
  }

  async function lookupRecords(hash) {
    if (hasCloudConfig) {
      const { data, error } = await client.rpc("lookup_baoqie_recitations", { p_contact_hash: hash });
      if (error) throw new Error(error.message);
      return data || [];
    }
    return getLocalRecords().filter((item) => item.contact_hash === hash);
  }

  function renderRecordList(records) {
    elements.recordList.replaceChildren();
    const sorted = [...records].sort((a, b) => new Date(b.recited_at) - new Date(a.recited_at));

    sorted.forEach((record) => {
      const item = document.createElement("article");
      item.className = "record-item";

      const date = new Date(record.recited_at);
      const title = document.createElement("div");
      title.innerHTML = `<strong>${escapeHtml(record.name)}</strong><br><time>${date.toLocaleString("zh-TW", { dateStyle: "medium", timeStyle: "short" })}</time>`;

      const count = document.createElement("strong");
      count.textContent = `${Number(record.count).toLocaleString("zh-TW")} 遍`;

      const note = document.createElement("small");
      note.textContent = "一切如來心秘密全身舍利寶篋印陀羅尼";

      item.append(title, count, note);
      elements.recordList.append(item);
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[char]);
  }

  $$(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;
      $$(".tab").forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
      });
      ["record", "lookup"].forEach((name) => {
        const panel = $(`#${name}-panel`);
        const active = name === target;
        panel.hidden = !active;
        panel.classList.toggle("active", active);
      });
    });
  });

  $$("[data-count]").forEach((button) => {
    button.addEventListener("click", () => {
      elements.count.value = button.dataset.count;
      $$("[data-count]").forEach((item) => item.classList.toggle("selected", item === button));
    });
  });

  $("#minus-count").addEventListener("click", () => {
    elements.count.value = Math.max(1, Number(elements.count.value || 1) - 1);
  });

  $("#plus-count").addEventListener("click", () => {
    elements.count.value = Math.min(1000000, Number(elements.count.value || 0) + 1);
  });

  elements.recordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage(elements.recordMessage, "");

    const name = $("#name").value.trim();
    const count = Number(elements.count.value);
    const email = $("#email").value;
    const phone = $("#phone").value;
    const recitedAt = elements.recitedAt.value;
    const consent = $("#consent").checked;

    if (!name) return setMessage(elements.recordMessage, "請填寫姓名或稱呼。");
    if (!Number.isInteger(count) || count < 1 || count > 1000000) return setMessage(elements.recordMessage, "念誦次數需為 1 至 1,000,000 的整數。");
    const contactError = validateContact(email, phone);
    if (contactError) return setMessage(elements.recordMessage, contactError);
    if (!recitedAt) return setMessage(elements.recordMessage, "請選擇念誦時間。");
    if (!consent) return setMessage(elements.recordMessage, "請先勾選資料使用同意。");

    elements.submitButton.disabled = true;
    setMessage(elements.recordMessage, "正在登錄…");

    try {
      const hash = await contactHash(email, phone);
      await submitRecord({
        name,
        count,
        recited_at: new Date(recitedAt).toISOString(),
        contact_hash: hash
      });
      setMessage(elements.recordMessage, "念誦紀錄已成功登錄。", true);
      elements.successCopy.textContent = `${name}，本次已登錄 ${count.toLocaleString("zh-TW")} 遍。願善念增長，所願吉祥。`;
      elements.dialog.hidden = false;
      elements.recordForm.reset();
      elements.count.value = 108;
      elements.recitedAt.value = toLocalDateTimeInput();
      $$("[data-count]").forEach((item) => item.classList.toggle("selected", item.dataset.count === "108"));
    } catch (error) {
      console.error(error);
      setMessage(elements.recordMessage, "登錄失敗，請稍後再試或確認資料庫設定。");
    } finally {
      elements.submitButton.disabled = false;
    }
  });

  elements.lookupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    elements.lookupResult.hidden = true;
    setMessage(elements.lookupMessage, "");

    const email = $("#lookup-email").value;
    const phone = $("#lookup-phone").value;
    const contactError = validateContact(email, phone);
    if (contactError) return setMessage(elements.lookupMessage, contactError);

    setBusy(elements.lookupButton, true, "查詢我的紀錄");
    setMessage(elements.lookupMessage, "正在安全查詢…");

    try {
      const hash = await contactHash(email, phone);
      const records = await lookupRecords(hash);
      if (!records.length) {
        setMessage(elements.lookupMessage, "找不到相符紀錄，請確認 Email 與電話是否與登錄時一致。");
        return;
      }
      const total = records.reduce((sum, item) => sum + Number(item.count || 0), 0);
      elements.personalTotal.textContent = total.toLocaleString("zh-TW");
      renderRecordList(records);
      elements.lookupResult.hidden = false;
      setMessage(elements.lookupMessage, `共找到 ${records.length} 筆紀錄。`, true);
    } catch (error) {
      console.error(error);
      setMessage(elements.lookupMessage, "查詢失敗，請稍後再試或確認資料庫設定。");
    } finally {
      setBusy(elements.lookupButton, false);
    }
  });

  $("#close-dialog").addEventListener("click", () => { elements.dialog.hidden = true; });
  $(".dialog-backdrop").addEventListener("click", () => { elements.dialog.hidden = true; });

  elements.recitedAt.value = toLocalDateTimeInput();
  $("[data-count='108']").classList.add("selected");
  setModeBadge();
  renderStats();
})();
