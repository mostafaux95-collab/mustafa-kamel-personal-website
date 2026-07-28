# Deploying to mustafakamel.com (free tier)

Stack: **Vercel** (frontend) + **Render** (backend API) + **Neon** (Postgres) + **Cloudflare R2** (file storage), domain at **Namecheap**.

All four services are free with no credit card required. The one tradeoff: Render's free web service sleeps after 15 minutes of no traffic and takes ~1 minute to wake on the next request — fine for an admin/CMS backend, not for a high-traffic public API.

I can't create these accounts for you (they need your email/ToS acceptance), but every code change needed is already done. Follow these steps in order.

## 1. Push the repo to GitHub

You'll need a GitHub account. Once you have one:

```bash
gh repo create mustafakamel-portfolio --private --source=. --remote=origin
git push -u origin main
```

(Or create the repo manually on github.com and run `git remote add origin <url>` then `git push -u origin main`.)

## 2. Database — Neon

1. Sign up at [neon.tech](https://neon.tech) (free, GitHub login works).
2. Create a project (any region close to you).
3. Copy the **pooled connection string** (Neon shows two — use the one with `-pooler` in the hostname, e.g. `postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require`). This is your `DATABASE_URL`.

## 3. File storage — Cloudflare R2

1. Sign up at [dash.cloudflare.com](https://dash.cloudflare.com) (free).
2. Go to **R2 Object Storage** → **Create bucket** → name it e.g. `portfolio-media`.
3. In the bucket's **Settings** tab, enable **Public access** (r2.dev subdomain) — copy the public URL shown (looks like `https://pub-xxxxxxxx.r2.dev`). This is `R2_PUBLIC_URL`.
4. Go to **R2** → **Manage API tokens** → **Create API token** → permissions: **Object Read & Write**, scoped to your bucket. Copy the **Access Key ID** and **Secret Access Key**.
5. Your **Account ID** is shown on the R2 overview page (right sidebar).

You now have: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME=portfolio-media`, `R2_PUBLIC_URL`.

## 4. Backend — Render

1. Sign up at [render.com](https://render.com) (free, GitHub login).
2. **New** → **Web Service** → connect your GitHub repo.
3. Settings:
   - **Root directory**: `server`
   - **Runtime**: Node
   - **Build command**: `npm install && npx prisma generate && npm run build`
   - **Start command**: `npx prisma migrate deploy && node dist/src/main.js`
   - **Instance type**: Free
4. Add environment variables (Render dashboard → your service → **Environment**):

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `4000` |
   | `DATABASE_URL` | *(Neon pooled connection string from step 2)* |
   | `JWT_ACCESS_SECRET` | *(generate: `openssl rand -hex 32`)* |
   | `JWT_ACCESS_TTL` | `15m` |
   | `JWT_REFRESH_SECRET` | *(generate another: `openssl rand -hex 32`)* |
   | `JWT_REFRESH_TTL_DAYS` | `30` |
   | `COOKIE_SECRET` | *(generate another: `openssl rand -hex 32`)* |
   | `CORS_ORIGIN` | `https://mustafakamel.com` |
   | `SUPER_ADMIN_EMAIL` | `3lanoor.love@gmail.com` |
   | `SUPER_ADMIN_FIRST_NAME` | `Mustafa` |
   | `SUPER_ADMIN_LAST_NAME` | `Kamel` |
   | `MAIL_TRANSPORT` | `console` |
   | `MAIL_FROM` | `no-reply@mustafakamel.com` |
   | `APP_URL` | `https://mustafakamel.com` |
   | `R2_ACCOUNT_ID` | *(from step 3)* |
   | `R2_ACCESS_KEY_ID` | *(from step 3)* |
   | `R2_SECRET_ACCESS_KEY` | *(from step 3)* |
   | `R2_BUCKET_NAME` | `portfolio-media` |
   | `R2_PUBLIC_URL` | *(from step 3)* |

5. Deploy. Render gives you a URL like `https://mustafakamel-portfolio.onrender.com` — the start command above already runs the Prisma migration on every boot, but seeding (creating permissions + the Super Admin user) is a separate one-time step: open Render's **Shell** tab for your service and run:

   ```bash
   npm run prisma:seed
   ```

6. That command prints the generated Super Admin password to the shell output — copy it, you'll need it to log into `/admin`. Re-running it later is safe (it skips creating the Super Admin if one already exists).

## 5. Frontend — Vercel

1. Sign up at [vercel.com](https://vercel.com) (free, GitHub login).
2. **Add New** → **Project** → import your GitHub repo.
3. Settings: framework preset **Vite**, root directory `.` (leave default — the frontend is at the repo root).
4. Add environment variable:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://api.mustafakamel.com/api` |

5. Deploy. Vercel gives you a `*.vercel.app` URL first — that's expected before the domain is connected.

## 6. Connect mustafakamel.com (Namecheap)

In Namecheap → your domain → **Advanced DNS**, add:

| Type | Host | Value |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |
| CNAME | `api` | *(your Render service's `.onrender.com` hostname, from step 4)* |

Then in **Vercel** → your project → **Settings → Domains**, add `mustafakamel.com` and `www.mustafakamel.com`.
In **Render** → your service → **Settings → Custom Domain**, add `api.mustafakamel.com`.

DNS propagation usually takes a few minutes to a few hours. Both Vercel and Render issue free HTTPS certificates automatically once the DNS resolves.

## 7. After it's live

- Log into `https://mustafakamel.com/admin` with the Super Admin email and the password from the Render deploy logs (step 4.6) — **change it immediately** via the admin panel.
- Every future `git push` to `main` auto-redeploys both Vercel and Render.
- If Render's free instance feels slow on first load after idling, that's the 15-minute sleep/cold-start — no action needed, it wakes itself.
