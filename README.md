# 寶篋印念誦｜Baoqie Recite v2

「一切如來心秘密全身舍利寶篋印陀羅尼」手機優先念誦登錄平台。

## v2 新增功能

- Email 與電話分別保存於 Supabase，方便未來授權匯出 CSV／Excel。
- 保留 `contact_hash`，作為本人查詢與不重複參與人數的識別依據。
- 首頁顯示：累計參與人數、累計念誦遍數、登錄紀錄筆數。
- 公開統計函式只回傳數字，不會公開 Email、電話或個別紀錄。
- 更新個人資料使用說明與同意文字。

## 既有專案升級順序

1. 在 Supabase SQL Editor 執行 `supabase-upgrade.sql`。
2. 確認顯示 `Success. No rows returned`。
3. 將網站檔案上傳到 GitHub repository `altolee/baoqie-recite`，覆蓋同名檔案。
4. Vercel 會因 GitHub 新 commit 自動部署。
5. 在網站新增一筆測試資料，再到 Supabase Table Editor 確認 `email`、`phone` 欄位已有值。

## 重要說明

- 舊紀錄只有 `contact_hash`，無法反推出原始 Email 與電話，所以舊資料的 `email`、`phone` 會保持空白。
- 新紀錄會保存標準化後的 Email 與電話：Email 轉小寫，電話僅保留數字。
- `service_role`、`sb_secret_` 與資料庫密碼不可放入 GitHub 或前端檔案。
