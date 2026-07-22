(() => {
  "use strict";

  const STORAGE_KEY = "sutra-recitation-records-v2";
  const LANGUAGE_STORAGE_KEY = "baoqie-interface-language-v1";
  const SUPPORTED_LANGUAGES = ["zh-TW", "en", "ja"];
  const RECORD_TYPES = ["sutra", "dharani", "title"];
  const config = window.APP_CONFIG || {};
  const hasCloudConfig = Boolean(config.SUPABASE_URL && config.SUPABASE_ANON_KEY && window.supabase);
  const client = hasCloudConfig
    ? window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY)
    : null;

  const translations = {
    "zh-TW": {
      metaTitle: "寶篋印念誦｜Baoqie Recite",
      metaDescription: "一切如來心秘密全身舍利寶篋印陀羅尼念誦登錄與查詢平台",
      languageSwitcherLabel: "語言切換",
      brand: "寶篋印念誦 · Baoqie Recite",
      titleLine1: "一切如來心秘密全身舍利",
      titleLine2: "寶篋印陀羅尼",
      heroCopy: "以恭敬心記錄每一次念誦，將清淨善念回向一切眾生。",
      campaignAria: "活動說明",
      campaignTitle: "［虔誦經題求加被・千經萬咒祈和平］",
      campaignText: "誦經、持咒、誦經題活動，廣邀大家共襄盛舉。",
      modeChecking: "正在確認資料模式…",
      cloudMode: "雲端資料庫模式",
      demoMode: "公開示範模式 · 資料僅存本機",
      summaryAria: "共同念誦統計",
      participantLabel: "累計參與",
      recitationLabel: "累計念誦",
      recordLabel: "登錄紀錄",
      personUnit: "人",
      recitationUnit: "遍",
      recordUnit: "筆",
      summaryCaption: "每一次念誦，都是共同願行的一部分。",
      mainNavAria: "主要功能",
      tabRecord: "念誦登錄",
      tabLookup: "查詢紀錄",
      recordKicker: "Record",
      recordTitle: "登錄這一次的念誦",
      recordIntro: "請選擇記錄類型，並填寫基本資料與本次持誦次數。時間將自動記錄，也可自行調整。",
      nameLabel: "姓名或稱呼",
      namePlaceholder: "例如：李○○",
      recordTypeLabel: "記錄類型",
      recordTypePlaceholder: "請選擇記錄類型",
      recordTypeSutra: "誦經：一切如來心秘密全身舍利寶篋印陀羅尼經",
      recordTypeDharani: "持咒：一切如來心秘密全身舍利寶篋印陀羅尼",
      recordTypeTitle: "持誦經題：一切如來心秘密全身舍利寶篋印陀羅尼經會上佛菩薩",
      legacyRecordType: "未分類（舊紀錄）",
      interfaceLanguageLabel: "登錄介面",
      interfaceLanguageZh: "繁體中文",
      interfaceLanguageEn: "English",
      interfaceLanguageJa: "日本語",
      legacyInterfaceLanguage: "未知介面（舊紀錄）",
      countLabel: "本次念誦次數",
      quickCountAria: "快速選擇念誦次數",
      decreaseCount: "減少一次",
      increaseCount: "增加一次",
      emailLabel: "Email",
      emailPlaceholder: "用於日後核對查詢",
      phoneLabel: "電話",
      phonePlaceholder: "例如：0912 345 678",
      timeLabel: "念誦時間",
      privacySummary: "個人資料使用說明",
      privacyText: "本平台蒐集姓名或稱呼、記錄類型、使用介面語言、Email、電話、持誦次數及持誦時間，用於本人紀錄查詢、整體統計、語言使用分析、資料備份及必要聯繫。Email 與電話將分別保存於受權限保護的資料庫，不會在公開頁面顯示；系統另以不可逆識別碼核對本人查詢。",
      consentText: "我已閱讀並同意上述資料使用方式，並了解可向平台管理者申請查詢、更正或刪除個人資料。",
      submitLabel: "登錄念誦",
      submitSubtext: "願以此功德，普及於一切",
      lookupKicker: "History",
      lookupTitle: "查詢我的念誦紀錄",
      lookupIntro: "請輸入登錄時使用的 Email 與電話，兩者需同時相符，才能查看紀錄。",
      lookupEmailPlaceholder: "登錄時使用的 Email",
      lookupPhonePlaceholder: "登錄時使用的電話",
      lookupButton: "查詢我的紀錄",
      personalTotalLabel: "您的累積念誦",
      dedicationMark: "願",
      dedicationTitle: "回向偈",
      dedicationText: "願以此功德，莊嚴佛淨土；上報四重恩，下濟三途苦。若有見聞者，悉發菩提心；盡此一報身，同生極樂國。",
      footer1: "本平台僅作念誦紀錄，不代表寺院、法會或宗教團體認證。",
      footer2: "Email 與電話不會在公開頁面顯示；完整資料僅供授權管理、備份與必要聯繫使用。",
      dialogKicker: "已圓滿登錄",
      dialogTitle: "感恩您的發心",
      continueButton: "繼續念誦",
      scriptureName: "一切如來心秘密全身舍利寶篋印陀羅尼",
      lookupBusy: "查詢中…",
      errName: "請填寫姓名或稱呼。",
      errRecordType: "請選擇記錄類型。",
      errCount: "念誦次數需為 1 至 1,000,000 的整數。",
      errEmail: "請輸入有效的 Email。",
      errPhone: "請輸入有效的電話號碼。",
      errTime: "請選擇念誦時間。",
      errConsent: "請先勾選資料使用同意。",
      registering: "正在登錄…",
      recordSuccess: "念誦紀錄已成功登錄。",
      recordFailed: "登錄失敗，請稍後再試或確認資料庫設定。",
      lookupSearching: "正在安全查詢…",
      lookupNotFound: "找不到相符紀錄，請確認 Email 與電話是否與登錄時一致。",
      lookupFound: "共找到 {count} 筆紀錄。",
      lookupFailed: "查詢失敗，請稍後再試或確認資料庫設定。",
      community: "目前已有 {participants} 位參與者，共同累積 {total} 遍。",
      successCopy: "{name}，本次已登錄「{type}」{count} 遍。{community}",
      auspiciousFallback: "願善念增長，所願吉祥。",
      quickCount: "{count} 遍",
      recordCountText: "{count} 遍"
    },
    en: {
      metaTitle: "Baoqie Recite｜Recitation Record",
      metaDescription: "A recitation record and lookup platform for the Dhāraṇī of the Secret Whole-Body Relics of the Heart of All Tathāgatas.",
      languageSwitcherLabel: "Language selector",
      brand: "Baoqie Recite",
      titleLine1: "Dhāraṇī of the Secret Whole-Body Relics",
      titleLine2: "of the Heart of All Tathāgatas",
      heroCopy: "Record each recitation with reverence and dedicate every wholesome aspiration to all beings.",
      campaignAria: "Campaign information",
      campaignTitle: "[Recite Sutra Titles with Devotion for Blessings · A Thousand Sutras and Ten Thousand Mantras for Peace]",
      campaignText: "Everyone is warmly invited to join the sutra recitation, mantra recitation, and sutra-title recitation campaign.",
      modeChecking: "Checking data mode…",
      cloudMode: "Cloud database mode",
      demoMode: "Public demo · Data stored only on this device",
      summaryAria: "Community recitation statistics",
      participantLabel: "Participants",
      recitationLabel: "Recitations",
      recordLabel: "Records",
      personUnit: "people",
      recitationUnit: "times",
      recordUnit: "records",
      summaryCaption: "Every recitation becomes part of our shared aspiration.",
      mainNavAria: "Main functions",
      tabRecord: "Record Recitation",
      tabLookup: "View Records",
      recordKicker: "Record",
      recordTitle: "Record this recitation",
      recordIntro: "Select a record type, then enter your basic information and recitation count. The time is filled in automatically and can be adjusted.",
      nameLabel: "Name or preferred name",
      namePlaceholder: "For example: Li",
      recordTypeLabel: "Record type",
      recordTypePlaceholder: "Select a record type",
      recordTypeSutra: "Sutra: The Sutra of the Dhāraṇī of the Secret Whole-Body Relics of the Heart of All Tathāgatas",
      recordTypeDharani: "Mantra: Dhāraṇī of the Secret Whole-Body Relics of the Heart of All Tathāgatas",
      recordTypeTitle: "Sutra title: Buddhas and Bodhisattvas in the Assembly of the Sutra of the Dhāraṇī of the Secret Whole-Body Relics of the Heart of All Tathāgatas",
      legacyRecordType: "Unclassified legacy record",
      interfaceLanguageLabel: "Interface used",
      interfaceLanguageZh: "Traditional Chinese",
      interfaceLanguageEn: "English",
      interfaceLanguageJa: "Japanese",
      legacyInterfaceLanguage: "Unknown interface (legacy record)",
      countLabel: "Number of recitations",
      quickCountAria: "Quickly select a recitation count",
      decreaseCount: "Decrease by one",
      increaseCount: "Increase by one",
      emailLabel: "Email",
      emailPlaceholder: "Used to verify your records later",
      phoneLabel: "Phone",
      phonePlaceholder: "For example: +886 912 345 678",
      timeLabel: "Recitation time",
      privacySummary: "Personal data notice",
      privacyText: "This platform collects your name or preferred name, record type, interface language, email, phone number, recitation count, and recitation time for personal record lookup, overall statistics, language-use analysis, data backup, and necessary contact. Email and phone are stored separately in an access-protected database and are never shown publicly. An irreversible identifier is also used to verify personal lookups.",
      consentText: "I have read and agree to the data use described above, and understand that I may request access, correction, or deletion from the platform administrator.",
      submitLabel: "Record Recitation",
      submitSubtext: "May this merit benefit all beings",
      lookupKicker: "History",
      lookupTitle: "View my recitation records",
      lookupIntro: "Enter the same email and phone number used when recording. Both must match to view your records.",
      lookupEmailPlaceholder: "Email used when recording",
      lookupPhonePlaceholder: "Phone used when recording",
      lookupButton: "View My Records",
      personalTotalLabel: "Your total recitations",
      dedicationMark: "願",
      dedicationTitle: "Dedication of Merit",
      dedicationText: "May the merit from this practice adorn the Pure Land of the Buddhas; repay the fourfold kindness above and relieve the suffering of the three lower realms below. May all who see or hear of this awaken the bodhi mind; and when this life ends, may we be born together in the Land of Ultimate Bliss.",
      footer1: "This platform is for recitation records only and does not represent certification by a temple, Dharma assembly, or religious organization.",
      footer2: "Email and phone are never displayed publicly. Complete data is used only for authorized administration, backup, and necessary contact.",
      dialogKicker: "Successfully Recorded",
      dialogTitle: "Thank you for your aspiration",
      continueButton: "Continue Reciting",
      scriptureName: "Dhāraṇī of the Secret Whole-Body Relics of the Heart of All Tathāgatas",
      lookupBusy: "Searching…",
      errName: "Please enter your name or preferred name.",
      errRecordType: "Please select a record type.",
      errCount: "The recitation count must be an integer from 1 to 1,000,000.",
      errEmail: "Please enter a valid email address.",
      errPhone: "Please enter a valid phone number.",
      errTime: "Please select the recitation time.",
      errConsent: "Please agree to the data use notice first.",
      registering: "Recording…",
      recordSuccess: "Your recitation has been recorded successfully.",
      recordFailed: "Recording failed. Please try again later or check the database settings.",
      lookupSearching: "Searching securely…",
      lookupNotFound: "No matching records were found. Check that the email and phone match your original entry.",
      lookupFound: "Records found: {count}.",
      lookupFailed: "The lookup failed. Please try again later or check the database settings.",
      community: "{participants} people have participated, with {total} recitations recorded together.",
      successCopy: '{name}, {count} recitations of \"{type}\" have been recorded. {community}',
      auspiciousFallback: "May wholesome aspirations grow and all wishes be fulfilled.",
      quickCount: "{count} times",
      recordCountText: "{count} recitations"
    },
    ja: {
      metaTitle: "宝篋印念誦｜Baoqie Recite",
      metaDescription: "一切如来心秘密全身舎利宝篋印陀羅尼の念誦記録・照会プラットフォーム",
      languageSwitcherLabel: "言語切り替え",
      brand: "宝篋印念誦 · Baoqie Recite",
      titleLine1: "一切如来心秘密全身舎利",
      titleLine2: "宝篋印陀羅尼",
      heroCopy: "一回一回の念誦を敬いの心で記録し、清らかな善念をすべての衆生に回向します。",
      campaignAria: "活動案内",
      campaignTitle: "［敬虔に経題を唱え加被を願う・千経万呪で平和を祈る］",
      campaignText: "読経・持呪・経題念誦の活動に、皆さまのご参加を心よりお待ちしています。",
      modeChecking: "データモードを確認しています…",
      cloudMode: "クラウドデータベースモード",
      demoMode: "公開デモ · データはこの端末のみに保存",
      summaryAria: "共同念誦の統計",
      participantLabel: "参加人数",
      recitationLabel: "累計念誦",
      recordLabel: "登録件数",
      personUnit: "人",
      recitationUnit: "遍",
      recordUnit: "件",
      summaryCaption: "一回一回の念誦が、共に育む願いの一部となります。",
      mainNavAria: "主な機能",
      tabRecord: "念誦を登録",
      tabLookup: "記録を照会",
      recordKicker: "記録",
      recordTitle: "今回の念誦を登録",
      recordIntro: "記録の種類を選び、基本情報と今回の念誦回数を入力してください。時刻は自動入力され、変更もできます。",
      nameLabel: "お名前または呼び名",
      namePlaceholder: "例：山田○○",
      recordTypeLabel: "記録の種類",
      recordTypePlaceholder: "記録の種類を選択してください",
      recordTypeSutra: "読経：一切如来心秘密全身舎利宝篋印陀羅尼経",
      recordTypeDharani: "持呪：一切如来心秘密全身舎利宝篋印陀羅尼",
      recordTypeTitle: "経題念誦：一切如来心秘密全身舎利宝篋印陀羅尼経会上仏菩薩",
      legacyRecordType: "未分類（旧記録）",
      interfaceLanguageLabel: "登録時の言語",
      interfaceLanguageZh: "繁体字中国語",
      interfaceLanguageEn: "英語",
      interfaceLanguageJa: "日本語",
      legacyInterfaceLanguage: "不明（旧記録）",
      countLabel: "今回の念誦回数",
      quickCountAria: "念誦回数をすばやく選択",
      decreaseCount: "1回減らす",
      increaseCount: "1回増やす",
      emailLabel: "メールアドレス",
      emailPlaceholder: "後日の照会確認に使用します",
      phoneLabel: "電話番号",
      phonePlaceholder: "例：090 1234 5678",
      timeLabel: "念誦した日時",
      privacySummary: "個人情報の利用について",
      privacyText: "本プラットフォームでは、お名前または呼び名、記録の種類、使用した画面言語、メールアドレス、電話番号、念誦回数、念誦日時を、ご本人の記録照会、全体統計、言語利用の分析、データのバックアップ、必要な連絡のために収集します。メールアドレスと電話番号はアクセス制限されたデータベースに別々に保存され、公開画面には表示されません。また、ご本人の照会確認には復元できない識別子を使用します。",
      consentText: "上記のデータ利用方法を読み、同意しました。また、管理者に個人情報の照会・訂正・削除を申請できることを理解しています。",
      submitLabel: "念誦を登録",
      submitSubtext: "この功徳を、すべてのものに",
      lookupKicker: "履歴",
      lookupTitle: "自分の念誦記録を照会",
      lookupIntro: "登録時に使用したメールアドレスと電話番号を入力してください。両方が一致した場合に記録を表示します。",
      lookupEmailPlaceholder: "登録時のメールアドレス",
      lookupPhonePlaceholder: "登録時の電話番号",
      lookupButton: "自分の記録を照会",
      personalTotalLabel: "あなたの累計念誦",
      dedicationMark: "願",
      dedicationTitle: "回向偈",
      dedicationText: "願わくはこの功徳をもって仏の浄土を荘厳し、上は四恩に報い、下は三途の苦を救わん。見聞するすべての者が菩提心を起こし、この一報身を尽くして、ともに極楽国に生まれんことを。",
      footer1: "本プラットフォームは念誦記録のためのものであり、寺院・法会・宗教団体による認定を示すものではありません。",
      footer2: "メールアドレスと電話番号は公開画面に表示されません。完全なデータは、権限を持つ管理、バックアップ、必要な連絡のみに使用されます。",
      dialogKicker: "登録が完了しました",
      dialogTitle: "尊い発心に感謝いたします",
      continueButton: "念誦を続ける",
      scriptureName: "一切如来心秘密全身舎利宝篋印陀羅尼",
      lookupBusy: "照会中…",
      errName: "お名前または呼び名を入力してください。",
      errRecordType: "記録の種類を選択してください。",
      errCount: "念誦回数は1から1,000,000までの整数で入力してください。",
      errEmail: "有効なメールアドレスを入力してください。",
      errPhone: "有効な電話番号を入力してください。",
      errTime: "念誦した日時を選択してください。",
      errConsent: "先に個人情報の利用に同意してください。",
      registering: "登録しています…",
      recordSuccess: "念誦記録を登録しました。",
      recordFailed: "登録できませんでした。しばらくしてから再度お試しいただくか、データベース設定をご確認ください。",
      lookupSearching: "安全に照会しています…",
      lookupNotFound: "一致する記録が見つかりません。登録時と同じメールアドレスと電話番号かご確認ください。",
      lookupFound: "{count}件の記録が見つかりました。",
      lookupFailed: "照会できませんでした。しばらくしてから再度お試しいただくか、データベース設定をご確認ください。",
      community: "現在{participants}人が参加し、合計{total}遍を記録しています。",
      successCopy: "{name}さん、今回は「{type}」を{count}遍記録しました。{community}",
      auspiciousFallback: "善き思いが育ち、願いが吉祥に結ばれますように。",
      quickCount: "{count}遍",
      recordCountText: "{count}遍"
    }
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const elements = {
    modeBadge: $("#mode-badge"),
    participantTotal: $("#participant-total"),
    allTotal: $("#all-total"),
    recordTotal: $("#record-total"),
    recordForm: $("#record-form"),
    recordType: $("#record-type"),
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


  const memoryStorage = new Map();

  function safeStorageGet(key) {
    try {
      return window.localStorage.getItem(key) ?? memoryStorage.get(key) ?? null;
    } catch {
      return memoryStorage.get(key) ?? null;
    }
  }

  function safeStorageSet(key, value) {
    memoryStorage.set(key, String(value));
    try {
      window.localStorage.setItem(key, String(value));
    } catch {
      // Some privacy modes block localStorage; the in-memory fallback still works for this visit.
    }
  }

  let currentLanguage = detectInitialLanguage();
  let latestStats = { participantCount: 0, recitationTotal: 0, recordCount: 0 };
  let lastLookupRecords = [];
  let lastSuccessContext = null;
  let lastPersonalTotal = 0;

  function detectInitialLanguage() {
    const saved = safeStorageGet(LANGUAGE_STORAGE_KEY);
    if (SUPPORTED_LANGUAGES.includes(saved)) return saved;

    const browserLanguages = Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language || ""];

    for (const language of browserLanguages) {
      const normalized = String(language).toLowerCase();
      if (normalized.startsWith("ja")) return "ja";
      if (normalized.startsWith("en")) return "en";
      if (normalized.startsWith("zh")) return "zh-TW";
    }
    return "zh-TW";
  }

  function t(key, variables = {}) {
    const dictionary = translations[currentLanguage] || translations["zh-TW"];
    const fallback = translations["zh-TW"][key] || key;
    const template = dictionary[key] ?? fallback;
    return String(template).replace(/\{(\w+)\}/g, (_, variable) => String(variables[variable] ?? ""));
  }

  function localeCode() {
    return currentLanguage === "zh-TW" ? "zh-TW" : currentLanguage === "ja" ? "ja-JP" : "en-US";
  }

  function formatNumber(value) {
    return Number(value || 0).toLocaleString(localeCode());
  }

  function applyLanguage(language, persist = true) {
    if (!SUPPORTED_LANGUAGES.includes(language)) return;
    currentLanguage = language;
    document.documentElement.lang = language === "zh-TW" ? "zh-Hant" : language;

    if (persist) safeStorageSet(LANGUAGE_STORAGE_KEY, language);

    $$('[data-i18n]').forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    $$('[data-i18n-placeholder]').forEach((element) => {
      element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
    });
    $$('[data-i18n-aria-label]').forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
    });
    $$('[data-language]').forEach((button) => {
      const active = button.dataset.language === language;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    $$('[data-count]').forEach((button) => {
      button.textContent = t("quickCount", { count: button.dataset.count });
    });

    document.title = t("metaTitle");
    const description = $('meta[name="description"]');
    if (description) description.setAttribute("content", t("metaDescription"));

    setModeBadge();
    renderStats(latestStats);
    if (lastLookupRecords.length) {
      renderRecordList(lastLookupRecords);
      elements.personalTotal.textContent = formatNumber(lastPersonalTotal);
    }
    if (lastSuccessContext && !elements.dialog.hidden) renderSuccessCopy(lastSuccessContext);

    elements.lookupButton.textContent = elements.lookupButton.disabled ? t("lookupBusy") : t("lookupButton");
    elements.submitButton.querySelector("span").textContent = t("submitLabel");
    elements.submitButton.querySelector("small").textContent = t("submitSubtext");
    setMessage(elements.recordMessage, "");
    setMessage(elements.lookupMessage, "");
  }

  function setModeBadge() {
    if (hasCloudConfig) {
      elements.modeBadge.textContent = t("cloudMode");
      elements.modeBadge.classList.add("cloud");
    } else {
      elements.modeBadge.textContent = t("demoMode");
      elements.modeBadge.classList.remove("cloud");
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

  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }

  function sha256Fallback(bytes) {
    const constants = new Uint32Array([
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ]);
    const hash = new Uint32Array([
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ]);

    const bitLength = bytes.length * 8;
    const totalLength = Math.ceil((bytes.length + 9) / 64) * 64;
    const padded = new Uint8Array(totalLength);
    padded.set(bytes);
    padded[bytes.length] = 0x80;
    const paddedView = new DataView(padded.buffer);
    paddedView.setUint32(totalLength - 8, Math.floor(bitLength / 0x100000000), false);
    paddedView.setUint32(totalLength - 4, bitLength >>> 0, false);

    const words = new Uint32Array(64);
    for (let offset = 0; offset < totalLength; offset += 64) {
      for (let index = 0; index < 16; index += 1) {
        words[index] = paddedView.getUint32(offset + index * 4, false);
      }
      for (let index = 16; index < 64; index += 1) {
        const s0 = rightRotate(words[index - 15], 7) ^ rightRotate(words[index - 15], 18) ^ (words[index - 15] >>> 3);
        const s1 = rightRotate(words[index - 2], 17) ^ rightRotate(words[index - 2], 19) ^ (words[index - 2] >>> 10);
        words[index] = (words[index - 16] + s0 + words[index - 7] + s1) >>> 0;
      }

      let [a, b, c, d, e, f, g, h] = hash;
      for (let index = 0; index < 64; index += 1) {
        const sigma1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        const choose = (e & f) ^ (~e & g);
        const temp1 = (h + sigma1 + choose + constants[index] + words[index]) >>> 0;
        const sigma0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        const majority = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (sigma0 + majority) >>> 0;
        h = g;
        g = f;
        f = e;
        e = (d + temp1) >>> 0;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) >>> 0;
      }

      hash[0] = (hash[0] + a) >>> 0;
      hash[1] = (hash[1] + b) >>> 0;
      hash[2] = (hash[2] + c) >>> 0;
      hash[3] = (hash[3] + d) >>> 0;
      hash[4] = (hash[4] + e) >>> 0;
      hash[5] = (hash[5] + f) >>> 0;
      hash[6] = (hash[6] + g) >>> 0;
      hash[7] = (hash[7] + h) >>> 0;
    }

    return Array.from(hash)
      .map((word) => word.toString(16).padStart(8, "0"))
      .join("");
  }

  async function sha256(value) {
    const bytes = new TextEncoder().encode(value);
    if (globalThis.crypto?.subtle) {
      const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", bytes);
      return Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
    }
    return sha256Fallback(bytes);
  }

  async function contactHash(email, phone) {
    return sha256(`${normalizeEmail(email)}|${normalizePhone(phone)}`);
  }

  function getLocalRecords() {
    try {
      const current = JSON.parse(safeStorageGet(STORAGE_KEY) || "[]");
      if (Array.isArray(current) && current.length) return current;

      const previous = JSON.parse(safeStorageGet("sutra-recitation-records-v1") || "[]");
      return Array.isArray(previous) ? previous : [];
    } catch {
      return [];
    }
  }

  function saveLocalRecords(records) {
    safeStorageSet(STORAGE_KEY, JSON.stringify(records));
  }

  function computeLocalStats(records = getLocalRecords()) {
    const participants = new Set(records.map((item) => item.contact_hash).filter(Boolean)).size;
    const recitationTotal = records.reduce((sum, item) => sum + Number(item.count || 0), 0);
    return {
      participantCount: participants,
      recitationTotal,
      recordCount: records.length
    };
  }

  function renderStats(stats) {
    latestStats = {
      participantCount: Number(stats?.participantCount || 0),
      recitationTotal: Number(stats?.recitationTotal || 0),
      recordCount: Number(stats?.recordCount || 0)
    };
    elements.participantTotal.textContent = formatNumber(latestStats.participantCount);
    elements.allTotal.textContent = formatNumber(latestStats.recitationTotal);
    elements.recordTotal.textContent = formatNumber(latestStats.recordCount);
  }

  async function fetchPublicStats() {
    if (!hasCloudConfig) return computeLocalStats();

    const { data, error } = await client.rpc("get_baoqie_public_stats");
    if (error) throw new Error(error.message);

    const row = Array.isArray(data) ? data[0] : data;
    return {
      participantCount: Number(row?.participant_count || 0),
      recitationTotal: Number(row?.recitation_total || 0),
      recordCount: Number(row?.record_count || 0)
    };
  }

  async function refreshStats() {
    try {
      const stats = await fetchPublicStats();
      renderStats(stats);
      return stats;
    } catch (error) {
      console.error("Unable to load public stats:", error);
      elements.participantTotal.textContent = "—";
      elements.allTotal.textContent = "—";
      elements.recordTotal.textContent = "—";
      return null;
    }
  }

  function setMessage(element, text, success = false) {
    element.textContent = text;
    element.classList.toggle("success", success);
  }

  function setBusy(button, busy) {
    button.disabled = busy;
    if (button === elements.lookupButton) {
      button.textContent = busy ? t("lookupBusy") : t("lookupButton");
    }
  }

  function validateContact(email, phone) {
    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone);
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail) || normalizedEmail.length > 254) return t("errEmail");
    if (normalizedPhone.length < 8 || normalizedPhone.length > 30) return t("errPhone");
    return "";
  }

  function createRecordId() {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
      const random = Math.floor(Math.random() * 16);
      const value = character === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    });
  }

  async function submitRecord(payload) {
    if (hasCloudConfig) {
      const { error } = await client.from("baoqie_recitations").insert(payload);
      if (error) throw new Error(error.message);
      return;
    }

    const records = getLocalRecords();
    records.push({
      id: createRecordId(),
      created_at: new Date().toISOString(),
      ...payload
    });
    saveLocalRecords(records);
  }

  async function lookupRecords(hash) {
    if (hasCloudConfig) {
      const { data, error } = await client.rpc("lookup_baoqie_recitations", { p_contact_hash: hash });
      if (error) throw new Error(error.message);
      return data || [];
    }
    return getLocalRecords().filter((item) => item.contact_hash === hash);
  }

  function recordTypeText(recordType) {
    const keyByType = {
      sutra: "recordTypeSutra",
      dharani: "recordTypeDharani",
      title: "recordTypeTitle"
    };
    return keyByType[recordType] ? t(keyByType[recordType]) : t("legacyRecordType");
  }

  function interfaceLanguageText(interfaceLanguage) {
    const keyByLanguage = {
      "zh-TW": "interfaceLanguageZh",
      en: "interfaceLanguageEn",
      ja: "interfaceLanguageJa"
    };
    const languageName = keyByLanguage[interfaceLanguage]
      ? t(keyByLanguage[interfaceLanguage])
      : t("legacyInterfaceLanguage");
    return `${t("interfaceLanguageLabel")}：${languageName}`;
  }

  function renderRecordList(records) {
    lastLookupRecords = [...records];
    elements.recordList.replaceChildren();
    const sorted = [...records].sort((a, b) => new Date(b.recited_at) - new Date(a.recited_at));

    sorted.forEach((record) => {
      const item = document.createElement("article");
      item.className = "record-item";

      const date = new Date(record.recited_at);
      const title = document.createElement("div");
      title.innerHTML = `<strong>${escapeHtml(record.name)}</strong><br><time>${date.toLocaleString(localeCode(), { dateStyle: "medium", timeStyle: "short" })}</time>`;

      const count = document.createElement("strong");
      count.textContent = t("recordCountText", { count: formatNumber(record.count) });

      const note = document.createElement("small");
      note.textContent = recordTypeText(record.record_type);

      const languageNote = document.createElement("small");
      languageNote.textContent = interfaceLanguageText(record.interface_language);

      item.append(title, count, note, languageNote);
      elements.recordList.append(item);
    });
  }

  function renderSuccessCopy(context) {
    lastSuccessContext = context;
    const community = context.stats
      ? t("community", {
          participants: formatNumber(context.stats.participantCount),
          total: formatNumber(context.stats.recitationTotal)
        })
      : t("auspiciousFallback");
    elements.successCopy.textContent = t("successCopy", {
      name: context.name,
      count: formatNumber(context.count),
      type: recordTypeText(context.recordType),
      community
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[char]);
  }

  $$('[data-language]').forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.language));
  });

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

  $$('[data-count]').forEach((button) => {
    button.addEventListener("click", () => {
      elements.count.value = button.dataset.count;
      $$('[data-count]').forEach((item) => item.classList.toggle("selected", item === button));
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
    const recordType = elements.recordType.value;
    const count = Number(elements.count.value);
    const email = $("#email").value;
    const phone = $("#phone").value;
    const recitedAt = elements.recitedAt.value;
    const consent = $("#consent").checked;

    if (!name) return setMessage(elements.recordMessage, t("errName"));
    if (!RECORD_TYPES.includes(recordType)) return setMessage(elements.recordMessage, t("errRecordType"));
    if (!Number.isInteger(count) || count < 1 || count > 1000000) return setMessage(elements.recordMessage, t("errCount"));
    const contactError = validateContact(email, phone);
    if (contactError) return setMessage(elements.recordMessage, contactError);
    if (!recitedAt) return setMessage(elements.recordMessage, t("errTime"));
    if (!consent) return setMessage(elements.recordMessage, t("errConsent"));

    elements.submitButton.disabled = true;
    setMessage(elements.recordMessage, t("registering"));

    try {
      const normalizedEmail = normalizeEmail(email);
      const normalizedPhone = normalizePhone(phone);
      const hash = await contactHash(normalizedEmail, normalizedPhone);

      await submitRecord({
        name,
        record_type: recordType,
        interface_language: currentLanguage,
        count,
        email: normalizedEmail,
        phone: normalizedPhone,
        recited_at: new Date(recitedAt).toISOString(),
        contact_hash: hash
      });

      const stats = await refreshStats();
      setMessage(elements.recordMessage, t("recordSuccess"), true);
      renderSuccessCopy({ name, recordType, count, stats });
      elements.dialog.hidden = false;
      elements.recordForm.reset();
      elements.count.value = 108;
      elements.recitedAt.value = toLocalDateTimeInput();
      $$('[data-count]').forEach((item) => item.classList.toggle("selected", item.dataset.count === "108"));
    } catch (error) {
      console.error(error);
      setMessage(elements.recordMessage, t("recordFailed"));
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

    setBusy(elements.lookupButton, true);
    setMessage(elements.lookupMessage, t("lookupSearching"));

    try {
      const hash = await contactHash(email, phone);
      const records = await lookupRecords(hash);
      if (!records.length) {
        lastLookupRecords = [];
        setMessage(elements.lookupMessage, t("lookupNotFound"));
        return;
      }
      const total = records.reduce((sum, item) => sum + Number(item.count || 0), 0);
      lastPersonalTotal = total;
      elements.personalTotal.textContent = formatNumber(total);
      renderRecordList(records);
      elements.lookupResult.hidden = false;
      setMessage(elements.lookupMessage, t("lookupFound", { count: formatNumber(records.length) }), true);
    } catch (error) {
      console.error(error);
      setMessage(elements.lookupMessage, t("lookupFailed"));
    } finally {
      setBusy(elements.lookupButton, false);
    }
  });

  $("#close-dialog").addEventListener("click", () => { elements.dialog.hidden = true; });
  $(".dialog-backdrop").addEventListener("click", () => { elements.dialog.hidden = true; });

  elements.recitedAt.value = toLocalDateTimeInput();
  $("[data-count='108']").classList.add("selected");
  applyLanguage(currentLanguage, false);
  refreshStats();
})();
