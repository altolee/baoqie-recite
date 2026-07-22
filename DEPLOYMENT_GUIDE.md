# 寶篋印念誦 v3 三語版部署指南

## 本次是否需要修改 Supabase？

- 已經完成 v2 資料庫升級：不需要再次執行 SQL。
- 尚未新增 `email`、`phone` 欄位與首頁統計函式：先在 Supabase SQL Editor 執行 `supabase-upgrade.sql`。

三語功能都在網站前端，不會建立三份資料，也不會改變既有紀錄。繁中、英文、日文介面共用同一個 `baoqie_recitations` 資料表。

## 上傳 GitHub

1. 解壓縮 `baoqie-recite-v3.zip`。
2. 打開 GitHub repository：`altolee/baoqie-recite`。
3. 確認分支為 `main`。
4. 點 `Add file` → `Upload files`。
5. 將解壓縮資料夾裡面的八個檔案全部拖入上傳區，不要只上傳 ZIP。
6. Commit message 填：`Add Traditional Chinese English and Japanese interfaces`。
7. 選擇直接提交到 `main`，按 `Commit changes`。

## Vercel

GitHub 與 Vercel 已連接時，新的 main commit 會觸發部署。

1. 進入 Vercel 的 `baoqie-recite`。
2. 打開 `Deployments`。
3. 等最新部署顯示 `Ready` 與 `Production`。
4. 打開正式網站並強制重新整理。

## 驗收

首頁上方應出現：

- `繁中`
- `EN`
- `日本語`

逐一點擊確認：

- 標題、統計、表單、個資說明、回向偈、查詢與成功訊息會切換語言。
- 切換語言不會清除表單中已輸入的資料。
- 重新整理後會保留上次選擇的語言。
- 三種語言登錄的資料都進入同一張 Supabase 資料表。

## 快取

本版使用 `styles.css?v=3`、`config.js?v=3`、`app.js?v=3`，用來降低瀏覽器讀取舊版檔案的機率。
