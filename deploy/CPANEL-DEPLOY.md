# Deploying macnetsolutions.com.bd on cPanel

The site runs as a Node.js app in cPanel (**Setup Node.js App**). Its data lives in **MongoDB Atlas** (free tier), because the hosting plan has no MongoDB.

> Never paste passwords or connection strings into chat. Put them only in the files and cPanel fields named below.

---

## 1. Create the database (MongoDB Atlas, once)

1. Sign up at <https://www.mongodb.com/atlas> and create a **free (M0) cluster**. A Singapore or Mumbai region is closest to Dhaka.
2. **Database Access → Add New Database User**: choose a username and an auto-generated password and save them somewhere safe. Role: *Read and write to any database*.
3. **Network Access → Add IP Address**: add `103.191.51.2` (your cPanel server), and your current IP so you can seed from the Mac. *(Allowing `0.0.0.0/0` also works, but is less safe.)*
4. **Connect → Drivers**: copy the connection string. Insert the database name `macnet` before the `?`, like this:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/macnet?retryWrites=true&w=majority`

## 2. Put the production settings on the Mac (not in chat)

Create the file `web/.env.production` (it is git-ignored) with:

```
DATABASE_URL="mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/macnet?retryWrites=true&w=majority"
NEXT_PUBLIC_SITE_URL="https://macnetsolutions.com.bd"
SEED_ADMIN_EMAIL="your-admin-email@example.com"
SEED_ADMIN_PASSWORD="a-long-password-you-choose"
```

## 3. Fill the Atlas database (from the Mac, in `web/`)

```bash
pnpm db:push:prod     # creates the collections and indexes in Atlas
pnpm db:seed:prod     # loads the starting content and your admin user
```

**Warning:** `db:seed:prod` wipes and reloads the site content. Run it **once**, before launch, never after real enquiries arrive.

## 4. Build the upload package (from the Mac, in `web/`)

```bash
pnpm package:cpanel
```

This builds against the Atlas database and creates **`web/deploy/macnet-cpanel.zip`**. The build refuses to run if the database is still the local one. No `.env` file is placed inside the zip.

## 5. Upload to cPanel

1. cPanel → **File Manager** → open `/home/macnetso`, create a folder **`macnet`**, and open it.
2. **Upload** `macnet-cpanel.zip`, then right-click it → **Extract** into `/home/macnetso/macnet`. Then delete the zip.
3. Check that `app.js`, `server.js`, `.next`, `node_modules` and `public` are directly inside `macnet/`. *(Turn on "Show hidden files" in File Manager settings to see `.next`.)*

## 6. Create the Node.js app

cPanel → **Setup Node.js App** (or *Node.js → Create Application*):

| Field | Value |
|---|---|
| Node.js version | **20** or **22**: the highest offered, at least 20.9 |
| Application mode | **Production** |
| Application root | `macnet` |
| Application URL | `macnetsolutions.com.bd` (leave the path empty) |
| Application startup file | `app.js` |

Add these **environment variables**, then click **Create** / **Save**:

| Name | Value |
|---|---|
| `DATABASE_URL` | the same Atlas connection string as in step 2 |
| `AUTH_SECRET` | a long random value: run `openssl rand -base64 32` on the Mac and paste the result |
| `AUTH_TRUST_HOST` | `true` |
| `AUTH_URL` | `https://macnetsolutions.com.bd` |
| `NEXT_PUBLIC_SITE_URL` | `https://macnetsolutions.com.bd` |
| `LEAD_ALERT_EMAIL` | `sales@macnetsolution.com.bd` (or the corrected address) |
| `NODE_ENV` | `production` |

Do **not** run "NPM install": the package already contains everything it needs. Click **Start** (or **Restart**), then open <https://macnetsolutions.com.bd> and <https://macnetsolutions.com.bd/admin>.

**Notes**
- Pointing the main domain at the Node app **replaces whatever website is shown there now**. Email accounts are not affected.
- The SSL certificate shown as Active in cPanel keeps working. Use `https://` links.
- Pages are pre-built from the database and refresh from Atlas every 15 minutes.

## 7. If something goes wrong

- **Logs**: cPanel File Manager → `/home/macnetso/macnet/stderr.log` (and `stdout.log` if present). Or open the app in *Setup Node.js App*, where the log path is shown.
- **"Internal Server Error" or a blank page**: usually a missing environment variable or a wrong `DATABASE_URL`. Fix it, then **Restart**.
- **Database timeouts**: check Atlas *Network Access* allows `103.191.51.2`.
- **Memory**: the app uses about 60–100 MB. The plan allows 700 MB.

## 8. Updating the site later

On the Mac, in `web/`: run `pnpm package:cpanel` to make a new zip. Then in cPanel:

1. Stop the app.
2. In File Manager, delete the old contents of `macnet/`, but **keep** `stderr.log` if you want the history.
3. Upload and extract the new zip.
4. Restart the app.

The environment variables stay saved in cPanel.
