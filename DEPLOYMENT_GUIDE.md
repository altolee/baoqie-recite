# 寶篋印念誦 v2 部署指引

## 第一階段：先升級 Supabase

1. 登入 Supabase，進入 `baoqie-recite` 專案。
2. 點左側 `SQL Editor`。
3. 點 `New query`。
4. 打開本資料夾的 `supabase-upgrade.sql`，複製全部內容貼入。
5. 點 `Run`。
6. 成功時會看到 `Success. No rows returned`。

## 第二階段：上傳 GitHub

建議在 GitHub repository 首頁使用：

`Add file` → `Upload files`

把以下檔案拖入上傳區：

- `index.html`
- `styles.css`
- `app.js`
- `config.js`
- `supabase.sql`
- `supabase-upgrade.sql`
- `README.md`
- `DEPLOYMENT_GUIDE.md`

GitHub 會提示同名檔案將被覆蓋。提交訊息可填：

`Upgrade Baoqie Recite with contact fields and public stats`

再按 `Commit changes`。

## 第三階段：確認 Vercel

1. 回到 Vercel 的 `baoqie-recite` 專案。
2. 點 `Deployments`。
3. 等待最新一筆部署顯示 `Ready`、`Production`。
4. 打開正式網址並強制重新整理。

## 第四階段：測試

1. 首頁應顯示三個數字：累計參與、累計念誦、登錄紀錄。
2. 新增一筆測試紀錄。
3. 到 Supabase `Table Editor` → `baoqie_recitations`。
4. 確認新資料列的 `email`、`phone`、`contact_hash` 都有值。
5. 用相同 Email 與電話測試「查詢紀錄」。
