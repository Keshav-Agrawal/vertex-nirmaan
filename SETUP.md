# Vertex Nirmaan — Enquiry Inbox & Admin Setup

This connects your website's enquiry form to a Google Sheet, and unlocks the hidden
admin page (`admin.html`) where you can view, edit, and delete enquiries.

You only do this once. It takes about 5 minutes.

---

## Step 1 — Create the Google Sheet
1. Go to https://sheets.google.com and create a new blank spreadsheet.
2. Name it something like **Vertex Nirmaan Enquiries**. (You don't need to add any
   columns — the script creates them for you.)

## Step 2 — Add the script
1. In the sheet, click **Extensions ▸ Apps Script**.
2. Delete whatever code is shown, then open the file **google-apps-script.gs**
   (included with your website files), copy *all* of it, and paste it in.
3. Click the **Save** (disk) icon.

## Step 3 — Deploy it as a Web app
1. Click **Deploy ▸ New deployment**.
2. Click the gear icon ▸ choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**. Approve the permissions when Google asks
   (choose your account ▸ Advanced ▸ "Go to … (unsafe)" ▸ Allow — this is normal
   for your own script).
5. Copy the **Web app URL**. It ends with `/exec` and looks like:
   `https://script.google.com/macros/s/AKfycb..../exec`

## Step 4 — Tell the website the URL
1. Open **config.js** (one of your website files).
2. Paste your URL between the quotes:
   ```js
   window.VN_API_URL = "https://script.google.com/macros/s/AKfycb..../exec";
   ```
3. Save, and re-upload `config.js` to your GitHub repo (replacing the old one).

That's it. New enquiries now land in the **Enquiries** tab of your sheet.

---

## Using the admin page
- Go to `your-site-address/admin.html` (e.g. `https://yourname.github.io/vertex-nirmaan/admin.html`).
- Enter the password: **12345678**
- You'll see every enquiry, newest first. You can:
  - **Search** by name / phone / service, and **filter** by status.
  - **Edit** any enquiry (including its status: New ▸ Contacted ▸ In Progress ▸ Closed).
  - **Delete** an enquiry.
  - **Add** an enquiry manually.
  - **Export CSV** to open in Excel.

The admin page is not linked anywhere on the site — only people who know the
`/admin.html` address and the password can reach it.

---

## Changing the password later
The password is in **config.js**:
```js
window.VN_ADMIN_PASSWORD = "12345678";
```
If you change it, also change `ADMIN_TOKEN` near the top of **google-apps-script.gs**
to the *same* value, then re-deploy the script (Deploy ▸ Manage deployments ▸ edit ▸
Version: New version ▸ Deploy).

⚠️ **Note on security:** because this is a free static website, the password lives in
the page's code, so it only keeps out casual visitors — it is not bank-grade security.
It's fine for managing sales enquiries. If you later need stronger protection, a
proper login system (e.g. Firebase) can be added.
