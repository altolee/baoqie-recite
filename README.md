# 寶篋印念誦｜Baoqie Recite v5

「一切如來心秘密全身舍利寶篋印陀羅尼」手機優先念誦登錄平台。

## v5 新增功能

- Supabase 新增 `interface_language` 欄位。
- 使用者送出紀錄時，系統依目前實際使用中的介面自動寫入：
  - `zh-TW`：繁體中文介面
  - `en`：英文介面
  - `ja`：日文介面
- 首次開啟仍會依瀏覽器語言自動選擇介面；若使用者手動切換，送出時以當下選中的介面為準。
- 本人紀錄查詢會顯示每筆資料當時使用的登錄介面。
- 舊紀錄無法回推當時語言，因此 `interface_language` 保持空白，查詢時顯示未知介面舊紀錄。
- 新增 `baoqie_recitations_interface_language_idx` 索引，方便日後統計三種介面的使用情形。

## 資料庫設計

本版使用一個標準化欄位 `interface_language` 記錄三種可能值，而不是建立中文、英文、日文三個真假欄位。這可避免同一筆資料同時被標記為多種語言，也更容易查詢與統計。

## v4 功能

- 首頁活動說明：［虔誦經題求加被・千經萬咒祈和平］。
- 三種記錄類型：誦經、持咒、持誦經題。
- Supabase `record_type` 欄位與本人紀錄類型顯示。

## 部署重點

必須先在既有 Supabase 專案執行新版 `supabase-upgrade.sql`，確認出現 `interface_language` 欄位，再上傳網站檔案到 GitHub。

## 安全提醒

`config.js` 只可使用 Supabase Publishable／anon key。請勿將 `service_role`、`sb_secret_` 或資料庫密碼放進前端或 GitHub。
