# 寶篋印念誦｜Baoqie Recite

「一切如來心秘密全身舍利寶篋印陀羅尼」手機優先念誦登錄平台。

- 網站品牌：寶篋印念誦
- 英文名稱：Baoqie Recite
- GitHub：`altolee/baoqie-recite`
- Vercel 專案：`baoqie-recite`
- Supabase 資料表：`baoqie_recitations`

## 主要功能

- 姓名或稱呼、念誦次數、念誦時間登錄
- 7、21、49、108 遍快速選擇
- 本日與累積念誦統計
- 以 Email + 電話查詢本人歷史紀錄
- Email 與電話不以明文寫入資料庫，而是組合後轉為 SHA-256 識別碼
- 尚未連接 Supabase 時，自動切換為瀏覽器本機示範模式

## 啟用 Supabase

1. 在 Supabase 建立專案，建議名稱 `baoqie-recite`。
2. 打開 SQL Editor，執行 `supabase.sql`。
3. 到 Project Settings / API，取得 Project URL 與 anon 或 publishable key。
4. 編輯 `config.js`：

```js
window.APP_CONFIG = {
  SUPABASE_URL: "https://你的專案.supabase.co",
  SUPABASE_ANON_KEY: "你的 anon 或 publishable key"
};
```

請勿將 `service_role` secret key 放進前端檔案。

## 部署到 Vercel

本專案為純靜態網站：

- Framework Preset：Other
- Build Command：留空
- Output Directory：留空
- Project Name：`baoqie-recite`

連結 GitHub repository `altolee/baoqie-recite` 後即可部署。

## 正式公開前

建議補上完整隱私權政策、管理者後台、濫用防護、備份與個資事件處理流程。
