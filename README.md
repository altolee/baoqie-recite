# 寶篋印念誦｜Baoqie Recite v3

「一切如來心秘密全身舍利寶篋印陀羅尼」手機優先念誦登錄平台。

## v3 新增功能

- 三語介面：繁體中文、English、日本語
- 首頁語言切換按鈕
- 首次開啟時依瀏覽器語言選擇介面
- 使用者選擇會保存在瀏覽器，下次沿用
- 日期、數字、驗證訊息、成功訊息及查詢結果會跟隨語言切換
- 日文介面使用 Noto Sans JP／Noto Serif JP 字體

## 原有功能

- 姓名或稱呼、Email、電話、念誦次數與時間登錄
- 7、21、49、108 遍快速選擇
- 累計參與人數、累計念誦遍數、登錄紀錄筆數
- 以 Email + 電話查詢本人歷史紀錄
- Email 與電話分欄保存，另以 SHA-256 contact_hash 進行本人查詢與不重複人數統計
- 未連接 Supabase 時，自動切換為瀏覽器本機示範模式

## 檔案

- `index.html`：三語頁面結構
- `styles.css`：手機版介面與語言切換樣式
- `app.js`：三語翻譯、資料登錄、查詢與統計
- `config.js`：Supabase 公開前端設定
- `supabase.sql`：新 Supabase 專案完整設定
- `supabase-upgrade.sql`：既有舊版資料庫升級用
- `DEPLOYMENT_GUIDE.md`：更新部署步驟

## Supabase

已經執行過 v2 的 `supabase-upgrade.sql`，本次只增加語言介面，不需要再次修改資料庫。

尚未執行過 v2 升級時，請先執行本套件內的 `supabase-upgrade.sql`，再部署網站。

## 安全提醒

`config.js` 只可使用 Supabase Publishable／anon key。請勿將 `service_role`、`sb_secret_` 或資料庫密碼放進前端或 GitHub。
