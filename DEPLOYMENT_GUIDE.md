# 寶篋印念誦 v5 部署指南

## 第一階段：先升級 Supabase

本次新增 `interface_language` 欄位，因此既有 Supabase 專案必須先執行升級。

1. 登入 Supabase，進入 `baoqie-recite` 專案。
2. 點左側 `SQL Editor`。
3. 點 `New query`。
4. 打開本套件的 `supabase-upgrade.sql`，複製全部內容貼入。
5. 點 `Run`。
6. 成功時應顯示 `Success. No rows returned`。
7. 到 `Table Editor` → `baoqie_recitations`，確認已出現 `interface_language` 欄位。

新紀錄會自動寫入：

- `zh-TW`：繁體中文
- `en`：English
- `ja`：日本語

舊紀錄不會被刪除或猜測語言；既有資料的 `interface_language` 會保持空白。

## 第二階段：上傳 GitHub

1. 打開 GitHub repository：`altolee/baoqie-recite`。
2. 確認分支為 `main`。
3. 點 `Add file` → `Upload files`。
4. 將八個專案檔案全部上傳並覆蓋同名檔案。
5. Commit message 建議填：`Track interface language for each record`。
6. 直接提交到 `main`。

## 第三階段：確認 Vercel

GitHub 與 Vercel 已連接時，main 的新 commit 會自動部署。

1. 進入 Vercel 的 `baoqie-recite`。
2. 打開 `Deployments`。
3. 等最新部署顯示 `Ready` 與 `Production`。
4. 打開正式網站並強制重新整理。

## 驗收

1. 切換到繁中後送出，`interface_language` 應為 `zh-TW`。
2. 切換到 English 後送出，欄位應為 `en`。
3. 切換到日本語後送出，欄位應為 `ja`。
4. 使用相同 Email 與電話查詢時，每筆紀錄會顯示當時的登錄介面。
5. 手動切換語言後再送出，應記錄送出當下的介面，而不是最初瀏覽器語言。

## 快取

本版使用 `styles.css?v=5`、`config.js?v=5`、`app.js?v=5`。
